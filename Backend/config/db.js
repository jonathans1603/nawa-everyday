const mysql = require('mysql2');
 
const pool = mysql.createPool({
  host              : process.env.DB_HOST,
  user              : process.env.DB_USER,
  password          : process.env.DB_PASSWORD,
  database          : process.env.DB_NAME,
  port              : process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit   : 10,
  queueLimit        : 0,
  enableKeepAlive   : true,
  keepAliveInitialDelay: 0,
});
 
// Test koneksi awal
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    return;
  }
  console.log('✅ Terhubung ke database MySQL (db_nawa)');
  connection.release();
});
 
module.exports = pool;
 