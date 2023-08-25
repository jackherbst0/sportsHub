const express = require('express');
const bballRouter = express.Router();
const bballController = require('../controllers/apiController');
bballRouter.route('/updates').get(bballController);
module.exports = bballRouter;