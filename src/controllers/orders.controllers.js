import { pool } from '../config/db_config.js'; // revisar ruta

export const getOrders = async (req, res) => {
  try {
    const orders = await pool.query('SELECT * FROM orders');
    res.status(200).json(orders.rows);
  } catch (error) {
    console.error('Error al obtener los orders', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getOrdersById = async (req, res) => {
  try {
    const id = req.params.id;

    const order = await fetchOrderById(id); // Usar la nueva función

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error al obtener la orden', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getOrdersByUserId = async (req, res) => {
  const userId = req.params.id;

  try {
    // Obtiene las órdenes del usuario
    const ordersQuery = await pool.query(
      `
          SELECT id FROM orders WHERE user_id = $1
        `,
      [userId]
    );

    const orderIds = ordersQuery.rows.map((order) => order.id);

    // Usamos Promise.all para obtener las órdenes
    const orders = await Promise.all(orderIds.map((id) => fetchOrderById(id)));

    // Filtra las órdenes no encontradas (nulls)
    const filteredOrders = orders.filter((order) => order !== null);

    res.status(200).json(filteredOrders);
  } catch (error) {
    console.error('Error al obtener las órdenes por usuario', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const createOrders = async (req, res) => {
  try {
    const { userId, totalAmount, deliveryAddress, products } = req.body;

    if (!userId || !totalAmount || !products || products.length === 0)
      return res.status(400).send('Faltan datos obligatorios');

    // Iniciar la transacción
    await pool.query('BEGIN');

    // Insertar el pedido en la tabla `orders`
    const result = await pool.query(
      'INSERT INTO orders (user_id, total_amount, delivery_address) VALUES ($1, $2, $3) RETURNING id',
      [userId, totalAmount, deliveryAddress]
    );

    const orderId = result.rows[0].id;

    // Insertar los productos asociados al pedido en `order_products`
    for (const product of products) {
      const { productId, quantity } = product;
      if (!productId || !quantity) {
        await pool.query('ROLLBACK');
        return res.status(400).send('Faltan datos de los productos');
      }
      await pool.query(
        'INSERT INTO order_products (order_id, product_id, quantity) VALUES ($1, $2, $3)',
        [orderId, productId, quantity]
      );
    }

    // Confirmar la transacción
    await pool.query('COMMIT');

    res.status(200).json({ message: 'Pedido creado correctamente' });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error al crear el pedido', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// export const updateOrdersById = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const {  } = req.body;
//     if (true)
//       return res.status(400).send('Faltan datos obligatorios');
//     await pool.query(
//       'UPDATE orders SET nombre = $1 WHERE id = $2',
//       ["variables",id]
//     );
//     res.status(200).json({ message: 'order actualizado correctamente' });
//   } catch (error) {
//     console.error('Error al obtener los orders', error);
//     res.status(500).json({ message: 'Error interno del servidor' });
//   }
// };

export const deleteOrdersById = async (req, res) => {
  try {
    const id = req.params.id;
    await pool.query('DELETE FROM orders WHERE id = $1', [id]);
    res.status(200).json({ message: 'Order eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el order', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Función para obtener la orden por ID
const fetchOrderById = async (id) => {
  const orderQuery = await pool.query('SELECT * FROM orders WHERE id = $1', [
    id,
  ]);
  const order = orderQuery.rows[0];

  if (!order) {
    return null; // Retorna null si no se encuentra la orden
  }

  const productsQuery = await pool.query(
    `
        SELECT p.id AS product_id, p.name, p.price, op.quantity 
        FROM order_products op 
        JOIN products p ON op.product_id = p.id 
        WHERE op.order_id = $1
      `,
    [id]
  );

  const products = productsQuery.rows;

  return {
    ...order,
    products,
  };
};
