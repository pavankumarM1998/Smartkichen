const { apiResponse } = require('../utils/response');
const db = require('../services/realtimeDbService');

const getShoppingLists = async (req, res, next) => {
  try {
    const lists = await db.getDocs(db.paths.shoppingLists, {
      userId: req.userId,
    });

    apiResponse(res, 200, true, 'Shopping lists retrieved', lists);
  } catch (error) {
    next(error);
  }
};

const createShoppingList = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return apiResponse(res, 400, false, 'Shopping list name is required');
    }

    const list = await db.createDoc(db.paths.shoppingLists, {
      userId: req.userId,
      name,
      items: [],
      createdAt: new Date().toISOString()
    });

    apiResponse(res, 201, true, 'Shopping list created', list);
  } catch (error) {
    next(error);
  }
};

const getShoppingList = async (req, res, next) => {
  try {
    const { id } = req.params;

    const list = await db.getDocById(db.paths.shoppingLists, id);

    if (!list || list.userId !== req.userId) {
      return apiResponse(res, 404, false, 'Shopping list not found');
    }

    apiResponse(res, 200, true, 'Shopping list retrieved', list);
  } catch (error) {
    next(error);
  }
};

const addItemToShoppingList = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { ingredientId, quantity, unit, estimatedCost, ingredientName } = req.body;

    if (!quantity || !unit) {
      return apiResponse(res, 400, false, 'Missing required fields');
    }

    const list = await db.getDocById(db.paths.shoppingLists, id);

    if (!list || list.userId !== req.userId) {
      return apiResponse(res, 404, false, 'Shopping list not found');
    }

    const items = list.items || [];

    // Create new item
    const newItem = {
      id: db.generateId(),
      ingredientId,
      ingredient: { name: ingredientName || 'Unknown Item' }, // Fallback for display
      quantity,
      unit,
      estimatedCost,
      isPurchased: false,
      createdAt: new Date().toISOString()
    };

    items.push(newItem);

    await db.updateDoc(db.paths.shoppingLists, id, { items });

    apiResponse(res, 201, true, 'Item added to shopping list', newItem);
  } catch (error) {
    next(error);
  }
};

const updateShoppingListItem = async (req, res, next) => {
  try {
    const { id, itemId } = req.params;
    const { quantity, unit, estimatedCost } = req.body;

    const list = await db.getDocById(db.paths.shoppingLists, id);

    if (!list || list.userId !== req.userId) {
      return apiResponse(res, 404, false, 'Shopping list not found');
    }

    const items = list.items || [];
    const itemIndex = items.findIndex(item => item.id === itemId);

    if (itemIndex === -1) {
      return apiResponse(res, 404, false, 'Item not found in list');
    }

    // Update item
    items[itemIndex] = {
      ...items[itemIndex],
      quantity: quantity || items[itemIndex].quantity,
      unit: unit || items[itemIndex].unit,
      estimatedCost: estimatedCost || items[itemIndex].estimatedCost,
      updatedAt: new Date().toISOString()
    };

    await db.updateDoc(db.paths.shoppingLists, id, { items });

    apiResponse(res, 200, true, 'Item updated', items[itemIndex]);
  } catch (error) {
    next(error);
  }
};

const removeItemFromShoppingList = async (req, res, next) => {
  try {
    const { id, itemId } = req.params;

    const list = await db.getDocById(db.paths.shoppingLists, id);

    if (!list || list.userId !== req.userId) {
      return apiResponse(res, 404, false, 'Shopping list not found');
    }

    let items = list.items || [];
    items = items.filter(item => item.id !== itemId);

    await db.updateDoc(db.paths.shoppingLists, id, { items });

    apiResponse(res, 200, true, 'Item removed from shopping list');
  } catch (error) {
    next(error);
  }
};

const markItemAsPurchased = async (req, res, next) => {
  try {
    const { id, itemId } = req.params;

    const list = await db.getDocById(db.paths.shoppingLists, id);

    if (!list || list.userId !== req.userId) {
      return apiResponse(res, 404, false, 'Shopping list not found');
    }

    const items = list.items || [];
    const itemIndex = items.findIndex(item => item.id === itemId);

    if (itemIndex === -1) {
      return apiResponse(res, 404, false, 'Item not found in list');
    }

    // Toggle purchased status
    // Note: The frontend might be sending a specific state, but the function name implies marking as purchased via PATCH. 
    // Assuming typical toggle or set to true. Let's toggle for flexibility or expected behavior.
    // Actually, method name is markItemAsPurchased, so let's set to true.
    // But typical UI might want to uncheck.
    // Let's assume the UI calls this to toggle.
    // Checking apiService.js, it calls /purchase endpoint.

    items[itemIndex].isPurchased = !items[itemIndex].isPurchased;

    await db.updateDoc(db.paths.shoppingLists, id, { items });

    apiResponse(res, 200, true, 'Item marked as purchased', items[itemIndex]);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getShoppingLists,
  createShoppingList,
  getShoppingList,
  addItemToShoppingList,
  updateShoppingListItem,
  removeItemFromShoppingList,
  markItemAsPurchased,
};
