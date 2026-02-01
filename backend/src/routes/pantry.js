const express = require('express');
const router = express.Router();
const pantryController = require('../controllers/pantryController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Get all pantry items
router.get('/', pantryController.getPantryItems);

// Get pantry item by ID
router.get('/:id', pantryController.getPantryItem);

// Add item to pantry
router.post('/add', pantryController.addPantryItem);

// Update pantry item
router.put('/:id', pantryController.updatePantryItem);

// Delete pantry item
router.delete('/:id', pantryController.deletePantryItem);

// Search for ingredient
router.get('/search/:query', pantryController.searchIngredient);

// Generate recipe from all pantry items
router.post('/generate-recipe', pantryController.generatePantryRecipe);

module.exports = router;
