/**
 * The UserController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/UserService');
const config = require('../config.js');
const db = require('../db.js');

const createUser = async (request, response) => {
  await Controller.handleRequest(request, response, service.createUser);
};

const deleteUser = async (request, response) => {
  await Controller.handleRequest(request, response, service.deleteUser);
};

const updateUser = async (request, response) => {
  await Controller.handleRequest(request, response, service.updateUser);
};


module.exports = {
  createUser,
  deleteUser,
  updateUser,
};
