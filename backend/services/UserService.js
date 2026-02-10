/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Registrar un nuevo usuario
*
* user User  (optional)
* returns User
* */
const createUser = ({ user }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        user,
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
* Eliminar un usuario
*
* id String 
* no response value expected for this operation
* */
const deleteUser = ({ id }) => new Promise(
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
* Modificar un usuario
*
* id String ID del usuario (ObjectId)
* user User  (optional)
* no response value expected for this operation
* */
const updateUser = ({ id, user }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        id,
        user,
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
  createUser,
  deleteUser,
  updateUser,
};
