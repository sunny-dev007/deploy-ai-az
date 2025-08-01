const sql = require('mssql');
const dbConfig = require('./config');

// BYPASS MODE - No actual database connection
console.log('Database connection BYPASSED - Running in STATIC MODE');

// Mock connection pool that doesn't actually connect
const mockPool = {
    request: () => ({
        input: () => mockPool.request(),
        query: () => Promise.resolve({ recordset: [] }),
        execute: () => Promise.resolve({ recordset: [] })
    }),
    close: () => Promise.resolve()
};

// Return a resolved promise with mock pool instead of actual connection
const poolPromise = Promise.resolve(mockPool);

console.log('Mock database pool created - No actual connection attempted');

module.exports = {
    sql,
    poolPromise
}; 