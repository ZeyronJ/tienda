import pg from 'pg';
const { Pool } = pg;
import dotenv from 'dotenv';
dotenv.config();

export const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

// const dbConfig = {
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
//   port: process.env.DB_PORT,
// };
// export const pool = new Pool(dbConfig);

// Prueba de conexión a la base de datos
// pool.connect((err, client, release) => {
//   if (err) {
//     console.error('Error de conexión a la base de datos:', err);
//   } else {
//     console.log('Conexión exitosa a la base de datos PostgreSQL');

//     // Realiza aquí cualquier operación adicional después de la conexión exitosa...

//     // Libera el cliente después de su uso
//     release();
//   }
// });
