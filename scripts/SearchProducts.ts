// scripts/SearchProducts.ts

import mongoose from 'mongoose';
import Product from '../models/Product';

const mongodbURI =
    process.env.MONGODB_URI ||
    (process.env.NODE_ENV === 'test'
        ? 'mongodb://localhost:27017/myapp'
        : 'mongodb://localhost:27017/myapp');

main().catch(err => console.log(err));
async function main() {
    try {
        await mongoose.connect(mongodbURI);

        // Example search/filter criteria
        const searchTerm = 'kaffee'; // partial match on produkt
        const markeFilter = 'Starbucks'; // exact match
        const landFilter = 'Kolumbien'; // exact match
        const labelsFilter = ['Fairtrade', 'Klimaneutral']; // match any label
        const controversyFilter = ['Kinderarbeit']; // match any controversy

        // Build dynamic query
        const query: any = {};
        if (searchTerm) query.produkt = { $regex: searchTerm, $options: 'i' };
        if (markeFilter) query.marke = markeFilter;
        if (landFilter) query.herkunftsland = landFilter;
        if (labelsFilter.length) query.labels = { $in: labelsFilter };
        if (controversyFilter.length) query.controversy = { $in: controversyFilter };

        const products = await Product.find(query);

        console.log('Filtered Products:', products);
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}