const express = require("express");
require('dotenv').config();
const server = require('./src/graphql/sever');
const path = require('path'); 
const port = process.env.PORT || 3000;

const startSever = async () => {
    await server.start();
    const app = express();
    app.use(express.static(path.join(__dirname, 'public')));
    app.get("/", (req, res) => {
        res.send("Welcome");
    });
    server.applyMiddleware({app});
    app.listen(port, () => {
        console.log(`Server ready at http://localhost:8000${server.graphqlPath}`);
    })
}

startSever();
