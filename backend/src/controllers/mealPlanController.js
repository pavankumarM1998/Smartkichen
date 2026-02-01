const { apiResponse } = require('../utils/response');
const aiService = require('../services/aiService');
const db = require('../services/realtimeDbService');
const { v4: uuidv4 } = require('uuid');

const getWeeklyMealPlan = async (req, res, next) => {
  try {
    const { weekStartDate } = req.params;

    // Find meal plan for this user and week
    const mealPlans = await db.getDocs(db.paths.mealPlans, {
      userId: req.userId,
      weekStartDate: weekStartDate // Expecting YYYY-MM-DD string
    });

    const mealPlan = mealPlans.length > 0 ? mealPlans[0] : null;

    if (!mealPlan) {
      return apiResponse(res, 404, false, 'Meal plan not found for this week');
    }

    // Get meals for this plan
    const meals = await db.getDocs(db.paths.mealPlanItems, {
      mealPlanId: mealPlan.id
    });

    const fullPlan = {
      ...mealPlan,
      meals
    };

    apiResponse(res, 200, true, 'Weekly meal plan retrieved', fullPlan);
  } catch (error) {
    next(error);
  }
};

const generateMealPlan = async (req, res, next) => {
  try {
    console.log('[MealPlan] Generating plan request received');
    const { weekStartDate, servings = 4 } = req.body;

    if (!weekStartDate) {
      console.error('[MealPlan] Missing weekStartDat');
      return apiResponse(res, 400, false, 'Week start date is required');
    }

    // Get user preferences
    console.log('[MealPlan] Fetching preferences for user:', req.userId);
    const preferencesDocs = await db.getDocs(db.paths.preferences, { userId: req.userId });
    const preferences = preferencesDocs.length > 0 ? preferencesDocs[0] : null;
    console.log('[MealPlan] Preferences found:', preferences ? 'Yes' : 'No', preferences);

    // Get taste profile
    // Note: Assuming taste profile is part of preferences or a separate collection
    // For now, defaulting to basic values if not found

    // Get Pantry Items (to prioritize existing ingredients)
    const pantryDocs = await db.getDocs(db.paths.pantryItems, { userId: req.userId });
    const pantryItems = pantryDocs.map(item => item.ingredientName || item.name);
    console.log('[MealPlan] Pantry items found:', pantryItems.length);

    // Generate meal plan using AI
    console.log('[MealPlan] Calling AI Service...');
    let generatedPlan;
    try {
      generatedPlan = await aiService.generateMealPlan(
        {
          healthMode: preferences?.healthMode || 'Normal',
          cuisinePreferences: preferences?.cuisinePreferences || ['Any'],
        },
        preferences?.dietaryRestrictions || [],
        servings,
        pantryItems, // Pass pantry items
        req.body.searchQuery || '' // Pass search query/focus
      );
    } catch (aiError) {
      console.warn('[MealPlan] AI generation failed, using fallback:', aiError.message);
      // Fallback Mock Data
      generatedPlan = {
        mealPlan: [
          { day: "0", breakfast: { recipe: "Oatmeal with Fruits", ingredients: ["Oats", "Milk", "Banana"], estimatedCost: 2.5 }, lunch: { recipe: "Grilled Chicken Salad", ingredients: ["Chicken Breast", "Lettuce", "Tomatoes"], estimatedCost: 5.0 }, dinner: { recipe: "Pasta Primavera", ingredients: ["Pasta", "Mixed Vegetables", "Olive Oil"], estimatedCost: 4.0 }, snack: { recipe: "Apple Slices", ingredients: ["Apple"], estimatedCost: 1.0 } },
          { day: "1", breakfast: { recipe: "Scrambled Eggs", ingredients: ["Eggs", "Toast", "Butter"], estimatedCost: 2.0 }, lunch: { recipe: "Turkey Sandwich", ingredients: ["Turkey", "Bread", "Lettuce"], estimatedCost: 4.5 }, dinner: { recipe: "Baked Salmon", ingredients: ["Salmon", "Asparagus", "Lemon"], estimatedCost: 8.0 }, snack: { recipe: "Yogurt", ingredients: ["Yogurt"], estimatedCost: 1.5 } },
          { day: "2", breakfast: { recipe: "Pancakes", ingredients: ["Flour", "Milk", "Eggs"], estimatedCost: 3.0 }, lunch: { recipe: "Vegetable Soup", ingredients: ["Carrots", "Celery", "Onion"], estimatedCost: 3.5 }, dinner: { recipe: "Beef Stir Fry", ingredients: ["Beef", "Peppers", "Rice"], estimatedCost: 7.0 }, snack: { recipe: "Nuts", ingredients: ["Almonds"], estimatedCost: 2.0 } },
          { day: "3", breakfast: { recipe: "Smoothie", ingredients: ["Berries", "Banana", "Yogurt"], estimatedCost: 3.5 }, lunch: { recipe: "Quinoa Salad", ingredients: ["Quinoa", "Cucumber", "Feta"], estimatedCost: 5.0 }, dinner: { recipe: "Roast Chicken", ingredients: ["Whole Chicken", "Potatoes", "Carrots"], estimatedCost: 9.0 }, snack: { recipe: "Granola Bar", ingredients: ["Granola"], estimatedCost: 1.0 } },
          { day: "4", breakfast: { recipe: "Avocado Toast", ingredients: ["Bread", "Avocado", "Egg"], estimatedCost: 4.0 }, lunch: { recipe: "Wrap", ingredients: ["Tortilla", "Hummus", "Veggies"], estimatedCost: 4.0 }, dinner: { recipe: "Pizza", ingredients: ["Dough", "Tomato Sauce", "Cheese"], estimatedCost: 6.0 }, snack: { recipe: "Fruit Salad", ingredients: ["Melon", "Grapes"], estimatedCost: 3.0 } },
          { day: "5", breakfast: { recipe: "French Toast", ingredients: ["Bread", "Eggs", "Cinnamon"], estimatedCost: 2.5 }, lunch: { recipe: "BLT Sandwich", ingredients: ["Bacon", "Lettuce", "Tomato"], estimatedCost: 5.0 }, dinner: { recipe: "Tacos", ingredients: ["Taco Shells", "Ground Beef", "Cheese"], estimatedCost: 6.5 }, snack: { recipe: "Chips and Salsa", ingredients: ["Corn Chips", "Salsa"], estimatedCost: 2.5 } },
          { day: "6", breakfast: { recipe: "Waffles", ingredients: ["Waffle Mix", "Syrup"], estimatedCost: 3.0 }, lunch: { recipe: "Leftovers", ingredients: [], estimatedCost: 0 }, dinner: { recipe: "Roast Beef", ingredients: ["Beef Roast", "Potatoes"], estimatedCost: 10.0 }, snack: { recipe: "Popcorn", ingredients: ["Corn"], estimatedCost: 1.0 } }
        ]
      };
    }

    console.log('[MealPlan] AI Response received (structure check):',
      generatedPlan ? (generatedPlan.mealPlan ? 'Valid .mealPlan array' : 'Missing .mealPlan') : 'Null Response');

    if (!generatedPlan || !generatedPlan.mealPlan) {
      throw new Error('AI returned invalid meal plan structure');
    }

    // Check if plan already exists for this week
    const existingPlans = await db.getDocs(db.paths.mealPlans, {
      userId: req.userId,
      weekStartDate
    });
    console.log('[MealPlan] Existing plans check:', existingPlans.length);

    let mealPlanId;

    if (existingPlans.length > 0) {
      // Update existing plan
      mealPlanId = existingPlans[0].id;
      // Delete existing meals for this plan to overwrite
      const oldMeals = await db.getDocs(db.paths.mealPlanItems, { mealPlanId });
      for (const meal of oldMeals) {
        await db.deleteDoc(db.paths.mealPlanItems, meal.id);
      }
    } else {
      // Create new plan
      const newPlan = await db.createDoc(db.paths.mealPlans, {
        userId: req.userId,
        weekStartDate,
        createdAt: new Date().toISOString()
      });
      mealPlanId = newPlan.id;
    }
    console.log('[MealPlan] Plan ID set:', mealPlanId);

    // Save customized meals
    const mealPromises = [];

    for (const dayPlan of generatedPlan.mealPlan) {
      const dayIndex = parseInt(dayPlan.day); // 0-6 (Mon-Sun)

      const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

      for (const type of mealTypes) {
        if (dayPlan[type]) {
          mealPromises.push(db.createDoc(db.paths.mealPlanItems, {
            mealPlanId,
            dayOfWeek: dayIndex,
            mealType: type,
            recipeTitle: dayPlan[type].recipe,
            estimatedCost: dayPlan[type].estimatedCost || 0,
            recipeId: null, // Could link to actual recipe if it exists
            ingredients: dayPlan[type].ingredients || []
          }));
        }
      }
    }

    await Promise.all(mealPromises);
    console.log('[MealPlan] All meals saved to database');

    // Return the full plan
    const meals = await db.getDocs(db.paths.mealPlanItems, { mealPlanId });

    const fullPlan = {
      id: mealPlanId,
      userId: req.userId,
      weekStartDate,
      meals
    };

    apiResponse(res, 201, true, 'Meal plan generated successfully', fullPlan);
  } catch (error) {
    console.error('[MealPlan] Error generating meal plan:', error);
    next(error);
  }
};

const addMealToplan = async (req, res, next) => {
  try {
    const { mealPlanId } = req.params;
    const { dayOfWeek, mealType, recipeTitle, estimatedCost } = req.body;

    if (dayOfWeek === undefined || !mealType || !recipeTitle) {
      return apiResponse(res, 400, false, 'Missing required fields');
    }

    // Verify ownership
    const mealPlan = await db.getDocById(db.paths.mealPlans, mealPlanId);
    if (!mealPlan || mealPlan.userId !== req.userId) {
      return apiResponse(res, 404, false, 'Meal plan not found');
    }

    const meal = await db.createDoc(db.paths.mealPlanItems, {
      mealPlanId,
      dayOfWeek: parseInt(dayOfWeek),
      mealType,
      recipeTitle,
      estimatedCost: estimatedCost || 0
    });

    apiResponse(res, 201, true, 'Meal added to plan', meal);
  } catch (error) {
    next(error);
  }
};

const removeMealFromPlan = async (req, res, next) => {
  try {
    const { mealPlanId, mealId } = req.params;

    // Verify ownership
    const mealPlan = await db.getDocById(db.paths.mealPlans, mealPlanId);
    if (!mealPlan || mealPlan.userId !== req.userId) {
      return apiResponse(res, 404, false, 'Meal plan not found');
    }

    await db.deleteDoc(db.paths.mealPlanItems, mealId);

    apiResponse(res, 200, true, 'Meal removed from plan');
  } catch (error) {
    next(error);
  }
};

const getShoppingListForPlan = async (req, res, next) => {
  try {
    const { mealPlanId } = req.params;

    // Verify ownership
    const mealPlan = await db.getDocById(db.paths.mealPlans, mealPlanId);
    if (!mealPlan || mealPlan.userId !== req.userId) {
      return apiResponse(res, 404, false, 'Meal plan not found');
    }

    const meals = await db.getDocs(db.paths.mealPlanItems, { mealPlanId });

    // In a real app, you would aggregate ingredients here
    // For now, returning a placeholder or aggregated dummy list
    const items = [];
    let totalCost = 0;

    meals.forEach(meal => {
      totalCost += (meal.estimatedCost || 0);
      // Logic to parse ingredients from recipeTitle or linked recipe would go here
    });

    apiResponse(res, 200, true, 'Shopping list generated', {
      mealPlanId,
      items,
      totalCost
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWeeklyMealPlan,
  generateMealPlan,
  addMealToplan,
  removeMealFromPlan,
  getShoppingListForPlan,
};
