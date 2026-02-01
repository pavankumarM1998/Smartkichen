import api from './api';

export const authService = {
  register: (email, password, name) =>
    api.post('/auth/register', { email, password, name }),

  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  getCurrentUser: () =>
    api.get('/auth/me'),

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export const pantryService = {
  getPantryItems: () =>
    api.get('/pantry'),

  getPantryItem: (id) =>
    api.get(`/pantry/${id}`),

  addPantryItem: (ingredientId, quantity, unit, expiryDate, storageLocation, cost) =>
    api.post('/pantry/add', {
      ingredientId,
      quantity,
      unit,
      expiryDate,
      storageLocation,
      cost,
    }),

  updatePantryItem: (id, data) =>
    api.put(`/pantry/${id}`, data),

  deletePantryItem: (id) =>
    api.delete(`/pantry/${id}`),

  searchIngredient: (query) =>
    api.get(`/pantry/search/${query}`),

  generatePantryRecipe: (healthMode, servings, language) =>
    api.post('/pantry/generate-recipe', {
      healthMode,
      servings,
      language,
    }),
};

export const recipeService = {
  getAllRecipes: () =>
    api.get('/recipes'),

  searchRecipes: (query) =>
    api.get(`/recipes/search/${query}`),

  getRecipeById: (id) =>
    api.get(`/recipes/${id}`),

  generateRecipe: (ingredients, healthMode, servings, language = 'en') =>
    api.post('/recipes/generate', {
      ingredients,
      healthMode,
      servings,
      language,
    }),

  getSubstitutes: (missingIngredient, availableIngredients, dishType) =>
    api.post('/recipes/substitutes', {
      missingIngredient,
      availableIngredients,
      dishType,
    }),

  getNutrition: (ingredients, servings) =>
    api.post('/recipes/nutrition', {
      ingredients,
      servings,
    }),

  scaleRecipe: (recipeId, newServings) =>
    api.post(`/recipes/${recipeId}/scale`, {
      newServings,
    }),

  convertCuisine: (recipeId, targetCuisine) =>
    api.post('/recipes/convert-cuisine', {
      recipeId,
      targetCuisine,
    }),

  convertRecipeCuisine: (data) =>
    api.post('/recipes/convert-cuisine', data),
};

export const aiService = {
  rateDifficulty: (data) =>
    api.post('/ai/rate-difficulty', data),

  adjustForHealthMode: (recipe, healthMode) =>
    api.post('/ai/health-mode', {
      recipe,
      healthMode,
    }),

  getHealthModeRecipes: (healthMode) =>
    api.post('/ai/health-mode', { healthMode }),

  personalizeRecipe: (data) =>
    api.post('/ai/personalize', data),

  personalizeRecommendations: (availableRecipes) =>
    api.post('/ai/personalize', {
      availableRecipes,
    }),

  suggestWasteReduction: (recipe, ingredients) =>
    api.post('/ai/waste-reduction', {
      recipe,
      ingredients,
    }),

  getWasteReductionSuggestions: (data) =>
    api.post('/ai/waste-reduction', data),

  scanFridge: (imageFile, autoAdd = false) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    return api.post(`/ai/scan-fridge?autoAdd=${autoAdd}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  chatWithAI: (data) =>
    api.post('/ai/chat', data),

  getSeasonalSuggestions: () =>
    api.get('/ai/seasonal-suggestions'),
};

export const mealPlanService = {
  getWeeklyMealPlan: (weekStartDate) =>
    api.get(`/meal-plan/weekly/${weekStartDate}`),

  generateMealPlan: (weekStartDate, servings) =>
    api.post('/meal-plan/generate', {
      weekStartDate,
      servings,
    }),

  addMealToplan: (mealPlanId, dayOfWeek, mealType, recipeTitle, estimatedCost) =>
    api.post(`/meal-plan/${mealPlanId}/add`, {
      dayOfWeek,
      mealType,
      recipeTitle,
      estimatedCost,
    }),

  removeMealFromPlan: (mealPlanId, mealId) =>
    api.delete(`/meal-plan/${mealPlanId}/meal/${mealId}`),

  getShoppingListForPlan: (mealPlanId) =>
    api.get(`/meal-plan/${mealPlanId}/shopping-list`),
};

export const preferenceService = {
  getPreferences: () =>
    api.get('/preferences'),

  updatePreferences: (data) =>
    api.put('/preferences', data),

  getTasteProfile: () =>
    api.get('/preferences/taste-profile'),

  updateTasteProfile: (data) =>
    api.put('/preferences/taste-profile', data),
};

export const shoppingService = {
  getShoppingLists: () =>
    api.get('/shopping'),

  createShoppingList: (name) =>
    api.post('/shopping', { name }),

  getShoppingList: (id) =>
    api.get(`/shopping/${id}`),

  addItemToList: (listId, ingredientId, quantity, unit, estimatedCost) =>
    api.post(`/shopping/${listId}/items`, {
      ingredientId,
      quantity,
      unit,
      estimatedCost,
    }),

  updateListItem: (listId, itemId, data) =>
    api.put(`/shopping/${listId}/items/${itemId}`, data),

  removeListItem: (listId, itemId) =>
    api.delete(`/shopping/${listId}/items/${itemId}`),

  markAsPurchased: (listId, itemId) =>
    api.patch(`/shopping/${listId}/items/${itemId}/purchase`),
};

// Export default combined API service
const apiService = {
  // Auth
  ...authService,

  // Pantry
  getPantryItems: pantryService.getPantryItems,
  getPantryItem: pantryService.getPantryItem,
  addPantryItem: pantryService.addPantryItem,
  updatePantryItem: pantryService.updatePantryItem,
  deletePantryItem: pantryService.deletePantryItem,
  generatePantryRecipe: pantryService.generatePantryRecipe,

  // Recipes
  generateRecipes: recipeService.generateRecipes,
  getRecipes: recipeService.getRecipes,
  getRecipe: recipeService.getRecipe,
  getRecipeSubstitutes: recipeService.getRecipeSubstitutes,
  scaleRecipe: recipeService.scaleRecipe,
  convertRecipeCuisine: recipeService.convertRecipeCuisine,
  searchRecipes: recipeService.searchRecipes,

  // AI
  rateDifficulty: aiService.rateDifficulty,
  adjustDifficulty: (data) => aiService.rateDifficulty(data),
  getHealthModeRecipes: aiService.getHealthModeRecipes,
  personalizeRecipe: aiService.personalizeRecipe,
  getWasteReductionSuggestions: aiService.getWasteReductionSuggestions,
  scanFridge: aiService.scanFridge,
  chatWithAI: aiService.chatWithAI,
  getSeasonalSuggestions: aiService.getSeasonalSuggestions,

  // Meal Plan
  generateMealPlan: mealPlanService.generateMealPlan,
  getWeeklyMealPlan: mealPlanService.getWeeklyMealPlan,
  addMealToWeeklyPlan: mealPlanService.addMealToWeeklyPlan,
  removeMealFromPlan: mealPlanService.removeMealFromPlan,
  getMealPlanShoppingList: mealPlanService.getMealPlanShoppingList,

  // Preferences
  getPreferences: preferenceService.getPreferences,
  updatePreferences: preferenceService.updatePreferences,
  getTasteProfile: preferenceService.getTasteProfile,
  updateTasteProfile: preferenceService.updateTasteProfile,

  // Shopping
  getShoppingLists: shoppingService.getShoppingLists,
  createShoppingList: shoppingService.createShoppingList,
  getShoppingList: shoppingService.getShoppingList,
  addItemToList: shoppingService.addItemToList,
  updateListItem: shoppingService.updateListItem,
  removeListItem: shoppingService.removeListItem,
  markAsPurchased: shoppingService.markAsPurchased,
};

export default apiService;
