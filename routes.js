import { Router } from 'express';
import contactController from './controller/contactController.js';
import HomeContactController from './controller/HomeContactController.js';
import SignupCustomerController from './controller/SignupCustomerController.js';

const routes = Router();

routes.post("/contact", contactController.create)

routes.post("/contacthome", HomeContactController.create)

routes.post("/contacthome", HomeContactController.create)

routes.post("/admin/cadastrar/cliente", SignupCustomerController.create)

routes.get("/", (req, res) => {
    res.send('<h1>ROTA FUNCIONADO</h1>')
});

export default routes;
