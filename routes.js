import { Router } from 'express';
import contactController from './controller/contactController.js';
import HomeContactController from './controller/HomeContactController.js';
import SignupCustomerController from './controller/SignupCustomerController.js';
import SignupProjectController from './controller/SignupProjectController.js';
import Multer from 'multer'
const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
    }
});


const routes = Router();

routes.post("/contact", contactController.create)

routes.post("/contacthome", HomeContactController.create)

routes.post("/admin/cadastrar/cliente", SignupCustomerController.create)

routes.post("/admin/cadastrar/projeto",multer.single('file'),SignupProjectController.create)

routes.get("/", (req, res) => {
    res.send('<h1>ROTA FUNCIONADO</h1>')
});


export default routes;
