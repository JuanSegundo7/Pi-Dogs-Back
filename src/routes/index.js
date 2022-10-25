const { Router } = require('express');
const dogs = require("./dogs.js")
const temps = require("./temperaments.js")
// Importar todos los routers;
const middleTemperaments = require("../middlewares/temperaments")
// const middleDogs = require("../middlewares/dogs")
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();
router.use([middleTemperaments])
router.use("/dogs", dogs)
router.use("/temperaments", temps)

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);


module.exports = router;
