const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
const port = 3005;

// const prisma = new PrismaClient();
// prisma
//     .$connect()
//     .then(() => {
const expressApp = express();

expressApp.use(cors());
expressApp.use(express.json());

require("./routes/index.js")(expressApp);

expressApp.listen(port, () => {
    console.log(`Servidor Express iniciado na porta ${port}`);
});
// })
// .catch((err) => {
//     console.log("Erro ao conectar ao banco de dados: " + err);
//     process.exit(1);
// });
