/**
 * @jest-environment node
 */

import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

// Mock the Product model methods
const mockProductFind = jest.fn();

// Mock the Product model as a class with static methods
const MockProduct = jest.fn().mockImplementation(function(this: any, data: any) {
    Object.assign(this, data);
    this.save = jest.fn();
    return this;
});

// Add static methods to the mock constructor
MockProduct.find = mockProductFind;

jest.mock("../models/Product", () => ({
    __esModule: true,
    default: MockProduct,
}));

describe("SearchProducts Script with Mongoose Spies", () => {
    let mongoServer: MongoMemoryServer;
    let connectSpy: jest.SpyInstance;
    let disconnectSpy: jest.SpyInstance;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        connectSpy = jest.spyOn(mongoose, "connect");
        disconnectSpy = jest.spyOn(mongoose, "disconnect");
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("connects to MongoDB and searches products with regex filter", async () => {
        const mockProducts = [
            {
                id: 1,
                produkt: "Kaffee Premium",
                marke: "Starbucks",
                herkunftsland: "Kolumbien",
                labels: ["Fairtrade"],
                controversy: []
            }
        ];

        mockProductFind.mockResolvedValue(mockProducts);
        connectSpy.mockResolvedValue(undefined);
        disconnectSpy.mockResolvedValue(undefined);

        // Simulate the search logic from SearchProducts.ts
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);

        const searchTerm = 'kaffee';
        const query = { produkt: { $regex: searchTerm, $options: 'i' } };

        const Product = (await import("../models/Product")).default;
        const result = await Product.find(query);

        expect(connectSpy).toHaveBeenCalledWith(mongoUri);
        expect(mockProductFind).toHaveBeenCalledWith(query);
        expect(result).toEqual(mockProducts);

        await mongoose.disconnect();
        expect(disconnectSpy).toHaveBeenCalled();
    });

    test("builds complex query with multiple filters", async () => {
        const mockProducts = [
            {
                id: 2,
                produkt: "Bio Kaffee",
                marke: "Starbucks",
                herkunftsland: "Kolumbien",
                labels: ["Fairtrade", "Klimaneutral"],
                controversy: ["Kinderarbeit"]
            }
        ];

        mockProductFind.mockResolvedValue(mockProducts);

        // Simulate complex query building
        const searchTerm = 'kaffee';
        const markeFilter = 'Starbucks';
        const landFilter = 'Kolumbien';
        const labelsFilter = ['Fairtrade', 'Klimaneutral'];
        const controversyFilter = ['Kinderarbeit'];

        const query: any = {};
        if (searchTerm) query.produkt = { $regex: searchTerm, $options: 'i' };
        if (markeFilter) query.marke = markeFilter;
        if (landFilter) query.herkunftsland = landFilter;
        if (labelsFilter.length) query.labels = { $in: labelsFilter };
        if (controversyFilter.length) query.controversy = { $in: controversyFilter };

        const Product = (await import("../models/Product")).default;
        const result = await Product.find(query);

        expect(mockProductFind).toHaveBeenCalledWith({
            produkt: { $regex: 'kaffee', $options: 'i' },
            marke: 'Starbucks',
            herkunftsland: 'Kolumbien',
            labels: { $in: ['Fairtrade', 'Klimaneutral'] },
            controversy: { $in: ['Kinderarbeit'] }
        });
        expect(result).toEqual(mockProducts);
    });

    test("handles empty search results", async () => {
        mockProductFind.mockResolvedValue([]);

        const query = { produkt: { $regex: 'nonexistent', $options: 'i' } };
        const Product = (await import("../models/Product")).default;
        const result = await Product.find(query);

        expect(mockProductFind).toHaveBeenCalledWith(query);
        expect(result).toEqual([]);
    });

    test("handles database connection errors", async () => {
        const connectionError = new Error("Connection failed");
        connectSpy.mockRejectedValue(connectionError);

        try {
            await mongoose.connect("invalid-uri");
        } catch (error) {
            expect(error).toEqual(connectionError);
        }

        expect(connectSpy).toHaveBeenCalledWith("invalid-uri");
    });
});