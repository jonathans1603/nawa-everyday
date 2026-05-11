const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getMenu, addMenu, updateMenu, deleteMenu, updateStatus } = require('../controllers/menuControllers.js');

const storage = multer.diskStorage({
    destination: 'public/uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

router.get('/menu', getMenu);                                      // ← BARU
router.post('/menu', upload.single('gambar_menu'), addMenu);
router.put('/menu/:id', upload.single('gambar_menu'), updateMenu); // ← BARU
router.delete('/menu/:id', deleteMenu);
router.put('/menu/status/:id', updateStatus);

module.exports = router;