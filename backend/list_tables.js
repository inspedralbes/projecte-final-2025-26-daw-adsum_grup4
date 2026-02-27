const mysql = require('mysql2/promise');
require('dotenv').config();

async function listTables() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '1234',
    database: process.env.DB_NAME || 'adsum_qr',
    port: process.env.DB_PORT || 3306
  });

  try {
    const [rows] = await connection.execute('SHOW TABLES');
    console.log('Tablas en adsum_qr:');
    console.table(rows);
  } catch (err) {
    console.error('Error al listar tablas:', err.message);
  } finally {
    await connection.end();
  }
}

listTables();
