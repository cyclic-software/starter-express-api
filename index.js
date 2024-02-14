"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const port = process.env.PORT || 7676;
const mobileApp = require('./mobile/mobile.js');
const webApp = require('./web/web.js');
const app = (0, express_1.default)();
app.use('/mobile', mobileApp);
app.use('/web', webApp);
app.get('/', (req, res) => {
    res.send('Hiii to my server');
});
app.listen(port, () => {
    console.log(`server is running http://localhost:${port}  `);
    console.log(`Web App is running http://localhost:${port}/web  `);
    console.log(`Mobile App is running http://localhost:${port}/mobile `);
});
