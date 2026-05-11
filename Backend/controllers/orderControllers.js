const db = require('../config/db');
 
// ── GET semua order (Kasir) ──
const getAllOrders = (req, res) => {
    const query = `
        SELECT o.order_id, o.table_number,
            CONCAT('Meja ', o.table_number) AS table_name,
            o.status, o.total_price AS total, o.payment_method, o.created_at,
            GROUP_CONCAT(
                CONCAT(oi.menu_name,' x',oi.quantity,
                    IF(oi.adds_on IS NOT NULL AND oi.adds_on != '',
                        CONCAT(' [', oi.adds_on, ']'), '')
                )
                ORDER BY oi.item_id SEPARATOR ', '
            ) AS items_summary
        FROM orders o
        LEFT JOIN order_items oi ON o.order_id = oi.order_id
        GROUP BY o.order_id ORDER BY o.created_at DESC`;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};
 
// ── GET laporan (hanya status Selesai, bisa filter tanggal) ──
const getLaporan = (req, res) => {
    const { from, to } = req.query;
    const params = [];
    let dateFilter = '';
    if (from && to)  { dateFilter = 'AND DATE(o.created_at) BETWEEN ? AND ?'; params.push(from, to); }
    else if (from)   { dateFilter = 'AND DATE(o.created_at) >= ?'; params.push(from); }
    else if (to)     { dateFilter = 'AND DATE(o.created_at) <= ?'; params.push(to); }
 
    const query = `
        SELECT o.order_id, o.table_number,
            CONCAT('Meja ', o.table_number) AS table_name,
            o.total_price AS total, o.payment_method, o.created_at,
            DATE(o.created_at) AS tanggal, TIME_FORMAT(o.created_at,'%H:%i') AS waktu,
            GROUP_CONCAT(
                CONCAT(oi.menu_name,' x',oi.quantity,
                    IF(oi.adds_on IS NOT NULL AND oi.adds_on != '',
                        CONCAT(' [', oi.adds_on, ']'), '')
                )
                ORDER BY oi.item_id SEPARATOR ', '
            ) AS items_summary,
            SUM(oi.quantity) AS total_qty
        FROM orders o
        LEFT JOIN order_items oi ON o.order_id = oi.order_id
        WHERE o.status = 'Selesai' ${dateFilter}
        GROUP BY o.order_id ORDER BY o.created_at DESC`;
    db.query(query, params, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};
 
// ── DELETE laporan (Admin) ──
const deleteLaporan = (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM orders WHERE order_id = ? AND status = 'Selesai'", [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Data tidak ditemukan' });
        res.json({ message: 'Data laporan berhasil dihapus' });
    });
};
 
// ── GET detail 1 order ──
const getOrderDetail = (req, res) => {
    const { id } = req.params;
    db.query("SELECT * FROM order_items WHERE order_id = ?", [id], (err, items) => {
        if (err) return res.status(500).json({ error: err.message });
        db.query("SELECT * FROM orders WHERE order_id = ?", [id], (err2, orders) => {
            if (err2) return res.status(500).json({ error: err2.message });
            res.json({ order: orders[0], items });
        });
    });
};
 
// ── GET orders untuk Kitchen ──
// ✅ Sekarang ikut sertakan field adds_on per item
const getKitchenOrders = (req, res) => {
    const query = `
        SELECT
            oi.item_id   AS id,
            oi.order_id,
            oi.menu_name,
            CONCAT(oi.menu_name, IF(oi.quantity>1, CONCAT(' x',oi.quantity), '')) AS menu,
            oi.quantity,
            oi.adds_on,                         -- ✅ field adds_on per item
            CONCAT('Meja ', o.table_number) AS table_name,
            o.table_number,
            o.created_at,
            COALESCE(oi.kitchen_status, 'Baru') AS status
        FROM order_items oi
        JOIN orders o ON o.order_id = oi.order_id
        WHERE o.status NOT IN ('Selesai','Dibatalkan')
        ORDER BY oi.item_id ASC`;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};
 
// ── POST buat order baru ──
const createOrder = (req, res) => {
    const { table_number, qr_token, items, total_price, payment_method } = req.body;
    db.query(
        "INSERT INTO orders (table_number, qr_token, total_price, status, payment_method) VALUES (?,?,?,'Pending',?)",
        [table_number, qr_token, total_price, payment_method || null],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            const order_id = result.insertId;
            const values = items.map(item => [
                order_id, item.id, item.name, item.price, item.qty,
                item.addsOn || null,   // ✅ simpan string adds-on yang dipilih
                item.price * item.qty
            ]);
            db.query(
                "INSERT INTO order_items (order_id,menu_id,menu_name,menu_price,quantity,adds_on,subtotal) VALUES ?",
                [values],
                (err2) => {
                    if (err2) return res.status(500).json({ error: err2.message });
                    res.status(201).json({ message: "Order berhasil dibuat", order_id });
                }
            );
        }
    );
};
 
// ── PATCH update status order ──
const patchOrderStatus = (req, res) => {
    const { id } = req.params;
    const { status, payment_method } = req.body;
    const allowed = ['Pending','Diproses','Selesai','Dibatalkan'];
    if (!allowed.includes(status)) return res.status(400).json({ error: 'Status tidak valid' });
 
    const query = (status === 'Selesai' && payment_method)
        ? "UPDATE orders SET status=?, payment_method=? WHERE order_id=?"
        : "UPDATE orders SET status=? WHERE order_id=?";
    const params = (status === 'Selesai' && payment_method)
        ? [status, payment_method, id]
        : [status, id];
 
    db.query(query, params, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Status diperbarui", status });
    });
};
 
const updateOrderStatus = (req, res) => patchOrderStatus(req, res);
 
// ── PATCH kitchen_status per item ──
const updateKitchenStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!['Baru','Diproses','Selesai'].includes(status))
        return res.status(400).json({ error: 'Status tidak valid' });
    db.query("UPDATE order_items SET kitchen_status=? WHERE item_id=?", [status, id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Kitchen status diperbarui", status });
    });
};
 
// ── DELETE order ──
const deleteOrder = (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM orders WHERE order_id=?", [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Order berhasil dihapus" });
    });
};
 
module.exports = {
    getAllOrders, getOrderDetail, getKitchenOrders,
    getLaporan, deleteLaporan,
    createOrder, patchOrderStatus, updateOrderStatus,
    updateKitchenStatus, deleteOrder
};