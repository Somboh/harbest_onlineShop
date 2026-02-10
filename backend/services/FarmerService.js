/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Registrar un nuevo agricultor
*
* farmer Farmer  (optional)
* no response value expected for this operation
* */
const createFarmer = ({ farmer }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        farmer,
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
* Eliminar agricultor
*
* id String 
* no response value expected for this operation
* */
const farmerIdDELETE = ({ id }) => new Promise(
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
* Modificar un agricultor
*
* id String 
* farmer Farmer  (optional)
* no response value expected for this operation
* */
const farmerIdPUT = ({ id, farmer }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        id,
        farmer,
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
  createFarmer,
  farmerIdDELETE,
  farmerIdPUT,
};
