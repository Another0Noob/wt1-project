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

    if (req.method === 'GET') {
        try {
            // Get all unique labels and controversies
            const labels = await Product.distinct('labels');
            const controversies = await Product.distinct('controversy');
            const brands = await Product.distinct('marke');
            const countries = await Product.distinct('herkunftsland');

            res.status(200).json({
                labels: labels.filter(label => label && label.length > 0),
                controversies: controversies.filter(c => c && c.length > 0),
                brands: brands.filter(brand => brand && brand.length > 0),
                countries: countries.filter(country => country && country.length > 0)
            });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching categories', error });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}