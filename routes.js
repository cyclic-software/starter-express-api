import { Router } from 'express';
import contactController from './controller/contactController.js';
import HomeContactController from './controller/HomeContactController.js';
import SignupCustomerController from './controller/SignupCustomerController.js';
import SignupProjectController from './controller/SignupProjectController.js';
import paymentController from './controller/paymentController.js';
import loginController from './controller/loginController.js';
import login from './middleware/login.js';

const routes = Router();

routes.post("/contact", contactController.create)

routes.post("/contacthome", HomeContactController.create)

routes.post("/admin/cadastrar/cliente",login,SignupCustomerController.create)

routes.post("/encontrar/endereco",SignupCustomerController.adress)

routes.post("/admin/cadastrar/projeto",login,SignupProjectController.create)

routes.post("/pagamento/creditcard",paymentController.create)

routes.post("/login", loginController.find)

routes.post("/login/changepassword",loginController.create)

routes.post("/login/changepassword/sendmail",loginController.sendEmail)

routes.get("/contratos/:id", SignupProjectController.find)

routes.get("/", (req, res) => {
    res.send('<h1>ROTA FUNCIONADO</h1>')
});


export default routes;
