import express from 'express';
import cors from 'cors';
import logger from 'morgan';
import routesProducts from './routes/products.routes.js';
import routesOrders from './routes/orders.routes.js';
import routesUsers from './routes/users.routes.js';
import routesAuth from './routes/auth.routes.js';

const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use('/products', routesProducts);
app.use('/orders', routesOrders);
app.use('/users', routesUsers);
app.use('/auth', routesAuth);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
