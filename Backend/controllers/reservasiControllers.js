const db = require('../config/db');

// GET semua reservasi
const getAllReservasi = (req, res) => {
    db.query("SELECT * FROM reservasi ORDER BY date ASC, time ASC", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// POST reservasi baru dari pelanggan
const addReservasi = (req, res) => {
    const { name, phone, email, event_type, date, time, guest, notes } = req.body;
    db.query(
        `INSERT INTO reservasi (name, phone, email, event_type, date, time, guest, notes, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Menunggu')`,
        [name, phone, email, event_type, date, time, guest, notes],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: "Reservasi berhasil dikirim", id: result.insertId });
        }
    );
};

// UPDATE status reservasi (Dikonfirmasi / Menunggu / Ditolak)
const updateStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    db.query(
        "UPDATE reservasi SET status = ? WHERE id_reservasi = ?",
        [status, id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Status berhasil diperbarui" });
        }
    );
};

// DELETE reservasi
const deleteReservasi = (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM reservasi WHERE id_reservasi = ?", [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Reservasi berhasil dihapus" });
    });
};

module.exports = { getAllReservasi, addReservasi, updateStatus, deleteReservasi };