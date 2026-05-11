const express = require('express');
const router = express.Router();
// Ambil fungsi dari controller
const { login, register, getUsers,deleteUser, updateUser } = require('../controllers/authControllers.js');

// Pastikan variabel 'register' dan 'login' tidak typo
router.post('/register', register); 
router.post('/login', login); 
router.get('/users', getUsers); // Endpoint: GET /api/users
router.delete('/users/:id',   deleteUser);   // ← untuk tombol hapus di AdminUser
router.put   ('/users/:id',   updateUser);

module.exports = router;