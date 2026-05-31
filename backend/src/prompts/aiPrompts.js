// Recipe Generation Prompt
const recipeGenerationPrompt = (ingredients, healthMode = 'Normal', servings = 4, language = 'en') => {
  return `You are an expert Indian Chef and Culinary Instructor specializing in both traditional cooked meals and modern raw preparations. 

Generate a COMPREHENSIVE, HIGHLY DETAILED recipe using these ingredients: ${ingredients.join(', ')}.

CONTEXT & STYLE:
1. CUISINE: Default to Indian culinary styles, flavors, and techniques (e.g., using cardamom, saffron, chaat masala, or cumin where appropriate).
2. INTELLIGENT PREPARATION: Analyze the ingredients carefully. If the combination (e.g., banana + milk, or fruit + yogurt) is logically suited for a RAW preparation (Shakes, Lassis, Smoothies, Chaats, Salads), do NOT include cooking or heating steps like 'heating oil' or 'searing'.
3. ACCURACY: Ensure the cooking logic is sound. Do not suggest cooking/heating for fresh fruits unless it is a specific traditional Indian dessert (like Banana Bhajji or Halwa). If it's a shake, focus on blending and chilling.

🧠 INGREDIENT COMPATIBILITY CHECK (do this before generating):
- Categorize each ingredient: protein (chicken, mutton, fish, egg, paneer), dairy (milk, curd, cream), fruit (banana, mango, apple), vegetable (potato, tomato, spinach), grain (rice, wheat, oats), legume (dal, lentil, chickpea).
- Identify incompatible combinations:
  * fruit/dairy (milk, banana) + meat (chicken, mutton) = INCOMPATIBLE — never mix these
  * banana + milk = compatible (shake/smoothie/dessert)
  * chicken + vegetables = compatible (curry/stir-fry)
  * milk + rice = compatible (kheer/porridge)
- If ALL ingredients are compatible → use all of them in the recipe.
- If there are incompatible ingredients → pick the LARGEST compatible group and build the recipe around only that group. Silently ignore the incompatible ones.
- NEVER force-combine ingredients that are culinarily wrong or produce an unappetizing dish.

2. Generate INGREDIENT-SPECIFIC preparation and cooking instructions using professional Indian techniques.

🔥 HIGHLY DETAILED INSTRUCTIONS REQUIREMENT (CRITICAL):
Every single step in the "steps" array must be highly detailed, comprehensive, and consist of at least 3 to 5 clear, descriptive sentences.
Each step must contain:
1. SPECIFIC ACTIONS & SETTINGS: Describe exact physical actions (e.g., "whisk vigorously", "fold gently", "slice into uniform 1-inch cubes") and precise flame/heat levels (e.g., "low heat to prevent curdling", "high heat for quick searing").
2. VISUAL, TEXTURAL & AROMATIC CUES: Tell the user exactly what to look, feel, or smell for (e.g., "sauté until the onions turn translucent and develop a light golden-brown edge", "cook until the raw pungent smell of ginger-garlic paste is replaced by a sweet, aromatic fragrance", "cook until you see tiny droplets of oil separating and forming a thin layer on the outer edges of the masala paste").
3. CULINARY REASONING (EXPLAIN WHY): Explain the chef's logic behind the technique (e.g., "Blooming the whole cumin seeds in medium-hot ghee activates the fat-soluble essential oils, distributing a rich earthy base flavor throughout the entire dish", "Resting the meat allows the protein fibers to relax and reabsorb their natural juices, making every bite incredibly tender").
4. PITFALLS TO AVOID: Highlight what can go wrong and how to prevent it (e.g., "Keep the heat low at this stage because dry chili powder and turmeric burn very quickly, which would turn the entire gravy bitter and dark").

📋 TECHNIQUE REQUIREMENTS:

**RAW / NO-HEAT PREPARATION (If the dish is a Shake, Salad, or Drink):**
- BLENDING: Proper order of ingredients, pulse techniques for desired consistency.
- CHILLING: Importance of cold serving for lassis/shakes.
- SEASONING: Use of jaggery, honey, or Indian aromatic spices (Elaichi/Kesar).

**COOKED PREPARATION (If the dish requires heat):**
- TEMPERING (Tadka): Detailed instructions for heating oil/ghee and 'blooming' whole spices until they splutter.
- SAUTEING (Bhuna): How to cook onions/masala until the oil separates.
- RICE/GRAINS: 1:2 water ratio, washing 3-4 times, soaking for 30 mins, and steaming for 5 mins.
- EXPLAIN WHY: Include the logic for techniques (e.g., "Bhuna ensures the raw smell of spices is replaced by a rich aroma").

🎯 HEALTH MODE ADAPTATIONS (Indian Context):
**Keto:** Use Ghee/Butter, focus on paneer/meat/nuts, avoid sugars/starches.
**Diabetic:** Use Millets/Oats if provided, focus on leafy greens, use low-GI alternatives.
**HighProtein:** Prioritize dals, legumes, and lean proteins like curd or chicken.
**WeightLoss:** Minimal oil, focus on steaming, grilling, and high-fiber additions.

Format as JSON with these exact keys:
{
  "title": "string (Creative Indian title, e.g., 'Kesar Banana Milkshake' or 'Tadka Dal')",
  "description": "string (Explain the Indian flavors and why this combination works)",
  "difficulty": "Easy|Medium|Hard",
  "prepTime": number,
  "cookTime": number (Use 0 for raw preparations like shakes),
  "ingredients": [
    {
      "name": "string",
      "quantity": number,
      "unit": "string"
    }
  ],
  "steps": [
    {
      "stepNumber": number,
      "instruction": "string (Highly detailed, 3-5 sentence step containing actions, heat levels, visual/aromatic cues, culinary reasons, and common pitfalls to avoid)",
      "duration": number
    }
  ],
  "estimatedCost": number (in Rupees),
  "nutrition": {
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number
  }
}

Return ONLY valid JSON.`;
};

// Substitution Prompt
const substitutionPrompt = (ingredient, targetCuisine = 'Indian') => {
  return `Suggest 3 Indian-style substitutions for ${ingredient}.
Consider flavor profile, texture, and availability in an Indian kitchen.

Return JSON:
{
  "substitutions": [
    {
      "name": "string",
      "reason": "string (Explain why it works in Indian dishes)",
      "conversionRatio": "string (e.g. 1:1)"
    }
  ]
}

Return ONLY valid JSON.`;
};

// Nutrition Analysis Prompt
const nutritionPrompt = (ingredients) => {
  return `Provide a comprehensive nutritional breakdown for these ingredients: ${ingredients.join(', ')}.

Return JSON:
{
  "totalNutrition": {
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number,
    "fiber": number
  },
  "healthLevel": "Low|Medium|High",
  "keyNutrients": ["string"],
  "dietaryLabels": ["string (e.g. Vegetarian, Gluten-Free)"]
}

Return ONLY valid JSON.`;
};

// Difficulty Rating Prompt
const difficultyRatingPrompt = (recipe) => {
  return `Assess the cooking difficulty of this recipe.

Recipe: ${JSON.stringify(recipe)}

Criteria:
- Number of steps
- Specialized techniques required (e.g. Bhuna, Tadka)
- Total time
- Ingredient complexity

Return JSON:
{
  "level": "Easy|Medium|Hard",
  "score": number (1-10),
  "reasons": ["string"],
  "requiredSkills": ["string"],
  "estimatedCookingExperience": "Beginner|Intermediate|Advanced"
}

Return ONLY valid JSON.`;
};

// Health Mode Adjustment Prompt
const healthModePrompt = (recipe, healthMode) => {
  return `Adapt this recipe for ${healthMode} diet mode using Indian dietary principles.

Original Recipe: ${JSON.stringify(recipe)}

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
  return `Personalize recipe recommendations based on Indian taste profiles.

User Profile: ${JSON.stringify(userProfile)}
Available Recipes: ${JSON.stringify(availableRecipes)}

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
    return `Suggest Indian-style ways to reduce food waste for this recipe.

Recipe: ${recipe}
Ingredients: ${ingredients.join(', ')}

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
    return `Suggest creative Indian snack or meal ideas to use these ingredients before they expire.

Ingredients: ${ingredients.join(', ')}

Return JSON:
{
  "suggestions": [
     {
      "title": "string",
      "description": "string",
      "wastePercentage": "string",
      "ingredients": ["string"],
      "tips": ["string"]
    }
  ]
}

Return ONLY valid JSON.`;
  }
};

// Cuisine Converter Prompt
const cuisineConverterPrompt = (originalRecipe, targetCuisine) => {
  return `Convert this recipe to ${targetCuisine} cuisine style.

Original Recipe: ${JSON.stringify(originalRecipe)}

Return JSON:
{
  "convertedRecipe": {
    "title": "string",
    "ingredients": [{"name": "string", "quantity": number, "unit": "string"}],
    "steps": ["string"],
    "flavorProfile": "string",
    "keyChanges": ["string"]
  }
}

Return ONLY valid JSON.`;
};

// Meal Plan Generator Prompt
const mealPlanPrompt = (userPreferences, restrictions, servings = 4, pantryItems = [], planType = 'Healthy') => {
  const seed = Math.floor(Math.random() * 10000);
  return `Generate a UNIQUE 7-day Indian meal plan. 

PLAN TYPE: ${planType}
Restrictions: ${restrictions.join(', ')}
Pantry Items: ${pantryItems.join(', ')}
Seed: ${seed}

Return JSON:
{
  "mealPlan": [
    {
      "day": "0",
      "breakfast": {"recipe": "string", "estimatedCost": number, "ingredients": ["string"]},
      "lunch":     {"recipe": "string", "estimatedCost": number, "ingredients": ["string"]},
      "dinner":    {"recipe": "string", "estimatedCost": number, "ingredients": ["string"]},
      "snack":     {"recipe": "string", "estimatedCost": number, "ingredients": ["string"]}
    }
  ],
  "shoppingList": [{"item": "string", "quantity": number, "unit": "string"}],
  "totalWeeklyCost": number,
  "nutritionSummary": {"avgDailyCalories": number, "protein": "string", "carbs": "string", "fat": "string"}
}

Return ONLY valid JSON.`;
};

// Image Analysis Prompt for Fridge Scanner
const imageAnalysisPrompt = () => {
  return `Analyze this image of an Indian refrigerator/pantry and identify items.

Return JSON:
{
  "detectedItems": [
    {
      "name": "string",
      "quantity": number,
      "unit": "string",
      "freshness": "Fresh|OK|Expiringsoon",
      "estimatedExpiry": "YYYY-MM-DD",
      "location": "Fridge|Freezer|Pantry",
      "confidence": number
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
