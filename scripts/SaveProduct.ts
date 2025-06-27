// scripts/SaveProduct.ts

import mongoose from 'mongoose';
import Product from '../models/shema';

const mongodbURI =
    process.env.MONGODB_URI ||
    (process.env.NODE_ENV === 'test'
        ? 'mongodb://localhost:27017/myapp'
        : 'mongodb://localhost:27017/myapp');

main().catch(err => console.log(err));
async function main() {
    try {
        await mongoose.connect(mongodbURI);

        const newProduct = new Product({
            id: 11,
            produkt: 'Kakao',
            marke: 'Alnatura',
            labels: ['Fairtrade', 'EU Bio'],
            controversy: ['Regenwaldrodung'],
            herkunftsland: 'Peru'
        });

        const savedProduct = await newProduct.save();
        console.log('Saved Product:', savedProduct);
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}