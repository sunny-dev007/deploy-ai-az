// Database configuration - STATIC MODE (bypassed)
const config = {
    // Database connection bypassed for static mode
    bypass: true,
    mode: 'STATIC_MODE',
    user: process.env.DB_USER || 'feserver_admin',
    password: process.env.DB_PASSWORD || '<DB_PASSWORD>',
    server: process.env.DB_SERVER || 'feappserver.database.windows.net',
    database: process.env.DB_NAME || '<DB_NAME>',
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

console.log('Database config loaded in STATIC MODE - Connection bypassed');

module.exports = config; 