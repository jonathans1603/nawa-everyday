const express = require('express');
const router = express.Router();
const { getAllFeedback, addFeedback, deleteFeedback, markFeedbackRead, markAllFeedbackRead } = require('../controllers/feedbackControllers');
 
router.get('/feedback', getAllFeedback);
router.post('/feedback', addFeedback);
router.delete('/feedback/:id', deleteFeedback);
router.patch('/feedback/:id/read', markFeedbackRead);
router.patch('/feedback/read-all', markAllFeedbackRead);
 
module.exports = router;