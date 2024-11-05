import { pool } from '../config/db_config.js'; // revisar ruta

export const getProducts = async (req, res) => {
  try {
    const products = await pool.query('SELECT * FROM products');
    res.status(200).json(products.rows);
  } catch (error) {
    console.error('Error al obtener los products', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getProductsById = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await pool.query('SELECT * FROM products WHERE id = $1', [
      id,
    ]);
    res.status(200).json(product.rows);
  } catch (error) {
    console.error('Error al obtener los products', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const createProducts = async (req, res) => {
  try {
    const { name, price, category, description, image } = req.body;
    if (!name || !price || !category || !description || !image)
      return res.status(400).send('Faltan datos obligatorios');
    await pool.query(
      'INSERT INTO products (name, price, category, description, image ) VALUES ($1, $2, $3, $4, $5)',
      [name, price, category, description, image]
    );
    res.status(200).json({ message: 'product creado correctamente' });
  } catch (error) {
    console.error('Error al obtener los products', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const updateProductsById = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, price, category, description, image } = req.body;
    if (!name || !price || !category || !description || !image)
      return res.status(400).send('Faltan datos obligatorios');
    await pool.query(
      'UPDATE products SET name = $1, price = $2, category = $3, description = $4, image = $5 WHERE id = $6',
      [name, price, category, description, image, id]
    );
    res.status(200).json({ message: 'product actualizado correctamente' });
  } catch (error) {
    console.error('Error al obtener los products', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const deleteProductsById = async (req, res) => {
  try {
    const id = req.params.id;
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    res.status(200).json({ message: 'product eliminado correctamente' });
  } catch (error) {
    console.error('Error al obtener los products', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
