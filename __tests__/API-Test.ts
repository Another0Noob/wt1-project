/**
 * @jest-environment node
 */

import { createMocks } from 'node-mocks-http';
import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Product from '../models/Product';

// Import API handlers
import productsHandler from '../pages/api/products/index';
import productByIdHandler from '../pages/api/products/[id]';
import categoriesHandler from '../pages/api/products/categories';

describe('Products REST API End-to-End Tests', () => {
    let mongoServer: MongoMemoryServer;

    beforeAll(async () => {
        // Start in-memory MongoDB
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();

        // Override environment variable for tests
        process.env.MONGODB_URI = mongoUri;

        // Connect to test database
        await mongoose.connect(mongoUri);
    });

    afterAll(async () => {
        // Clean up
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        // Clear database before each test
        await Product.deleteMany({});

        // Seed test data
        await Product.insertMany([
            {
                id: 1,
                produkt: 'Bio Kaffee',
                marke: 'Starbucks',
                labels: ['Fairtrade', 'Bio'],
                controversy: [],
                herkunftsland: 'Kolumbien'
            },
            {
                id: 2,
                produkt: 'Premium Tee',
                marke: 'Teekampagne',
                labels: ['Bio'],
                controversy: ['Kinderarbeit'],
                herkunftsland: 'Indien'
            },
            {
                id: 3,
                produkt: 'Kakao Pulver',
                marke: 'Alnatura',
                labels: ['Fairtrade', 'EU Bio'],
                controversy: ['Regenwaldrodung'],
                herkunftsland: 'Peru'
            }
        ]);
    });

    describe('GET /api/products', () => {
        test('returns all products without filters', async () => {
            const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
                method: 'GET',
            });

            await productsHandler(req, res);

            expect(res._getStatusCode()).toBe(200);
            const data = JSON.parse(res._getData());
            expect(data).toHaveLength(3);
            expect(data[0]).toMatchObject({
                id: 1,
                produkt: 'Bio Kaffee',
                marke: 'Starbucks'
            });
        });

        test('filters products by search query', async () => {
            const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
                method: 'GET',
                query: { q: 'kaffee' }
            });

            await productsHandler(req, res);

            expect(res._getStatusCode()).toBe(200);
            const data = JSON.parse(res._getData());
            expect(data).toHaveLength(1);
            expect(data[0].produkt).toBe('Bio Kaffee');
        });

        test('filters products by brand', async () => {
            const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
                method: 'GET',
                query: { marke: 'Starbucks' }
            });

            await productsHandler(req, res);

            expect(res._getStatusCode()).toBe(200);
            const data = JSON.parse(res._getData());
            expect(data).toHaveLength(1);
            expect(data[0].marke).toBe('Starbucks');
        });

        test('filters products by labels', async () => {
            const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
                method: 'GET',
                query: { labels: 'Fairtrade' }
            });

            await productsHandler(req, res);

            expect(res._getStatusCode()).toBe(200);
            const data = JSON.parse(res._getData());
            expect(data).toHaveLength(2);
            expect(data.every((p: any) => p.labels.includes('Fairtrade'))).toBe(true);
        });

        test('excludes products with controversies', async () => {
            const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
                method: 'GET',
                query: { controversy: 'Kinderarbeit' }
            });

            await productsHandler(req, res);

            expect(res._getStatusCode()).toBe(200);
            const data = JSON.parse(res._getData());
            expect(data).toHaveLength(2);
            expect(data.every((p: any) => !p.controversy.includes('Kinderarbeit'))).toBe(true);
        });
    });

    describe('POST /api/products', () => {
        test('creates a new product successfully', async () => {
            const newProduct = {
                id: 4,
                produkt: 'Grüner Tee',
                marke: 'Asian Tea Co',
                labels: ['Bio', 'Fairtrade'],
                controversy: [],
                herkunftsland: 'China'
            };

            const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
                method: 'POST',
                body: newProduct
            });

            await productsHandler(req, res);

            expect(res._getStatusCode()).toBe(201);
            const data = JSON.parse(res._getData());
            expect(data).toMatchObject(newProduct);

            // Verify product was saved to database
            const savedProduct = await Product.findOne({ id: 4 });
            expect(savedProduct).toBeTruthy();
        });

        test('returns 400 for missing required fields', async () => {
            const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
                method: 'POST',
                body: {
                    produkt: 'Incomplete Product'
                    // Missing id, marke, herkunftsland
                }
            });

            await productsHandler(req, res);

            expect(res._getStatusCode()).toBe(400);
            const data = JSON.parse(res._getData());
            expect(data.message).toContain('Missing required fields');
        });

        test('returns 409 for duplicate product ID', async () => {
            const duplicateProduct = {
                id: 1, // Already exists in seed data
                produkt: 'Duplicate Product',
                marke: 'Test Brand',
                herkunftsland: 'Test Country'
            };

            const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
                method: 'POST',
                body: duplicateProduct
            });

            await productsHandler(req, res);

            expect(res._getStatusCode()).toBe(409);
            const data = JSON.parse(res._getData());
            expect(data.message).toContain('already exists');
        });
    });

    describe('GET /api/products/[id]', () => {
        test('returns product by ID', async () => {
            const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
                method: 'GET',
                query: { id: '1' }
            });

            await productByIdHandler(req, res);

            expect(res._getStatusCode()).toBe(200);
            const data = JSON.parse(res._getData());
            expect(data).toMatchObject({
                id: 1,
                produkt: 'Bio Kaffee',
                marke: 'Starbucks'
            });
        });

        test('returns 404 for non-existent product', async () => {
            const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
                method: 'GET',
                query: { id: '999' }
            });

            await productByIdHandler(req, res);

            expect(res._getStatusCode()).toBe(404);
            const data = JSON.parse(res._getData());
            expect(data.message).toBe('Product not found');
        });
    });

    describe('PUT /api/products/[id]', () => {
        test('updates product successfully', async () => {
            const updatedData = {
                produkt: 'Updated Kaffee',
                marke: 'Updated Starbucks',
                labels: ['Updated', 'Fairtrade'],
                controversy: [],
                herkunftsland: 'Updated Kolumbien'
            };

            const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
                method: 'PUT',
                query: { id: '1' },
                body: updatedData
            });

            await productByIdHandler(req, res);

            expect(res._getStatusCode()).toBe(200);
            const data = JSON.parse(res._getData());
            expect(data).toMatchObject({
                id: 1,
                ...updatedData
            });

            // Verify update in database
            const updatedProduct = await Product.findOne({ id: 1 });
            expect(updatedProduct?.produkt).toBe('Updated Kaffee');
        });

        test('returns 404 when updating non-existent product', async () => {
            const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
                method: 'PUT',
                query: { id: '999' },
                body: {
                    produkt: 'Updated Product',
                    marke: 'Updated Brand',
                    herkunftsland: 'Updated Country'
                }
            });

            await productByIdHandler(req, res);

            expect(res._getStatusCode()).toBe(404);
            const data = JSON.parse(res._getData());
            expect(data.message).toBe('Product not found');
        });
    });

    describe('GET /api/products/categories', () => {
        test('returns all unique categories', async () => {
            const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
                method: 'GET'
            });

            await categoriesHandler(req, res);

            expect(res._getStatusCode()).toBe(200);
            const data = JSON.parse(res._getData());

            expect(data).toHaveProperty('labels');
            expect(data).toHaveProperty('controversies');
            expect(data).toHaveProperty('brands');
            expect(data).toHaveProperty('countries');

            expect(data.labels).toContain('Fairtrade');
            expect(data.labels).toContain('Bio');
            expect(data.brands).toContain('Starbucks');
            expect(data.countries).toContain('Kolumbien');
            expect(data.controversies).toContain('Kinderarbeit');
        });

        test('filters out empty categories', async () => {
            // Add product with empty fields
            await Product.create({
                id: 5,
                produkt: 'Test Product',
                marke: 'Test Brand',
                labels: ['', 'ValidLabel'],
                controversy: [''],
                herkunftsland: 'Test Country'
            });

            const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
                method: 'GET'
            });

            await categoriesHandler(req, res);

            expect(res._getStatusCode()).toBe(200);
            const data = JSON.parse(res._getData());

            // Should not contain empty strings
            expect(data.labels.every((label: string) => label.length > 0)).toBe(true);
            expect(data.controversies.every((c: string) => c.length > 0)).toBe(true);
        });
    });

    describe('Unsupported HTTP Methods', () => {
        test('returns 405 for unsupported method on /api/products', async () => {
            const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
                method: 'DELETE'
            });

            await productsHandler(req, res);

            expect(res._getStatusCode()).toBe(405);
            expect(res._getHeaders()['allow']).toEqual(['GET', 'POST']);
        });

        test('returns 405 for unsupported method on /api/products/[id]', async () => {
            const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
                method: 'DELETE',
                query: { id: '1' }
            });

            await productByIdHandler(req, res);

            expect(res._getStatusCode()).toBe(405);
            expect(res._getHeaders()['allow']).toEqual(['GET', 'PUT']);
        });

        test('returns 405 for unsupported method on /api/products/categories', async () => {
            const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
                method: 'POST'
            });

            await categoriesHandler(req, res);

            expect(res._getStatusCode()).toBe(405);
            expect(res._getHeaders()['allow']).toEqual(['GET']);
        });
    });

    describe('Complex Filtering Scenarios', () => {
        test('combines multiple filters', async () => {
            const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
                method: 'GET',
                query: {
                    q: 'Bio',
                    marke: 'Starbucks',
                    labels: 'Fairtrade'
                }
            });

            await productsHandler(req, res);

            expect(res._getStatusCode()).toBe(200);
            const data = JSON.parse(res._getData());
            expect(data).toHaveLength(1);
            expect(data[0]).toMatchObject({
                id: 1,
                produkt: 'Bio Kaffee',
                marke: 'Starbucks'
            });
        });

        test('returns empty array when no products match filters', async () => {
            const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
                method: 'GET',
                query: { q: 'nonexistent' }
            });

            await productsHandler(req, res);

            expect(res._getStatusCode()).toBe(200);
            const data = JSON.parse(res._getData());
            expect(data).toHaveLength(0);
        });
    });
});