import { Route } from "@core/interface";
import { Router } from "express";
import IndexController from "./index.controller";

class IndexRoute implements Route {
    public path = '/';
    public router = Router();
    public indexController = new IndexController();

    constructor() {
        this.initializeRoute();
    }

    private initializeRoute() {
        this.router.get(this.path, this.indexController.index)
    }
}

export default IndexRoute;