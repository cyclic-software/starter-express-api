import express from 'express';
import session from 'express-session';
// import swaggerUi from 'swagger-ui-express';
// import yaml from 'yamljs';
// import path from 'path';
import MongoStore from 'connect-mongo';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { localsMiddleware } from './middlewares';
import globalRouter from './routers/globalRouter';
import userRouter from './routers/userRouter';
import boardRouter from './routers/boardRouter';
import shopRouter from './routers/shopRouter';
import adminRouter from './routers/adminRouter';

const app = express();
const logger = morgan('dev');

app.set('view engine', 'pug');
app.set('views', process.cwd() + '/src/views');

app.use(logger);
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(
     session({
          secret: process.env.COOKIE_SECRET,
          resave: false,
          saveUninitialized: false,
          cookie: {
               maxAge: 3600000,
          },
          store: MongoStore.create({
               mongoUrl: process.env.DB_URL,
          }),
     }),
);

app.use(localsMiddleware);
// static 파일
app.use('/image', express.static('image'));
app.use('/uploads', express.static('uploads'));
app.use('/static', express.static('assets'));

//router
app.use('/', globalRouter);

// if (process.env.MODE === "development") {
//   //path.join vs path.resolve
//   const openAPIDocument = yaml.load(
//     path.join(__dirname, "/swagger/swagger.yaml")
//   );
//   app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openAPIDocument));
// }
app.use('/admin', adminRouter);
app.use('/users', userRouter);
app.use('/board', boardRouter);
app.use('/shop', shopRouter);

export default app;
