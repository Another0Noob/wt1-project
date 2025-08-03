import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import Product from '../../../models/Product';

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

    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            const product = await Product.findOne({ id: parseInt(id as string) });

            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching product', error });
        }
    } else if (req.method === 'PUT') {
        try {
            const { produkt, marke, labels, controversy, herkunftsland } = req.body;

            const updatedProduct = await Product.findOneAndUpdate(
                { id: parseInt(id as string) },
                {
                    produkt,
                    marke,
                    labels: labels || [],
                    controversy: controversy || [],
                    herkunftsland
                },
                { new: true, runValidators: true }
            );

            if (!updatedProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }

            res.status(200).json(updatedProduct);
        } catch (error) {
            res.status(500).json({ message: 'Error updating product', error });
        }
    } else {
        res.setHeader('Allow', ['GET', 'PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}