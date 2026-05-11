const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // Default XAMPP
    password: '',      // Default XAMPP (kosong)
    database: 'db_nawa' // Nama database Anda
});

db.connect((err) => {
    if (err) {
        console.error('Koneksi database GAGAL:', err.message);
        return;
    }
    console.log('Terhubung ke database MySQL (db_nawa)');
});

module.exports = db;