const express = require('express');
const Router = express.Router();
const DogsCon = require('../controllers/Dogs')

Router.get("/", DogsCon.getDogs)
Router.post("/", DogsCon.post)
Router.get("/:id", DogsCon.oneDog)
Router.post("/delete", DogsCon.delete)

module.exports = Router

//hello