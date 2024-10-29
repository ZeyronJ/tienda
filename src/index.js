import express from 'express';
import cors from 'cors';
// import routesProductos from './routes/productos.routes.js';
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());
// app.use('/productos', routesProductos);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
