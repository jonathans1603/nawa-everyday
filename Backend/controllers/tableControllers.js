const db = require('../config/db');
const crypto = require('crypto');
 
const QR_LIFETIME_MS = 90 * 60 * 1000; // 90 menit
 
// GET semua meja
const getAllTables = (req, res) => {
    db.query("SELECT * FROM `table` ORDER BY table_number ASC", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};
 
// ── GET meja berdasarkan QR token (dipanggil dari menu.jsx) ──
// Sekarang juga validasi apakah token sudah expired
const getTableByToken = (req, res) => {
    const { token } = req.params;
    db.query(
        "SELECT table_id, table_number, qr_token, qr_expires_at FROM `table` WHERE qr_token = ?",
        [token],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
 
            // Token tidak ditemukan
            if (results.length === 0) {
                return res.status(404).json({ error: 'Token tidak valid atau meja tidak ditemukan' });
            }
 
            const table = results[0];
 
            // Cek apakah QR sudah expired
            if (table.qr_expires_at && new Date() > new Date(table.qr_expires_at)) {
                return res.status(403).json({
                    error: 'QR Code sudah kadaluarsa. Silakan minta QR baru ke kasir.',
                    expired: true,
                });
            }
 
            res.json({
                table_id: table.table_id,
                table_number: table.table_number,
                qr_token: table.qr_token,
            });
        }
    );
};
 
// Tambah meja baru + generate QR token
const addTable = (req, res) => {
    const { table_number } = req.body;
    const qr_token    = crypto.randomUUID();
    const qr_generated  = new Date();
    const qr_expires_at = new Date(Date.now() + QR_LIFETIME_MS); // expired 90 menit dari sekarang
 
    db.query(
        "INSERT INTO `table` (table_number, qr_token, qr_generated, qr_expires_at) VALUES (?, ?, ?, ?)",
        [table_number, qr_token, qr_generated, qr_expires_at],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({
                message: 'Meja berhasil ditambahkan',
                table_id: result.insertId,
                qr_token,
                qr_generated,
                qr_expires_at,
            });
        }
    );
};
 
// Regenerate QR token (perbarui token + waktu + expiry)
const regenerateQR = (req, res) => {
    const { id } = req.params;
    const qr_token      = crypto.randomUUID();
    const qr_generated  = new Date();
    const qr_expires_at = new Date(Date.now() + QR_LIFETIME_MS); // expired 90 menit dari sekarang
 
    db.query(
        "UPDATE `table` SET qr_token = ?, qr_generated = ?, qr_expires_at = ? WHERE table_id = ?",
        [qr_token, qr_generated, qr_expires_at, id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({
                message: 'QR berhasil diperbarui',
                qr_token,
                qr_generated,
                qr_expires_at,
            });
        }
    );
};
 
// Hapus meja
const deleteTable = (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM `table` WHERE table_id = ?", [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Meja berhasil dihapus' });
    });
};
 
module.exports = { getAllTables, getTableByToken, addTable, regenerateQR, deleteTable };