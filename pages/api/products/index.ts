import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import Product from '../../../models/Product';

// MongoDB connection
const connectDB = async () => {
    if (mongoose.connections[0].readyState) {
        return;
    }
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/myapp');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectDB();

    if (req.method === 'GET') {
        try {
            const { q, marke, labels, controversy, herkunftsland } = req.query;

            const filter: any = {};

            // Text search in product name
            if (q) {
                filter.produkt = { $regex: q, $options: 'i' };
            }

            // Filter by brand
            if (marke) {
                filter.marke = { $regex: marke, $options: 'i' };
            }

            // Filter by labels
            if (labels) {
                const labelArray = Array.isArray(labels) ? labels : [labels];
                filter.labels = { $in: labelArray };
            }

            // Exclude products with specific controversies
            if (controversy) {
                const controversyArray = Array.isArray(controversy) ? controversy : [controversy];
                filter.controversy = { $nin: controversyArray };
            }

            // Filter by origin country
            if (herkunftsland) {
                filter.herkunftsland = { $regex: herkunftsland, $options: 'i' };
            }

            const products = await Product.find(filter).sort({ id: 1 });
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({
                message: 'Error fetching products',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    } else if (req.method === 'POST') {
        try {
            const { id, produkt, marke, labels, controversy, herkunftsland } = req.body;

            // Validate required fields
            if (!id || !produkt || !marke || !herkunftsland) {
                return res.status(400).json({
                    message: 'Missing required fields: id, produkt, marke, herkunftsland'
                });
            }

            const newProduct = new Product({
                id,
                produkt,
                marke,
                labels: labels || [],
                controversy: controversy || [],
                herkunftsland
            });

            const savedProduct = await newProduct.save();
            res.status(201).json(savedProduct);
        } catch (error) {
            if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
                res.status(409).json({ message: 'Product with this ID already exists' });
            } else {
                res.status(500).json({
                    message: 'Error creating product',
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}