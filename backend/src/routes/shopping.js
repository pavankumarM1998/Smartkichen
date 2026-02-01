const express = require('express');
const router = express.Router();
const shoppingController = require('../controllers/shoppingController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// Get all shopping lists
router.get('/', shoppingController.getShoppingLists);

// Create shopping list
router.post('/', shoppingController.createShoppingList);

// Get shopping list by ID
router.get('/:id', shoppingController.getShoppingList);

// Add item to shopping list
router.post('/:id/items', shoppingController.addItemToShoppingList);

// Update item in shopping list
router.put('/:id/items/:itemId', shoppingController.updateShoppingListItem);

// Remove item from shopping list
router.delete('/:id/items/:itemId', shoppingController.removeItemFromShoppingList);

// Mark item as purchased
router.patch('/:id/items/:itemId/purchase', shoppingController.markItemAsPurchased);

module.exports = router;
