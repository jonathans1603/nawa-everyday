const express = require('express');
const router  = express.Router();
const {
    getAllOrders, getOrderDetail, getKitchenOrders,
    getLaporan, deleteLaporan,
    createOrder, patchOrderStatus, updateOrderStatus,
    updateKitchenStatus, deleteOrder
} = require('../controllers/orderControllers');
 
// ⚠️ Route spesifik HARUS sebelum route dengan parameter (:id)
 
router.get   ('/orders',              getAllOrders);
router.get   ('/orders/kitchen',      getKitchenOrders);   // ← sebelum /:id
router.get   ('/orders/laporan',      getLaporan);         // ← sebelum /:id
router.get   ('/orders/:id',          getOrderDetail);
router.post  ('/orders',              createOrder);
router.patch ('/orders/:id/status',   patchOrderStatus);
router.patch ('/orders/kitchen/:id',  updateKitchenStatus);
router.put   ('/orders/:id',          updateOrderStatus);
router.delete('/orders/laporan/:id',  deleteLaporan);      // ← hapus laporan (Admin)
router.delete('/orders/:id',          deleteOrder);
 
module.exports = router;