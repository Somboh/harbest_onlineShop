const Controller = require('./Controller');

const service = require('../services/FarmerService'); // your service
const config = require('../config.js');

class UserController extends Controller {
  constructor() {
    super('user'); 
    this.registerRoutes();
  }

  registerRoutes() {
    this.app.get('/', (req, res) => {
      res.send(`Hello World. path: ${this.openApiPath}`);
    });
  }
}

module.exports = new UserController();
