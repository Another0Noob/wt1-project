import mongoose from 'mongoose';
import Product from '../models/Product';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://25antonym02:<db_password>@wt1-project.0dhupxq.mongodb.net/?retryWrites=true&w=majority&appName=wt1-project';

const seedData = [
    {
        id: 1,
        produkt: "Kaffee",
        marke: "Starbucks",
        labels: ["Fairtrade", "EU Bio", "Klimaneutral"],
        controversy: ["Entwaldung", "Kinderarbeit"],
        herkunftsland: "Kolumbien"
    },
    {
        id: 2,
        produkt: "Schokolade (Tafel)",
        marke: "Lindt",
        labels: ["Fairtrade", "EU Bio"],
        controversy: ["Palmölindustrie"],
        herkunftsland: "Elfenbeinküste"
    },
    {
        id: 3,
        produkt: "T-Shirt (Baumwolle)",
        marke: "H&M",
        labels: ["EU Bio", "recycling-Material"],
        controversy: ["Textilindustrie"],
        herkunftsland: "Bangladesch"
    },
    {
        id: 4,
        produkt: "Smartphone",
        marke: "Samsung",
        labels: ["Klimaneutral"],
        controversy: ["E-Schrott", "Kinderarbeit", "Seltene Erden"],
        herkunftsland: "China"
    },
    {
        id: 5,
        produkt: "Mineralwasser (1 l)",
        marke: "Gerolsteiner",
        labels: ["Klimaneutral", "recycling-Material"],
        controversy: ["Wasserprivatisierung"],
        herkunftsland: "Deutschland"
    },
    {
        id: 6,
        produkt: "Sneaker",
        marke: "Nike",
        labels: ["recycling-Material"],
        controversy: ["Textilindustrie", "Arbeitsbedingungen"],
        herkunftsland: "Vietnam"
    },
    {
        id: 7,
        produkt: "Olivenöl",
        marke: "Gaea",
        labels: ["EU Bio"],
        controversy: ["Monokultur", "Landraub"],
        herkunftsland: "Griechenland"
    },
    {
        id: 8,
        produkt: "Laptop-Ladegerät",
        marke: "Dell",
        labels: ["Klimaneutral"],
        controversy: ["E-Schrott"],
        herkunftsland: "China"
    },
    {
        id: 9,
        produkt: "Duschgel",
        marke: "Yves Rocher",
        labels: ["EU Bio", "Klimaneutral"],
        controversy: ["Palmölindustrie"],
        herkunftsland: "Frankreich"
    },
    {
        id: 10,
        produkt: "Papier (A4, 500 Blatt)",
        marke: "Xerox",
        labels: ["EU Bio", "recycling-Material"],
        controversy: ["Abholzung"],
        herkunftsland: "Schweden"
    }
];

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB Atlas');

        // Clear existing data
        await Product.deleteMany({});
        console.log('Cleared existing products');

        // Insert seed data
        const insertedProducts = await Product.insertMany(seedData);
        console.log(`Inserted ${insertedProducts.length} products`);

        // Create indexes
        await Product.collection.createIndex({ "marke": 1 });
        await Product.collection.createIndex({ "labels": 1 });
        await Product.collection.createIndex({ "herkunftsland": 1 });
        console.log('Created indexes');

        console.log('Seed data inserted successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

seedDatabase();