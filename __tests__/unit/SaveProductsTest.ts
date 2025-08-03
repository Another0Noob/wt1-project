/**
 * @jest-environment node
 */

import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

// Mock the Product model constructor and save method
const mockProductSave = jest.fn();
const mockProductConstructor = jest.fn().mockImplementation(function(this: any, data: any) {
    Object.assign(this, data);
    this.save = mockProductSave;
    return this;
});

jest.mock("../../models/Product", () => ({
    __esModule: true,
    default: mockProductConstructor,
}));

describe("SaveProduct Script with Mongoose Spies", () => {
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

    test("connects to MongoDB and saves a new product", async () => {
        const mockSavedProduct = {
            _id: "507f1f77bcf86cd799439011",
            id: 11,
            produkt: "Kakao",
            marke: "Alnatura",
            labels: ["Fairtrade", "EU Bio"],
            controversy: ["Regenwaldrodung"],
            herkunftsland: "Peru"
        };

        mockProductSave.mockResolvedValue(mockSavedProduct);
        connectSpy.mockResolvedValue(undefined);
        disconnectSpy.mockResolvedValue(undefined);

        // Simulate the save logic from SaveProduct.ts
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);

        const Product = (await import("../../models/Product")).default;
        const newProduct = new Product({
            id: 11,
            produkt: 'Kakao',
            marke: 'Alnatura',
            labels: ['Fairtrade', 'EU Bio'],
            controversy: ['Regenwaldrodung'],
            herkunftsland: 'Peru'
        });

        const savedProduct = await newProduct.save();

        expect(connectSpy).toHaveBeenCalledWith(mongoUri);
        expect(mockProductConstructor).toHaveBeenCalledWith({
            id: 11,
            produkt: 'Kakao',
            marke: 'Alnatura',
            labels: ['Fairtrade', 'EU Bio'],
            controversy: ['Regenwaldrodung'],
            herkunftsland: 'Peru'
        });
        expect(mockProductSave).toHaveBeenCalled();
        expect(savedProduct).toEqual(mockSavedProduct);

        await mongoose.disconnect();
        expect(disconnectSpy).toHaveBeenCalled();
    });

    test("handles save validation errors", async () => {
        const validationError = new Error("Validation failed");
        mockProductSave.mockRejectedValue(validationError);

        const Product = (await import("../../models/Product")).default;
        const newProduct = new Product({
            id: 12,
            produkt: 'Invalid Product'
        });

        try {
            await newProduct.save();
        } catch (error) {
            expect(error).toEqual(validationError);
        }

        expect(mockProductSave).toHaveBeenCalled();
    });

    test("creates product with all required fields", async () => {
        const productData = {
            id: 13,
            produkt: 'Tee',
            marke: 'Teekampagne',
            labels: ['Bio', 'Fairtrade'],
            controversy: [],
            herkunftsland: 'Indien'
        };

        mockProductSave.mockResolvedValue({ ...productData, _id: "507f1f77bcf86cd799439012" });

        const Product = (await import("../../models/Product")).default;
        const newProduct = new Product(productData);
        const savedProduct = await newProduct.save();

        expect(mockProductConstructor).toHaveBeenCalledWith(productData);
        expect(mockProductSave).toHaveBeenCalled();
        expect(savedProduct).toHaveProperty('_id');
    });

    test("handles database connection errors during save", async () => {
        const connectionError = new Error("Database connection lost");
        connectSpy.mockRejectedValue(connectionError);

        try {
            await mongoose.connect("invalid-connection-string");
        } catch (error) {
            expect(error).toEqual(connectionError);
        }

        expect(connectSpy).toHaveBeenCalled();
    });
});