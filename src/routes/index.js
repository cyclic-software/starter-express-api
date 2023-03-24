const { Router } = require("express");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const usersRouter = require("./usersRouter");

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter)
router.use("/users", usersRouter);

module.exports = router;
