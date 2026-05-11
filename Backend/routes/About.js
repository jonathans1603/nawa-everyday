const express = require('express');
const router  = express.Router();
const {
    getAllAbout, getDailyStatus,
    addAbout, updateAbout, updateDailyStatus, deleteAbout
} = require('../controllers/aboutControllers');
 
// ⚠️ Route spesifik HARUS sebelum route dengan parameter (:id)
router.get   ('/about',                 getAllAbout);
router.get   ('/about/status',          getDailyStatus);
router.post  ('/about',                 addAbout);
router.patch ('/about/status',          updateDailyStatus);
router.put   ('/about/:id',             updateAbout);
router.delete('/about/:id',             deleteAbout);
 
module.exports = router;
 