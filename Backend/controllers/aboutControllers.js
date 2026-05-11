const db = require('../config/db');
 
// ── GET semua story + daily_status ──
const getAllAbout = (req, res) => {
    db.query("SELECT * FROM about_us ORDER BY id_blog ASC", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};
 
// ── GET status buka/tutup (daily_status) — ambil dari row pertama ──
const getDailyStatus = (req, res) => {
    db.query("SELECT daily_status FROM about_us LIMIT 1", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.json({ daily_status: 'Open' });
        res.json({ daily_status: results[0].daily_status });
    });
};
 
// ── POST tambah story baru ──
const addAbout = (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'Title dan content wajib diisi' });
    db.query(
        "INSERT INTO about_us (title, content, daily_status) VALUES (?, ?, 'Open')",
        [title, content],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: 'Story berhasil ditambahkan', id: result.insertId });
        }
    );
};
 
// ── PUT update story ──
const updateAbout = (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    db.query(
        "UPDATE about_us SET title = ?, content = ? WHERE id_blog = ?",
        [title, content, id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Story berhasil diupdate' });
        }
    );
};
 
// ── PATCH update daily_status semua row ──
const updateDailyStatus = (req, res) => {
    const { daily_status } = req.body;
    if (!['Open', 'Closed', 'Private Event'].includes(daily_status))
        return res.status(400).json({ error: 'Status tidak valid' });
    db.query("UPDATE about_us SET daily_status = ?", [daily_status], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Status berhasil diupdate', daily_status });
    });
};
 
// ── DELETE story ──
const deleteAbout = (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM about_us WHERE id_blog = ?", [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Story berhasil dihapus' });
    });
};
 
module.exports = { getAllAbout, getDailyStatus, addAbout, updateAbout, updateDailyStatus, deleteAbout };