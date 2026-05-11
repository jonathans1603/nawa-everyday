const express = require('express');
const router = express.Router();
const { getAllTables, getTableByToken, addTable, regenerateQR, deleteTable } = require('../controllers/tableControllers');

router.get('/tables', getAllTables);
router.get   ('/tables/by-token/:token', getTableByToken);
router.post('/tables', addTable);
router.put('/tables/regenerate/:id', regenerateQR);
router.delete('/tables/:id', deleteTable);

module.exports = router;