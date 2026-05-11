const db = require('../config/db');
const fs = require('fs');
const path = require('path');

// GET semua menu
const getMenu = (req, res) => {
    db.query("SELECT * FROM menu", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// Tambah Menu Baru
const addMenu = (req, res) => {
    const { menu_name, kategori_menu, menu_price, deskripsi_menu, adds_on } = req.body;
    const gambar_menu = req.file ? req.file.filename : null;

    const query = "INSERT INTO menu (menu_name, kategori_menu, menu_price, deskripsi_menu, adds_on, gambar_menu) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(query, [menu_name, kategori_menu, menu_price, deskripsi_menu, adds_on, gambar_menu], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Menu Berhasil Ditambahkan" });
    });
};

// Update Menu (nama, harga, dll + ganti gambar opsional)
const updateMenu = (req, res) => {
    const { id } = req.params;
    const { menu_name, kategori_menu, menu_price, deskripsi_menu, adds_on } = req.body;
    const gambar_menu = req.file ? req.file.filename : null;

    // Jika ada gambar baru, hapus gambar lama
    if (gambar_menu) {
        db.query("SELECT gambar_menu FROM menu WHERE menu_id = ?", [id], (err, rows) => {
            if (!err && rows[0]?.gambar_menu) {
                const oldPath = path.join('public/uploads', rows[0].gambar_menu);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
        });
    }

    const fields = gambar_menu
        ? "menu_name=?, kategori_menu=?, menu_price=?, deskripsi_menu=?, adds_on=?, gambar_menu=?"
        : "menu_name=?, kategori_menu=?, menu_price=?, deskripsi_menu=?, adds_on=?";
    const values = gambar_menu
        ? [menu_name, kategori_menu, menu_price, deskripsi_menu, adds_on, gambar_menu, id]
        : [menu_name, kategori_menu, menu_price, deskripsi_menu, adds_on, id];

    db.query(`UPDATE menu SET ${fields} WHERE menu_id = ?`, values, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Menu Berhasil Diupdate" });
    });
};

// Hapus Menu
const deleteMenu = (req, res) => {
    const { id } = req.params;
    // Hapus file gambar juga
    db.query("SELECT gambar_menu FROM menu WHERE menu_id = ?", [id], (err, rows) => {
        if (!err && rows[0]?.gambar_menu) {
            const filePath = path.join('public/uploads', rows[0].gambar_menu);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
        db.query("DELETE FROM menu WHERE menu_id = ?", [id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Menu Berhasil Dihapus" });
        });
    });
};

// Update Status
const updateStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    db.query("UPDATE menu SET menu_status = ? WHERE menu_id = ?", [status, id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Status Diperbarui" });
    });
};

module.exports = { getMenu, addMenu, updateMenu, deleteMenu, updateStatus };