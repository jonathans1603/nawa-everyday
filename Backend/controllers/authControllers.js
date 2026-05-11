const db = require('../config/db');

// 1. FUNGSI REGISTER
const register = (req, res) => {
    const { username, password, role } = req.body;

    db.query(
        "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
        [username, password, role],
        (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ 
                        message: `Username "${username}" sudah digunakan. Pilih username lain.` 
                    });
                }
                return res.status(500).json({ message: "Gagal simpan ke database" });
            }
            res.status(201).json({ message: "Registrasi Berhasil!" });
        }
    );
};

// 2. FUNGSI LOGIN (Tambahkan bagian ini agar tidak error 'undefined')
const login = (req, res) => {
    const { username, password } = req.body; 

    // Mencari user berdasarkan username dan password
    const query = "SELECT * FROM users WHERE username = ? AND password = ?";
    
    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error("Error Database:", err.message);
            return res.status(500).json({ error: err.message });
        }
        
        if (results.length > 0) {
            res.status(200).json({ 
                message: "Login berhasil", 
                user: results[0] 
            });
        } else {
            res.status(401).json({ message: "Username atau password salah" });
        }
    });
};

const getUsers = (req, res) => {
    // Pastikan kolom-kolom ini ada di tabel users Anda
    const query = "SELECT user_id, username, role FROM users";
    
    db.query(query, (err, results) => {
        if (err) {
            console.error("Database Error:", err.message);
            // Kembalikan array kosong agar Frontend tidak crash jika error
            return res.status(500).json([]); 
        }
        res.status(200).json(results);
    });
};

// ── DELETE USER (Admin) ──
const deleteUser = (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM users WHERE user_id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ message: "Gagal menghapus user." });
        if (result.affectedRows === 0) return res.status(404).json({ message: "User tidak ditemukan." });
        res.json({ message: "User berhasil dihapus." });
    });
};
 
// ── UPDATE USER (Admin — ganti password atau role) ──
const updateUser = (req, res) => {
    const { id } = req.params;
    const { password, role } = req.body;
 
    db.query(
        "UPDATE users SET password = ?, role = ? WHERE user_id = ?",
        [password, role, id],
        (err, result) => {
            if (err) return res.status(500).json({ message: "Gagal mengupdate user." });
            if (result.affectedRows === 0) return res.status(404).json({ message: "User tidak ditemukan." });
            res.json({ message: "User berhasil diupdate." });
        }
    );
};
// Pastikan getUsers sudah diekspor
module.exports = { register, login, getUsers, deleteUser, updateUser };
