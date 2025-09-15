require('dotenv').config();

module.exports = {
    MONGODB_URI: process.env.MONGODB_URI || 'your_mongodb_uri',
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000'
};
