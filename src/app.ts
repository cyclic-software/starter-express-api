import { Route } from '@core/interface';
import express from 'express';
import mongoose from 'mongoose';
import hpp from 'hpp';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import { Logger } from '@core/utils/index';
import { errorMiddleware } from '@core/middleware';

class App {
    public app: express.Application;
    public port: string | number;
    public production: boolean;

    constructor(routes: Route[]) {
        this.app = express();
        this.port = process.env.PORT || 5000;
        this.production = process.env.NODE_ENV === 'production' ? true : false;;

        this.connectToDatabase();
        this.initializeMiddleware();
        this.initializeRoutes(routes);
        this.initializeErorMiddleware();

    }
    public listen() {
        this.app.listen(this.port, () => {
            Logger.info('listening on port ' + this.port);
        });
    }
    private initializeRoutes(routers: Route[]) {
        routers.forEach(route => {
            this.app.use('/', route.router)
        });
    }
    private connectToDatabase() {
        const connectString = process.env.MONGODB_URI;
        if (!connectString) {
            return;
        }
        try {
            mongoose.connect(connectString);
            Logger.info('Connection successful');
        }
        catch (err) {
            Logger.error(err);
        }
    }
    private initializeMiddleware() {
        if (this.production) {
            this.app.use(hpp());
            this.app.use(helmet());
            this.app.use(morgan('combined'));
            this.app.use(cors({ origin: 'your-domain.com', credentials: true }));
        }
        else {
            this.app.use(morgan('dev'));
            this.app.use(cors({ origin: true, credentials: true }));
        }
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }
    private initializeErorMiddleware() {
        this.app.use(errorMiddleware);

    }
}
export default App;