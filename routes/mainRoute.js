
import pageRoute from "../routes/pageRoute.js";
import newsRoute from "../routes/newsRoute.js";
import userRoute from "../routes/userRoute.js";
import adminRoute from "../areas/admin/routes/adminRoute.js";
import contactRoute from "../routes/contactRoute.js"
import projectRoute from "../routes/projectRoute.js"
import roleFilter from "../middlewares/roleFilter.js"
import getContact from "../middlewares/contactMiddleware.js" 
import { checkUser } from "../middlewares/authMiddleware.js";
import { userResource } from "../config/resourceConfig.js";
import {
    showForgotPasswordForm,
    sendPasswordResetEmail,
} from '../controllers/userController.js';
import { changeLanguage } from "../controllers/languageController.js";

const setRoutes = (app) => {

    app.use("*", checkUser);
    app.use("*", userResource);
  

    app.use('/admin', roleFilter('admin'));
  
    app.use("/", pageRoute);
    app.use("/news", newsRoute);
    app.use("/users", userRoute);
    app.use("/changeLanguage", changeLanguage)
    app.use("/contact",contactRoute)
    app.use("/projects",projectRoute)
    app.use("/admin", adminRoute)
    app.get('/forgot-password', showForgotPasswordForm);

    app.post('/forgot-password', sendPasswordResetEmail);
    app.get("*", (req, res) => {
        res.status(404).render("404")
    });
    

}


export default setRoutes