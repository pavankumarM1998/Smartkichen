// Recipe Generation Prompt
const recipeGenerationPrompt = (ingredients, healthMode = 'Normal', servings = 4) => {
  return `You are a professional chef and culinary instructor. Generate a DETAILED, COMPREHENSIVE recipe using these ingredients: ${ingredients.join(', ')}.

Health Mode: ${healthMode}
Number of Servings: ${servings}

🔴 CRITICAL REQUIREMENTS:
1. You MUST include ALL of the following ingredients: ${ingredients.join(', ')}
2. Do NOT skip any ingredient. Every single one must appear in the ingredients list.
3. Generate INGREDIENT-SPECIFIC preparation and cooking instructions (not generic steps).


📋 DETAILED INSTRUCTION REQUIREMENTS:

For EACH ingredient, provide SPECIFIC techniques:

**RICE/GRAINS (CRITICAL - BE VERY DETAILED):**
- WASHING: Place rice in large bowl, add cold water, rub grains gently with hands for 30 seconds. You'll see cloudy white water (starch). Drain completely. Repeat 3-4 times until water runs clear and transparent. Explain WHY: removes excess starch, prevents sticky/gummy rice.
- SOAKING: Soak washed rice in fresh cold water for 30 minutes. Explain WHY: softens grains, ensures even cooking. Then drain completely using strainer.
- WATER RATIO: Exact ratio is 1:2 (1 cup rice to 2 cups water). Give example: "If you have 2 cups rice, add 4 cups water."
- COOKING METHOD: 
  * Add rice and water to pan, add pinch of salt
  * Stir well with wooden spoon
  * High heat until FULL ROLLING BOIL (large bubbles breaking surface)
  * IMMEDIATELY reduce to lowest heat (simmer)
  * Cover tightly with lid
  * Cook 15-18 minutes WITHOUT stirring or lifting lid (traps steam)
  * Test one grain - should be tender, water absorbed
  * If firm, cook 2-3 more minutes
  * Remove from heat, let steam with lid on for 5 minutes
  * Fluff with fork to separate grains
- DONENESS: Tender grains, water fully absorbed, fluffy texture
- TOTAL TIME: ~18 minutes cooking + 5 minutes steaming

**EGGS:**
- How to crack and beat (until frothy, air incorporated)
- Cooking technique (scramble, fry, boil)
- Temperature and timing
- Doneness cues (soft, moist, not overcooked)
- Texture goals

**CHICKEN/MEAT:**
- Cutting size (1-2 inch pieces)
- Marinating (ingredients, time)
- Cooking method (sear, flip, check doneness)
- Internal temperature or visual cues (no pink inside)
- Resting time if needed

**VEGETABLES:**
- Cutting technique (dice, slice, chop)
- Size uniformity
- Cooking time based on type
- Doneness indicators (tender, crispy, caramelized)

**SEASONINGS/SPICES:**
- When to add (beginning, middle, end)
- Blooming technique for spices
- Taste and adjust guidance

🎯 HEALTH MODE ADAPTATIONS:

**Keto:** Use butter/ghee, add cheese, avoid high-carb ingredients, focus on fats
**Diabetic:** Use olive oil, add garlic/herbs, reduce salt, focus on low-glycemic
**HighProtein:** Add lentils/beans, use lean proteins, include protein-rich seasonings
**WeightLoss:** Use oil spray, add vegetables, include lemon/herbs, minimize fat
**Normal:** Balanced approach with standard cooking oil and seasonings

📝 INSTRUCTION STYLE:
- Write like you're teaching someone to cook
- Include WHY (e.g., "This removes excess starch")
- Add visual/sensory cues (golden brown, shimmers, fragrant)
- Mention common mistakes to avoid
- Give timing for each step
- Be specific about heat levels (medium-high, low simmer)

Format as JSON with these exact keys:
{
  "title": "string (include health mode if not Normal, e.g., 'Keto Chicken Rice Bowl')",
  "description": "string (explain health benefits and what makes this recipe special)",
  "difficulty": "Easy|Medium|Hard",
  "prepTime": number (realistic based on ingredients),
  "cookTime": number (realistic based on cooking methods),
  "ingredients": [
    {
      "name": "string",
      "quantity": number,
      "unit": "string (cups, tablespoons, pieces, grams, etc.)"
    }
  ],
  "steps": [
    {
      "stepNumber": number,
      "instruction": "string (DETAILED, ingredient-specific instruction with techniques)",
      "duration": number (minutes for this specific step)
    }
  ],
  "estimatedCost": number (in rupees, realistic),
  "nutrition": {
    "calories": number,
    "protein": number,
    "fat": number,
    "carbs": number,
    "fiber": number
  },
  "wasteSavings": ["string (specific tips to minimize waste for THIS recipe)"],
  "tips": ["string (cooking tips, variations, serving suggestions)"]
}

Return ONLY valid JSON, no markdown, no explanations.`;
};

// Substitution Engine Prompt
const substitutionPrompt = (missingIngredient, availableIngredients, dishType = 'general') => {
  return `You are a culinary expert. Find the best substitutes for "${missingIngredient}" in a ${dishType} dish.

Available ingredients in kitchen: ${availableIngredients.join(', ')}

Requirements:
1. Rank substitutes by quality (best first)
2. Explain how to adjust quantity/usage for each substitute
3. List any flavor/texture changes
4. Suggest ratios (e.g., "use 3/4 of the amount")

Return as JSON:
{
  "substitutes": [
    {
      "ingredient": "string",
      "ratio": "string",
      "explanation": "string",
      "flavorImpact": "string",
      "quality_score": number (1-10)
    }
  ],
  "recommendation": "string"
}

Return ONLY valid JSON.`;
};

// Nutrition Estimation Prompt
const nutritionPrompt = (ingredients, servings = 1) => {
  return `Calculate nutritional information for this recipe with ${servings} servings.

Ingredients: ${JSON.stringify(ingredients)}

Provide per-serving values and totals:

Return JSON:
{
  "perServing": {
    "calories": number,
    "protein": number,
    "fat": number,
    "carbs": number,
    "fiber": number,
    "sodium": number
  },
  "total": {
    "calories": number,
    "protein": number,
    "fat": number,
    "carbs": number,
    "fiber": number,
    "sodium": number
  },
  "allergens": ["string"],
  "healthWarnings": ["string"]
}

Return ONLY valid JSON.`;
};

// Difficulty Rating Prompt
const difficultyRatingPrompt = (recipeTitle, ingredients, steps) => {
  return `Rate the difficulty of this recipe and explain why.

Recipe: ${recipeTitle}
Ingredients (${ingredients.length}): ${ingredients.join(', ')}
Number of steps: ${steps.length}

Consider:
- Number of ingredients
- Cooking techniques required
- Time commitment
- Equipment needed
- Skill level required

Return JSON:
{
  "difficulty": "Easy|Medium|Hard",
  "score": number (1-10),
  "reasoning": "string",
  "requiredSkills": ["string"],
  "estimatedCookingExperience": "Beginner|Intermediate|Advanced"
}

Return ONLY valid JSON.`;
};

// Health Mode Adjustment Prompt
const healthModePrompt = (recipe, healthMode) => {
  return `Adapt this recipe for ${healthMode} diet mode.

Original Recipe: ${JSON.stringify(recipe)}

Health Mode Rules:
- Keto: Low carbs (<10g per serving), high fat
- Diabetic: Low glycemic index, controlled portions
- HighProtein: 40%+ calories from protein
- WeightLoss: Low calorie density, high fiber, increased protein

Return JSON:
{
  "adaptedRecipe": {
    "ingredients": [{"name": "string", "quantity": number, "unit": "string", "reason": "string"}],
    "replacements": [{"original": "string", "replacement": "string", "reason": "string"}],
    "nutritionAdjustment": {"calories": number, "macros": {}}
  },
  "warnings": ["string"],
  "tips": ["string"]
}

Return ONLY valid JSON.`;
};

// Taste Personalization Prompt
const tastePersonalizationPrompt = (userProfile, availableRecipes) => {
  return `Personalize recipe recommendations based on user taste profile.

User Profile: ${JSON.stringify(userProfile)}
Available Recipes: ${JSON.stringify(availableRecipes)}

User preferences: ${userProfile.cuisinePreferences?.join(', ') || 'All'}
Spice Level: ${userProfile.spiceLevel}/5
Disliked: ${userProfile.dislikedIngredients?.join(', ') || 'None'}

Score each recipe from 1-10 based on match to user preferences.

Return JSON:
{
  "recommendations": [
    {
      "recipe": "string",
      "matchScore": number (1-10),
      "reasoning": "string",
      "customizations": ["string"]
    }
  ]
}

Return ONLY valid JSON.`;
};

// Waste Reduction Prompt
const wasteReductionPrompt = (recipe, ingredients) => {
  if (recipe) {
    return `Suggest ways to reduce food waste for this recipe.

Recipe: ${recipe}
Ingredients: ${ingredients.join(', ')}

Consider:
- Using vegetable scraps
- Storing leftovers properly
- Repurposing byproducts
- Portion control

Return JSON:
{
  "wasteSavings": [
    {
      "suggestion": "string",
      "saves": "string",
      "implementation": "string"
    }
  ],
  "storageGuide": {"item": "string", "method": "string", "duration": "string"},
  "leftoverRecipes": ["string"]
}

Return ONLY valid JSON.`;
  } else {
    // Ingredients-only mode (for Waste Reduction Page)
    return `Suggest creative ways to use these specific ingredients to prevent food waste.

Ingredients: ${ingredients.join(', ')}

Provide:
1. "wasteSavings": Practical tips to use them up.
2. "storageGuide": How to store them to extend shelf life.
3. "leftoverRecipes": Quick snack/meal ideas using these ingredients.

Return JSON:
{
  "wasteSavings": [
    {
      "title": "string",
      "description": "string",
      "wastePercentage": "string (e.g. 30%)",
      "ingredients": ["string"],
      "tips": ["string"]
    }
  ],
  "suggestions": [
     {
      "title": "string",
      "description": "string",
      "wastePercentage": "string (e.g. 30%)",
      "ingredients": ["string"],
      "tips": ["string"]
    }
  ]
}

Ensure the root key "suggestions" is present as the frontend expects it.
Return ONLY valid JSON.`;
  }
};

// Cuisine Converter Prompt
const cuisineConverterPrompt = (originalRecipe, targetCuisine) => {
  return `Convert this ${originalRecipe.cuisine} recipe to ${targetCuisine} cuisine style.

Original Recipe: ${JSON.stringify(originalRecipe)}

Adapt:
- Spices and seasonings
- Cooking methods
- Flavor profile
- Ingredient replacements

Return JSON:
{
  "convertedRecipe": {
    "title": "string",
    "ingredients": [{"name": "string", "quantity": number, "unit": "string"}],
    "steps": ["string (Detailed step-by-step instructions. Include specific techniques.)"],
    "flavorProfile": "string",
    "keyChanges": ["string"]
  }
}

Return ONLY valid JSON.`;
};

// Meal Plan Generator Prompt
const mealPlanPrompt = (userPreferences, restrictions, servings = 4, pantryItems = [], planType = 'Healthy') => {
  // Random seed so AI gives variety on each call
  const seed = Math.floor(Math.random() * 10000);

  const planRules = {
    Healthy:     'Balanced macros, whole foods, minimal processed ingredients, plenty of vegetables and fruit.',
    Diet:        'Low calorie (under 1800 kcal/day), high fiber, low fat, portion controlled, light meals.',
    HighProtein: 'Each meal must include a protein source (chicken, eggs, lentils, fish, tofu). Target 40%+ calories from protein.',
    Keto:        'Strictly low carb (under 20g net carbs/day), high fat, moderate protein. No bread, rice, pasta, sugar.',
    Diabetic:    'Low glycemic index foods only. No refined sugar, white rice, or white bread. High fiber, controlled portions.',
    Vegetarian:  'No meat or fish. Include eggs and dairy. Rich in legumes, vegetables, whole grains.',
    Vegan:       'No animal products whatsoever. Use tofu, tempeh, legumes, nuts, seeds. Ensure B12 and iron-rich foods.',
    Custom:      'Diverse mix of different cuisines (Indian, Italian, Asian, Mediterranean). Use variety across days.',
  };

  const ruleForPlan = planRules[planType] || planRules['Healthy'];

  return `You are a professional dietitian and chef. Generate a UNIQUE 7-day meal plan. 

PLAN TYPE: ${planType}
PLAN RULES: ${ruleForPlan}
Servings per meal: ${servings}
Dietary Restrictions: ${restrictions.length > 0 ? restrictions.join(', ') : 'None'}
Available Pantry Ingredients (prioritize these): ${pantryItems.length > 0 ? pantryItems.join(', ') : 'None listed'}
Cuisine Preferences: ${userPreferences.cuisinePreferences?.join(', ') || 'Any'}
Randomization Seed (use this to ensure unique output each call): ${seed}

MANDATORY REQUIREMENTS:
1. Strictly follow the "${planType}" plan rules above — this is the MOST important requirement.
2. NEVER repeat the same meal twice in the week — every meal must be different.
3. Vary the cuisines and ingredients across days.
4. Use pantry items when suitable to reduce waste.
5. Each day must have all 4 meals: breakfast, lunch, dinner, snack.

Return ONLY this JSON structure, no markdown:
{
  "mealPlan": [
    {
      "day": "0",
      "breakfast": {"recipe": "string (specific dish name)", "estimatedCost": number, "ingredients": ["string"]},
      "lunch":     {"recipe": "string (specific dish name)", "estimatedCost": number, "ingredients": ["string"]},
      "dinner":    {"recipe": "string (specific dish name)", "estimatedCost": number, "ingredients": ["string"]},
      "snack":     {"recipe": "string (specific dish name)", "estimatedCost": number, "ingredients": ["string"]}
    }
  ],
  "shoppingList": [{"item": "string", "quantity": number, "unit": "string"}],
  "totalWeeklyCost": number,
  "nutritionSummary": {"avgDailyCalories": number, "protein": "string", "carbs": "string", "fat": "string"}
}

day field values: "0" = Monday, "1" = Tuesday, ... "6" = Sunday. Include all 7 days (0–6).
Return ONLY valid JSON.`;
};

// Image Analysis Prompt for Fridge Scanner
const imageAnalysisPrompt = () => {
  return `Analyze this image of a refrigerator or pantry and identify all visible food items and ingredients.

For each item detected:
1. Name of ingredient
2. Approximate quantity (if visible)
3. Freshness assessment (Fresh/OK/Expiring Soon)
4. Estimated expiry date (if known)

Return JSON:
{
  "detectedItems": [
    {
      "name": "string",
      "quantity": number,
      "unit": "string",
      "freshness": "Fresh|OK|Expiringsoon",
      "estimatedExpiry": "YYYY-MM-DD",
      "location": "Fridge|Freezer|Pantry|Countertop",
      "confidence": number (0-1)
    }
  ],
  "summary": "string",
  "warnings": ["string"]
}

Return ONLY valid JSON.`;
};

module.exports = {
  recipeGenerationPrompt,
  substitutionPrompt,
  nutritionPrompt,
  difficultyRatingPrompt,
  healthModePrompt,
  tastePersonalizationPrompt,
  wasteReductionPrompt,
  cuisineConverterPrompt,
  mealPlanPrompt,
  imageAnalysisPrompt,
};
