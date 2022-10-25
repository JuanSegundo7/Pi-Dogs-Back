const express = require('express');
const Router = express.Router();
const TempCon = require('../controllers/Temperaments')

Router.get("/", TempCon.temperaments)

module.exports = Router
