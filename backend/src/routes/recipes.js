const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const authMiddleware = require('../middleware/auth');

// Public routes (no auth required)
router.get('/', recipeController.getAllRecipes);
router.get('/search/:query', recipeController.searchRecipes);
router.get('/:id', recipeController.getRecipeById);

// Protected routes
router.use(authMiddleware);

// Generate recipe from ingredients
router.post('/generate', recipeController.generateRecipe);

// Get substitutes for missing ingredient
router.post('/substitutes', recipeController.getSubstitutes);

// Get recipe nutrition
router.post('/nutrition', recipeController.getNutrition);

// Scale recipe servings
router.post('/:id/scale', recipeController.scaleRecipe);

// Convert cuisine
router.post('/convert-cuisine', recipeController.convertCuisine);

module.exports = router;
