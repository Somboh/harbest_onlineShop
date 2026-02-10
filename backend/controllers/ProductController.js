const Controller = require('./Controller');
const service = require('../services/ProductService');

const createProduct = async (request, response) => {
  await Controller.handleRequest(request, response, service.createProduct);
};

const getProducts = async (request, response) => {
  await Controller.handleRequest(request, response, service.getProducts);
};

const productIdDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service.productIdDELETE);
};

const productIdGET = async (request, response) => {
  await Controller.handleRequest(request, response, service.productIdGET);
};

const productIdPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service.productIdPUT);
};

const productsFarmerIdAgricultorGET = async (request, response) => {
  await Controller.handleRequest(request, response, service.productsFarmerIdAgricultorGET);
};


module.exports = {
  createProduct,
  getProducts,
  productIdDELETE,
  productIdGET,
  productIdPUT,
  productsFarmerIdAgricultorGET,
};
