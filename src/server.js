import express from 'express';
import cors from 'cors';
import { RouterUser } from './routes/UserRoute/UserRoute.js';
import { RouterProfile } from './routes/ProfileRoute/ProfileRoute.js';
import { RouteCart } from './routes/CartRoute/CartRoute.js';
import { RouteAcess } from './routes/AcessRoute/AcessRoute.js';
import { RouteUserAcess } from './routes/UserAcessRoute/UserAcessRoute.js';
import { RouteProduct } from './routes/ProductRoute/ProductRoute.js';
import { RouteStock } from './routes/StockRoute/StockRoute.js';
import { RouteCartItems } from './routes/CartItemRoute/CartItemRoute.js';

const app = express();
app.use(express.json());

// Liberar Acesso
app.use(
  cors({
    origin: '*',
  })
);

// Rotar Inicial
app.get('/', (req, res) => {
  res.send('E-Commerce Online!');
});

app.use(RouterUser);
app.use(RouterProfile);
app.use(RouteCart);
app.use(RouteAcess);
app.use(RouteUserAcess);
app.use(RouteProduct);
app.use(RouteStock);
app.use(RouteCartItems);

// Servidor Local na Port 4000
app.listen(4000, () => {
  console.log('Servidor E-Commerce Online! http://localhost:4000');
});
