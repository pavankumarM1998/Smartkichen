const { apiResponse } = require('../utils/response');
const aiService = require('../services/aiService');

const rateDifficulty = async (req, res, next) => {
  try {
    const { recipeTitle, ingredients, steps } = req.body;

    if (!recipeTitle || !ingredients || !steps) {
      return apiResponse(res, 400, false, 'Missing required fields');
    }

    const difficulty = await aiService.rateDifficulty(recipeTitle, ingredients, steps);

    apiResponse(res, 200, true, 'Difficulty rated', difficulty);
  } catch (error) {
    next(error);
  }
};

const adjustForHealthMode = async (req, res, next) => {
  try {
    const { recipe, healthMode } = req.body;

    if (!recipe || !healthMode) {
      return apiResponse(res, 400, false, 'Recipe and health mode are required');
    }

    const adjusted = await aiService.adjustForHealthMode(recipe, healthMode);

    apiResponse(res, 200, true, 'Recipe adjusted for health mode', adjusted);
  } catch (error) {
    next(error);
  }
};

const personalizeRecommendations = async (req, res, next) => {
  try {
    const userProfile = await global.prisma.userTasteProfile.findUnique({
      where: { userId: req.userId },
    });

    if (!userProfile) {
      return apiResponse(res, 404, false, 'User profile not found');
    }

    const { availableRecipes } = req.body;

    if (!availableRecipes || availableRecipes.length === 0) {
      return apiResponse(res, 400, false, 'Available recipes are required');
    }

    const recommendations = await aiService.personalizeRecommendations(
      userProfile,
      availableRecipes
    );

    apiResponse(res, 200, true, 'Recommendations personalized', recommendations);
  } catch (error) {
    next(error);
  }
};

const suggestWasteReduction = async (req, res, next) => {
  try {
    const { recipe, ingredients } = req.body;

    if (!recipe || !ingredients) {
      return apiResponse(res, 400, false, 'Recipe and ingredients are required');
    }

    const suggestions = await aiService.suggestWasteReduction(recipe, ingredients);

    apiResponse(res, 200, true, 'Waste reduction suggestions', suggestions);
  } catch (error) {
    next(error);
  }
};

const scanFridge = async (req, res, next) => {
  try {
    if (!req.file) {
      return apiResponse(res, 400, false, 'Image file is required');
    }

    const imageBase64 = req.file.buffer.toString('base64');

    const analysis = await aiService.analyzeImage(imageBase64);

    // Optionally save detected items to pantry
    const { autoAdd } = req.query;

    if (autoAdd === 'true' && analysis.detectedItems) {
      for (const item of analysis.detectedItems) {
        // Try to find or create ingredient
        let ingredient = await global.prisma.ingredient.findUnique({
          where: { name: item.name.toLowerCase() },
        });

        if (!ingredient) {
          ingredient = await global.prisma.ingredient.create({
            data: {
              name: item.name.toLowerCase(),
              category: 'Other',
              unit: item.unit || 'pieces',
              caloriesPerUnit: 0,
              proteinPerUnit: 0,
              fatsPerUnit: 0,
              carbsPerUnit: 0,
            },
          });
        }

        // Add to pantry
        await global.prisma.pantryItem.create({
          data: {
            userId: req.userId,
            ingredientId: ingredient.id,
            quantity: item.quantity || 1,
            unit: item.unit || 'pieces',
            expiryDate: item.estimatedExpiry
              ? new Date(item.estimatedExpiry)
              : null,
            storageLocation: item.location,
          },
        });
      }
    }

    apiResponse(res, 200, true, 'Fridge scanned and analyzed', analysis);
  } catch (error) {
    next(error);
  }
};

const chat = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message) {
      return apiResponse(res, 400, false, 'Message is required');
    }

    // Call AI chat service
    const response = await aiService.chatWithAI(message);

    apiResponse(res, 200, true, 'Chat response generated', {
      message: response,
    });
  } catch (error) {
    next(error);
  }
};
const getSeasonalSuggestions = async (req, res, next) => {
  try {
    const suggestions = [
      { type: 'ingredient', season: 'Spring', name: 'Asparagus', description: 'Fresh, tender asparagus spears perfect for grilling or steaming', peakMonths: 'March-May' },
      { type: 'ingredient', season: 'Spring', name: 'Strawberries', description: 'Sweet, juicy strawberries at their peak flavor', peakMonths: 'April-June' },
      { type: 'ingredient', season: 'Summer', name: 'Tomatoes', description: 'Ripe, flavorful tomatoes perfect for salads and sauces', peakMonths: 'June-August' },
      { type: 'ingredient', season: 'Summer', name: 'Corn', description: 'Sweet corn on the cob, great grilled or boiled', peakMonths: 'July-September' },
      { type: 'ingredient', season: 'Fall', name: 'Pumpkin', description: 'Versatile squash for soups, pies, and roasting', peakMonths: 'September-November' },
      { type: 'ingredient', season: 'Fall', name: 'Apples', description: 'Crisp apples perfect for baking and snacking', peakMonths: 'September-November' },
      { type: 'ingredient', season: 'Winter', name: 'Citrus Fruits', description: 'Oranges, lemons, and grapefruits at their best', peakMonths: 'December-February' },
      { type: 'ingredient', season: 'Winter', name: 'Root Vegetables', description: 'Carrots, parsnips, and turnips for hearty dishes', peakMonths: 'November-March' },
      { type: 'recipe', season: 'Spring', name: 'Spring Vegetable Risotto', description: 'Creamy risotto with fresh asparagus, peas, and herbs', prepTime: '10 min', cookTime: '30 min', servings: 4, ingredients: ['Arborio rice', 'Asparagus', 'Peas', 'Parmesan'] },
      { type: 'recipe', season: 'Summer', name: 'Caprese Salad', description: 'Classic Italian salad with tomatoes, mozzarella, and basil', prepTime: '10 min', cookTime: '0 min', servings: 4, ingredients: ['Tomatoes', 'Mozzarella', 'Basil', 'Olive oil'] },
      { type: 'recipe', season: 'Fall', name: 'Pumpkin Soup', description: 'Creamy, spiced pumpkin soup perfect for autumn', prepTime: '15 min', cookTime: '30 min', servings: 6, ingredients: ['Pumpkin', 'Onion', 'Garlic', 'Cream'] },
      { type: 'recipe', season: 'Winter', name: 'Citrus Roasted Chicken', description: 'Juicy chicken with orange and lemon', prepTime: '15 min', cookTime: '60 min', servings: 4, ingredients: ['Chicken', 'Oranges', 'Lemons', 'Garlic'] },
      { type: 'tip', season: 'Spring', name: 'Shop at Farmers Markets', description: 'Visit local farmers markets for the freshest spring produce' },
      { type: 'tip', season: 'Summer', name: 'Preserve Summer Flavors', description: 'Freeze or can summer fruits to enjoy year-round' },
      { type: 'tip', season: 'Fall', name: 'Embrace Slow Cooking', description: 'Use your slow cooker for hearty fall soups and stews' },
      { type: 'tip', season: 'Winter', name: 'Boost Immunity', description: 'Incorporate citrus fruits rich in vitamins to stay healthy' },
    ];
    apiResponse(res, 200, true, 'Seasonal suggestions retrieved', { suggestions });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  rateDifficulty,
  adjustForHealthMode,
  personalizeRecommendations,
  suggestWasteReduction,
  scanFridge,
  chat,
  getSeasonalSuggestions,
};
