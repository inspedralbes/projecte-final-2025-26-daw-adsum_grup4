const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkUsers() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '1234',
    database: process.env.DB_NAME || 'adsum_db',
    port: process.env.DB_PORT || 3306
  });

  try {
    const [rows] = await connection.execute('SELECT email, rol FROM usuaris');
    console.log('Usuarios encontrados en la DB:');
    console.table(rows);
  } catch (err) {
    console.error('Error al consultar usuarios:', err.message);
  } finally {
    await connection.end();
  }
}

checkUsers();
