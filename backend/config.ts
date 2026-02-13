export default () => ({
    port: process.env.PORT || 3000,
    database: {
        uri:  process.env.MONGO_URI
    },
    cloudinary: {
       cloudName: process.env.CLOUDINARY_CLOUD_NAME,
       apiKey: process.env.CLOUDINARY_API_KEY,
       apiSecret: process.env.CLOUDINARY_API_SECRET
    },
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    jwt_secret: process.env.JWT_SECRET
})