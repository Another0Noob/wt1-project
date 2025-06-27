
// MongoDB seed script
db = db.getSiblingDB('myapp');

// Drop existing collection if it exists
db.products.drop();

// Insert the product data
db.products.insertMany([
    {
        id: 1,
        produkt: "Kaffee",
        marke: "Starbucks",
        labels: ["Fairtrade", "EU Bio", "Klimaneutral"],
        controversy: ["Entwaldung", "Kinderarbeit"],
        herkunftsland: "Kolumbien",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 2,
        produkt: "Schokolade (Tafel)",
        marke: "Lindt",
        labels: ["Fairtrade", "EU Bio"],
        controversy: ["Palmölindustrie"],
        herkunftsland: "Elfenbeinküste",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 3,
        produkt: "T-Shirt (Baumwolle)",
        marke: "H&M",
        labels: ["EU Bio", "recycling-Material"],
        controversy: ["Textilindustrie"],
        herkunftsland: "Bangladesch",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 4,
        produkt: "Smartphone",
        marke: "Samsung",
        labels: ["Klimaneutral"],
        controversy: ["E-Schrott", "Kinderarbeit", "Seltene Erden"],
        herkunftsland: "China",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 5,
        produkt: "Mineralwasser (1 l)",
        marke: "Gerolsteiner",
        labels: ["Klimaneutral", "recycling-Material"],
        controversy: ["Wasserprivatisierung"],
        herkunftsland: "Deutschland",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 6,
        produkt: "Sneaker",
        marke: "Nike",
        labels: ["recycling-Material"],
        controversy: ["Textilindustrie", "Arbeitsbedingungen"],
        herkunftsland: "Vietnam",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 7,
        produkt: "Olivenöl",
        marke: "Gaea",
        labels: ["EU Bio"],
        controversy: ["Monokultur", "Landraub"],
        herkunftsland: "Griechenland",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 8,
        produkt: "Laptop-Ladegerät",
        marke: "Dell",
        labels: ["Klimaneutral"],
        controversy: ["E-Schrott"],
        herkunftsland: "China",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 9,
        produkt: "Duschgel",
        marke: "Yves Rocher",
        labels: ["EU Bio", "Klimaneutral"],
        controversy: ["Palmölindustrie"],
        herkunftsland: "Frankreich",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 10,
        produkt: "Papier (A4, 500 Blatt)",
        marke: "Xerox",
        labels: ["EU Bio", "recycling-Material"],
        controversy: ["Abholzung"],
        herkunftsland: "Schweden",
        createdAt: new Date(),
        updatedAt: new Date()
    }
]);

// Create some useful indexes
db.products.createIndex({ "marke": 1 });
db.products.createIndex({ "labels": 1 });
db.products.createIndex({ "herkunftsland": 1 });

print("Seed data inserted successfully!");
print("Inserted " + db.products.countDocuments() + " products");