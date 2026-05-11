const express = require('express');
const router = express.Router();
const { getAllReservasi, addReservasi, updateStatus, deleteReservasi } = require('../controllers/reservasiControllers');

router.get('/reservasi', getAllReservasi);
router.post('/reservasi', addReservasi);
router.put('/reservasi/status/:id', updateStatus);
router.delete('/reservasi/:id', deleteReservasi);

module.exports = router;