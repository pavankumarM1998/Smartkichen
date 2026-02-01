const express = require('express');
const router = express.Router();
const mealPlanController = require('../controllers/mealPlanController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// Get weekly meal plan
router.get('/weekly/:weekStartDate', mealPlanController.getWeeklyMealPlan);

// Generate meal plan
router.post('/generate', mealPlanController.generateMealPlan);

// Add meal to plan
router.post('/:mealPlanId/add', mealPlanController.addMealToplan);

// Remove meal from plan
router.delete('/:mealPlanId/meal/:mealId', mealPlanController.removeMealFromPlan);

// Get shopping list for meal plan
router.get('/:mealPlanId/shopping-list', mealPlanController.getShoppingListForPlan);

module.exports = router;
