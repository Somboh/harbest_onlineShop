export default () => ({
    port: process.env.PORT || 3000,
    database:{
        hostname: process.env.DB_HOSTNAME || 'localhost',
        port: process.env.DB_PORT || 3306,
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || '',
        name: process.env.DB_NAME || 'harbest',
    },
    cloudinary: {
       cloudName: process.env.CLOUDINARY_CLOUD_NAME,
       apiKey: process.env.CLOUDINARY_API_KEY,
       apiSecret: process.env.CLOUDINARY_API_SECRET
    },
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    jwt_secret: process.env.JWT_SECRET
})