const express = require('express');
const router = express.Router();
const preferenceController = require('../controllers/preferenceController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// Get preferences
router.get('/', preferenceController.getPreferences);

// Update preferences
router.put('/', preferenceController.updatePreferences);

// Get taste profile
router.get('/taste-profile', preferenceController.getTasteProfile);

// Update taste profile
router.put('/taste-profile', preferenceController.updateTasteProfile);

module.exports = router;
