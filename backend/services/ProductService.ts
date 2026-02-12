/* eslint-disable no-unused-vars */
// const Service = require('./Service');
// const Product = require('../models/Product');
// const { Schema } = require('mongoose');
import Service from './Service';
import Product from '../models/Product';
import {Schema} from 'mongoose';

/**
* Registrar un nuevo producto
*
* product Product  (optional)
* returns Product
* */
const createProduct = ( product:any ) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        product,
      }));
    } catch (e:any) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Obtener todos los productos
*
* returns List
* */
const getProducts = () => new Promise(
  async (resolve, reject) => {
    try {
      const products = await Product.find({});
      resolve(Service.successResponse(products));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Eliminar producto
*
* id String 
* no response value expected for this operation
* */
const productIdDELETE = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        id,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Obtener un producto por ID
*
* id String 
* returns Product
* */
const productIdGET = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        id,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Modificar producto
*
* id String 
* product Product  (optional)
* no response value expected for this operation
* */
const productIdPUT = ({ id, product }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        id,
        product,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Obtener productos por ID de agricultor
*
* idUnderscoreagricultor String 
* returns List
* */
const productsFarmerIdAgricultorGET = ({ idUnderscoreagricultor }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        idUnderscoreagricultor,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

module.exports = {
  createProduct,
  getProducts,
  productIdDELETE,
  productIdGET,
  productIdPUT,
  productsFarmerIdAgricultorGET,
};
