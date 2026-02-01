const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middleware/auth');
const uploadMiddleware = require('../middleware/upload');

router.use(authMiddleware);

// Rate difficulty
router.post('/rate-difficulty', aiController.rateDifficulty);

// Adjust for health mode
router.post('/health-mode', aiController.adjustForHealthMode);

// Get personalized recommendations
router.post('/personalize', aiController.personalizeRecommendations);

// Suggest waste reduction
router.post('/waste-reduction', aiController.suggestWasteReduction);

// Analyze fridge image
router.post('/scan-fridge', uploadMiddleware.single('image'), aiController.scanFridge);

// Chat with AI assistant
router.post('/chat', aiController.chat);

// Get seasonal suggestions
router.get('/seasonal-suggestions', aiController.getSeasonalSuggestions);

module.exports = router;
