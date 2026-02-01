const { apiResponse } = require('../utils/response');
const db = require('../services/realtimeDbService');

const getPantryItems = async (req, res, next) => {
  try {
    const pantryItems = await db.getDocs(db.paths.pantryItems, {
      userId: req.userId,
    });

    apiResponse(res, 200, true, 'Pantry items retrieved successfully', pantryItems);
  } catch (error) {
    next(error);
  }
};

const getPantryItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pantryItem = await db.getDocById(db.paths.pantryItems, id);

    if (!pantryItem || pantryItem.userId !== req.userId) {
      return apiResponse(res, 404, false, 'Pantry item not found');
    }

    apiResponse(res, 200, true, 'Pantry item retrieved successfully', pantryItem);
  } catch (error) {
    next(error);
  }
};

const addPantryItem = async (req, res, next) => {
  try {
    const { ingredientId, ingredientName, quantity, unit, expiryDate, storageLocation, cost } = req.body;

    if (!quantity || !unit) {
      return apiResponse(res, 400, false, 'Missing required fields');
    }

    let finalIngredientId = ingredientId;
    let finalIngredientName = ingredientName;

    // If ingredientName is provided, find or create the ingredient
    if (!ingredientId && ingredientName) {
      // Search for existing ingredient
      const existingIngredients = await db.searchDocs(
        db.paths.ingredients,
        'name',
        ingredientName.toLowerCase().trim()
      );

      let ingredient;
      if (existingIngredients.length > 0) {
        ingredient = existingIngredients[0];
      } else {
        // Create new ingredient
        ingredient = await db.createDoc(db.paths.ingredients, {
          name: ingredientName.toLowerCase().trim(),
          category: 'Other',
          unit: unit || 'gram',
          caloriesPerUnit: 0,
          proteinPerUnit: 0,
          fatsPerUnit: 0,
          carbsPerUnit: 0,
        });
      }

      finalIngredientId = ingredient.id;
      finalIngredientName = ingredient.name;
    }

    if (!finalIngredientId && !finalIngredientName) {
      return apiResponse(res, 400, false, 'Either ingredientId or ingredientName is required');
    }

    // Check if already in pantry
    const existingItems = await db.getDocs(db.paths.pantryItems, {
      userId: req.userId,
    });

    const existing = existingItems.find(item =>
      item.ingredientId === finalIngredientId ||
      item.ingredientName === finalIngredientName
    );

    if (existing) {
      // Update quantity instead
      const updated = await db.updateDoc(
        db.paths.pantryItems,
        existing.id,
        {
          quantity: existing.quantity + quantity,
        }
      );

      return apiResponse(res, 200, true, 'Pantry item updated successfully', updated);
    }

    // Create new pantry item
    const pantryItem = await db.createDoc(db.paths.pantryItems, {
      userId: req.userId,
      ingredientId: finalIngredientId,
      ingredientName: finalIngredientName,
      quantity,
      unit,
      expiryDate: expiryDate || null,
      storageLocation: storageLocation || 'pantry',
      cost: cost || null,
    });

    apiResponse(res, 201, true, 'Item added to pantry successfully', pantryItem);
  } catch (error) {
    next(error);
  }
};

const updatePantryItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity, unit, expiryDate, storageLocation, cost } = req.body;

    const pantryItem = await db.getDocById(db.paths.pantryItems, id);

    if (!pantryItem || pantryItem.userId !== req.userId) {
      return apiResponse(res, 404, false, 'Pantry item not found');
    }

    const updateData = {};
    if (quantity !== undefined) updateData.quantity = quantity;
    if (unit !== undefined) updateData.unit = unit;
    if (expiryDate !== undefined) updateData.expiryDate = expiryDate;
    if (storageLocation !== undefined) updateData.storageLocation = storageLocation;
    if (cost !== undefined) updateData.cost = cost;

    const updated = await db.updateDoc(db.paths.pantryItems, id, updateData);

    apiResponse(res, 200, true, 'Pantry item updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

const deletePantryItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const pantryItem = await db.getDocById(db.paths.pantryItems, id);

    if (!pantryItem || pantryItem.userId !== req.userId) {
      return apiResponse(res, 404, false, 'Pantry item not found');
    }

    await db.deleteDoc(db.paths.pantryItems, id);

    apiResponse(res, 200, true, 'Pantry item deleted successfully');
  } catch (error) {
    next(error);
  }
};

const searchIngredient = async (req, res, next) => {
  try {
    const { query } = req.params;

    const ingredients = await db.searchDocs(
      db.paths.ingredients,
      'name',
      query.toLowerCase(),
      10
    );

    apiResponse(res, 200, true, 'Ingredients found', ingredients);
  } catch (error) {
    next(error);
  }
};

/**
 * Generate recipe from all pantry items
 */
const generatePantryRecipe = async (req, res, next) => {
  try {
    const { healthMode = 'Normal', servings = 4, language = 'en' } = req.body;

    // Get all pantry items for this user
    const pantryItems = await db.getDocs(db.paths.pantryItems, {
      userId: req.userId,
    });

    if (pantryItems.length === 0) {
      return apiResponse(res, 400, false, 'Pantry is empty. Please add ingredients to your pantry first.');
    }

    // Extract ingredient names
    const ingredients = pantryItems.map(item => item.ingredientName || item.name);

    console.log(`Generating recipe from pantry for user ${req.userId}:`, ingredients);

    // Use the existing recipe generation logic
    const recipeController = require('./recipeController');

    // Create a mock request object with pantry ingredients
    const mockReq = {
      body: {
        ingredients,
        healthMode,
        servings,
        language
      }
    };

    // Create a response handler
    const mockRes = {
      status: (code) => ({
        json: (data) => {
          res.status(code).json(data);
        }
      })
    };

    // Generate recipe using existing controller
    await recipeController.generateRecipe(mockReq, mockRes);

  } catch (error) {
    console.error('Error generating pantry recipe:', error);
    next(error);
  }
};

module.exports = {
  getPantryItems,
  getPantryItem,
  addPantryItem,
  updatePantryItem,
  deletePantryItem,
  searchIngredient,
  generatePantryRecipe,
};
