
/**
 * Jest setup file for global test configuration
 */

// Increase timeout for database operations
jest.setTimeout(30000);

// Suppress console.log during tests unless running in verbose mode
if (!process.env.VERBOSE) {
    console.log = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
}

// Global test environment variables
process.env.NODE_ENV = 'test';