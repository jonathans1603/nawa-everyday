const db = require('../config/db');
const crypto = require('crypto');

// GET semua meja
const getAllTables = (req, res) => {
    db.query("SELECT * FROM `table` ORDER BY table_number ASC", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// ── GET meja berdasarkan QR token (dipanggil dari menu.jsx) ──
const getTableByToken = (req, res) => {
    const { token } = req.params;
    db.query(
        "SELECT table_id, table_number, qr_token FROM `table` WHERE qr_token = ?",
        [token],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length === 0) {
                return res.status(404).json({ error: 'Token tidak valid atau meja tidak ditemukan' });
            }
            res.json(results[0]); // { table_id, table_number, qr_token }
        }
    );
};

// Tambah meja baru + generate QR token
const addTable = (req, res) => {
    const { table_number } = req.body;
    const qr_token = crypto.randomUUID(); // token unik untuk QR
    const qr_generated = new Date();

    db.query(
        "INSERT INTO `table` (table_number, qr_token, qr_generated) VALUES (?, ?, ?)",
        [table_number, qr_token, qr_generated],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({
                message: "Meja berhasil ditambahkan",
                table_id: result.insertId,
                qr_token,
                qr_generated
            });
        }
    );
};

// Regenerate QR token (perbarui token + waktu)
const regenerateQR = (req, res) => {
    const { id } = req.params;
    const qr_token = crypto.randomUUID();
    const qr_generated = new Date();

    db.query(
        "UPDATE `table` SET qr_token = ?, qr_generated = ? WHERE table_id = ?",
        [qr_token, qr_generated, id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "QR berhasil diperbarui", qr_token, qr_generated });
        }
    );
};

// Hapus meja
const deleteTable = (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM `table` WHERE table_id = ?", [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Meja berhasil dihapus" });
    });
};

module.exports = { getAllTables, getTableByToken, addTable, regenerateQR, deleteTable };