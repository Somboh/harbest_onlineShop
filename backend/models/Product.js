const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    nombre:{
        type: String,
        required: true
    },
    precio:{
        type: Number,
        required: true
    },
    cantidad:{
        type: Number,
        required: true
    },
    descripcion:{
        type: String,
        required: true
    },
    id_agricultor:{
        type: String,
        required: true
    },
    foto:{
        type: String,
        required: true
    },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;