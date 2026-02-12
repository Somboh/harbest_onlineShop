const mongoose = require('mongoose');
const config = require('./config.js');

const connectDB = async () => {
    try{
        const db = await mongoose.connect(config.MONGO_URI);
    }
    catch(error){
        console.error("Error al conectar a MongoDB:", error);
    }
}

module.exports = connectDB;