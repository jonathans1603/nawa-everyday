const db = require('../config/db');
 
// GET semua feedback
const getAllFeedback = (req, res) => {
    db.query("SELECT * FROM feedback ORDER BY submited_time DESC", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};
 
// POST feedback baru dari pelanggan
const addFeedback = (req, res) => {
    const { nama_customer, no_meja, Kritik, Saran } = req.body;
    db.query(
        "INSERT INTO feedback (nama_customer, no_meja, Kritik, Saran) VALUES (?, ?, ?, ?)",
        [nama_customer, no_meja, Kritik, Saran],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: "Feedback berhasil dikirim", id: result.insertId });
        }
    );
};
 
// DELETE feedback
const deleteFeedback = (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM feedback WHERE id_form = ?", [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Feedback berhasil dihapus" });
    });
};
 
// PATCH tandai feedback sebagai dibaca
const markFeedbackRead = (req, res) => {
    const { id } = req.params;
    db.query("UPDATE feedback SET is_read = 1 WHERE id_form = ?", [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Feedback ditandai sudah dibaca" });
    });
};
 
// PATCH tandai semua feedback sebagai dibaca
const markAllFeedbackRead = (req, res) => {
    db.query("UPDATE feedback SET is_read = 1", (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Semua feedback ditandai sudah dibaca" });
    });
};
 
module.exports = { getAllFeedback, addFeedback, deleteFeedback, markFeedbackRead, markAllFeedbackRead };