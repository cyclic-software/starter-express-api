import { Router } from 'express';
import contactController from './controller/contactController.js';
import HomeContactController from './controller/HomeContactController.js';
import SignupCustomerController from './controller/SignupCustomerController.js';
import SignupProjectController from './controller/SignupProjectController.js';


const routes = Router();

routes.post("/contact", contactController.create)

routes.post("/contacthome", HomeContactController.create)

routes.post("/admin/cadastrar/cliente", SignupCustomerController.create)

routes.post("/admin/cadastrar/projeto",SignupProjectController.create)

routes.get("/contratos/:id", SignupProjectController.find)

routes.get("/", (req, res) => {
    res.send('<h1>ROTA FUNCIONADO</h1>')
});


export default routes;
