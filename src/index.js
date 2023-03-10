const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
const port = 3001;

const prisma = new PrismaClient();
dotenv.config();
prisma
    .$connect()
    .then(() => {
        const expressApp = express();

        // defina suas rotas e middlewares do Cyclic aqui

        expressApp.use(cors());
        expressApp.use(express.json());

        // defina suas rotas e middlewares do Express aqui

        require("./routes/index.js")(expressApp);

        expressApp.listen(port, () => {
            console.log(`Servidor Express iniciado na porta ${port}`);
        });
    })
    .catch((err) => {
        console.log("Erro ao conectar ao banco de dados: " + err);
        process.exit(1);
    });
