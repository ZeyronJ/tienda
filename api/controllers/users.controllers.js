import { pool } from '../config/db_config.js'; // revisar ruta
import bcrypt from 'bcrypt';

export const getUsers = async (req, res) => {
  try {
    const users = await pool.query('SELECT * FROM users ORDER BY id ASC');
    res.status(200).json(users.rows);
  } catch (error) {
    console.error('Error al obtener los users', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getUsersById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json(user.rows[0]);
  } catch (error) {
    console.error('Error al obtener los users', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const createUsers = async (req, res) => {
  try {
    const { name, password, email, role } = req.body;

    if (!name || !password || !email)
      return res.status(400).send('Faltan datos obligatorios');

    // Encriptar la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await pool.query(
      'INSERT INTO users (name, password, email, role) VALUES ($1, $2, $3, $4)',
      [name, hashedPassword, email, role || 'user']
    );

    res.status(200).json({ message: 'Usuario creado correctamente' });
  } catch (error) {
    console.error('Error al crear el usuario', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const updateUsersById = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, password, email, role } = req.body;
    if (!name && !password && !email && !role) {
      return res.status(400).send('Faltan datos para actualizar');
    }
    const fieldsToUpdate = [];
    const values = [];

    if (name) {
      fieldsToUpdate.push('name = $' + (fieldsToUpdate.length + 1));
      values.push(name);
    }
    if (password) {
      fieldsToUpdate.push('password = $' + (fieldsToUpdate.length + 1));
      values.push(password);
    }
    if (email) {
      fieldsToUpdate.push('email = $' + (fieldsToUpdate.length + 1));
      values.push(email);
    }
    if (role) {
      fieldsToUpdate.push('role = $' + (fieldsToUpdate.length + 1));
      values.push(role);
    }

    values.push(id);
    const query = `UPDATE users SET ${fieldsToUpdate.join(', ')} WHERE id = $${
      values.length
    }`;
    await pool.query(query, values);

    res.status(200).json({ message: 'Usuario actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el usuario', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const deleteUsersById = async (req, res) => {
  try {
    const id = req.params.id;
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el usuario', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
