import { Router } from 'express';
import contactController from './controller/contactController.js';

const routes = Router();

routes.post("/contact", contactController.create)

routes.get("/", (req, res) => {
    res.send('<h1>ROTA FUNCIONADO</h1>')
});

export default routes;
