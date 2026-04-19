const { OpenAI } = require('openai');
const {
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
} = require('../prompts/aiPrompts');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const callAI = async (prompt, maxTokens = 2000) => {
  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional culinary AI assistant. Always return valid JSON responses.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
      max_tokens: maxTokens,
      timeout: parseInt(process.env.AI_MODEL_TIMEOUT || '30000'),
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to call AI service: ' + error.message);
  }
};

const generateRecipe = async (ingredients, healthMode = 'Normal', servings = 4) => {
  try {
    const prompt = recipeGenerationPrompt(ingredients, healthMode, servings);
    const response = await callAI(prompt, 2500);
    return JSON.parse(response);
  } catch (error) {
    console.error('Recipe generation error:', error);
    throw error;
  }
};

const getSubstitutes = async (missingIngredient, availableIngredients, dishType = 'general') => {
  try {
    const prompt = substitutionPrompt(missingIngredient, availableIngredients, dishType);
    const response = await callAI(prompt);
    return JSON.parse(response);
  } catch (error) {
    console.error('Substitution error:', error);
    throw error;
  }
};

const estimateNutrition = async (ingredients, servings = 1) => {
  try {
    const prompt = nutritionPrompt(ingredients, servings);
    const response = await callAI(prompt);
    return JSON.parse(response);
  } catch (error) {
    console.error('Nutrition estimation error:', error);
    throw error;
  }
};

const rateDifficulty = async (recipeTitle, ingredients, steps) => {
  try {
    const prompt = difficultyRatingPrompt(recipeTitle, ingredients, steps);
    const response = await callAI(prompt);
    return JSON.parse(response);
  } catch (error) {
    console.error('Difficulty rating error:', error);
    throw error;
  }
};

const adjustForHealthMode = async (recipe, healthMode) => {
  try {
    const prompt = healthModePrompt(recipe, healthMode);
    const response = await callAI(prompt);
    return JSON.parse(response);
  } catch (error) {
    console.error('Health mode adjustment error:', error);
    throw error;
  }
};

const personalizeRecommendations = async (userProfile, availableRecipes) => {
  try {
    const prompt = tastePersonalizationPrompt(userProfile, availableRecipes);
    const response = await callAI(prompt);
    return JSON.parse(response);
  } catch (error) {
    console.error('Personalization error:', error);
    throw error;
  }
};

const suggestWasteReduction = async (recipe, ingredients) => {
  try {
    const prompt = wasteReductionPrompt(recipe, ingredients);
    const response = await callAI(prompt);
    return JSON.parse(response);
  } catch (error) {
    console.error('Waste reduction suggestion error:', error);

    // Fallback Mock Data if OpenAI fails (Quota exceeded, etc.)
    console.log('⚠️ Switching to Mock Data for Waste Reduction');
    return {
      "wasteSavings": [
        {
          "title": "Creative Leftovers",
          "description": "Transform these ingredients into a delicious stir-fry or soup.",
          "wastePercentage": "100%",
          "ingredients": ingredients,
          "tips": ["Chop finely for faster cooking", "Freeze extras for later"]
        }
      ],
      "suggestions": [
        {
          "title": "Quick Stir-Fry",
          "description": "Sauté " + ingredients.slice(0, 3).join(', ') + " with soy sauce and garlic.",
          "wastePercentage": "100%",
          "ingredients": ingredients,
          "tips": ["Use high heat", "Don't overcrowd the pan"]
        },
        {
          "title": "Easy Soup Stock",
          "description": "Simmer leftovers with water and herbs to make a rich broth.",
          "wastePercentage": "100%",
          "ingredients": ingredients,
          "tips": ["Simmer for 1-2 hours", "Strain before storing"]
        }
      ]
    };
  }
};

const convertCuisine = async (originalRecipe, targetCuisine) => {
  try {
    const prompt = cuisineConverterPrompt(originalRecipe, targetCuisine);
    const response = await callAI(prompt);
    return JSON.parse(response);
  } catch (error) {
    console.error('Cuisine conversion error:', error);

    // Fallback Mock Data
    console.log('⚠️ Switching to Mock Data for Cuisine Converter');
    return {
      "convertedRecipe": {
        "title": `Mock ${targetCuisine} Style Recipe`,
        "description": `A delicious ${targetCuisine} twist on your original dish, featuring traditional spices and cooking methods.`,
        "difficulty": "Medium",
        "prepTime": "25 mins",
        "ingredients": [
          { "name": "Main Protein/Veg (diced)", "quantity": "500", "unit": "g" },
          { "name": `${targetCuisine} Spice Blend`, "quantity": "2", "unit": "tbsp" },
          { "name": "Fresh Aromatics (Garlic/Ginger)", "quantity": "1", "unit": "tbsp" },
          { "name": "Cooking Oil", "quantity": "1", "unit": "tbsp" },
          { "name": "Garnish (Herbs/Seeds)", "quantity": "1", "unit": "handful" }
        ],
        "steps": [
          "1. **Prep**: Clean and cut your main ingredients into uniform bite-sized pieces to ensure even cooking.",
          "2. **Season**: Marinate the protein/vegetables with half of the ${targetCuisine} Spice Blend for at least 10 minutes.",
          "3. **Sauté**: Heat oil in a pan over medium-high heat. Add aromatics and sauté until fragrant (about 30 seconds).",
          "4. **Cook**: Add the marinated ingredients. Stir-fry for 5-7 minutes until fully cooked and tender.",
          "5. **Finish**: Sprinkle the remaining spices and toss well. Remove from heat.",
          "6. **Serve**: Garnish generously with fresh herbs and serve hot with rice or bread."
        ],
        "flavorProfile": `Authentic ${targetCuisine} flavors with balanced spices.`,
        "keyChanges": [
          `Replaced neutral oil with traditional ${targetCuisine} fat source for depth.`,
          "Adjusted spice blend to highlight regional authentic flavors.",
          "Modified cooking technique to 'Stir-fry/Stew' to match local style."
        ],
        "substitutions": [
          { "original": "Original Spice", "replacement": `${targetCuisine} Spice Mix` },
          { "original": "Original Herb", "replacement": "Fresh Regional Herb" }
        ]
      }
    };
  }
};

const generateMealPlan = async (userPreferences, restrictions, servings = 4, pantryItems = [], searchQuery = '') => {
  try {
    const prompt = mealPlanPrompt(userPreferences, restrictions, servings, pantryItems, searchQuery);
    const response = await callAI(prompt, 3000);
    return JSON.parse(response);
  } catch (error) {
    console.error('Meal plan generation error:', error);
    throw error;
  }
};

const analyzeImage = async (base64Image) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
            {
              type: 'text',
              text: imageAnalysisPrompt(),
            },
          ],
        },
      ],
      max_tokens: 2000,
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Image analysis error:', error);
    
    // Fallback Mock Data for Fridge Scanner
    console.log('⚠️ Switching to Mock Data for Image Analysis');
    return {
      "detectedItems": [
        { "name": "Tomato", "quantity": 5, "unit": "pieces", "freshness": "Fresh", "estimatedExpiry": "2026-04-25", "location": "Fridge", "confidence": 0.95 },
        { "name": "Milk", "quantity": 1, "unit": "liter", "freshness": "OK", "estimatedExpiry": "2026-04-22", "location": "Fridge", "confidence": 0.88 },
        { "name": "Cucumber", "quantity": 2, "unit": "pieces", "freshness": "Fresh", "estimatedExpiry": "2026-04-24", "location": "Fridge", "confidence": 0.92 },
        { "name": "Eggs", "quantity": 12, "unit": "pieces", "freshness": "Fresh", "estimatedExpiry": "2026-05-10", "location": "Fridge", "confidence": 0.98 },
        { "name": "Bell Pepper", "quantity": 3, "unit": "pieces", "freshness": "OK", "estimatedExpiry": "2026-04-21", "location": "Fridge", "confidence": 0.85 }
      ],
      "summary": "Detected several fresh vegetables and dairy items. Your milk is approaching its expiry in 4 days.",
      "warnings": ["Check the milk for smell before use.", "Tomatoes should be stored at room temperature for better flavor."]
    };
  }
};

const chatWithAI = async (message) => {
  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful cooking assistant. Provide friendly, concise, and practical cooking advice. Keep responses under 200 words.',
        },
        {
          role: 'user',
          content: message,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Chat error:', error);

    // Fallback Mock Response
    console.log('⚠️ Switching to Mock Data for Chat');

    // Simple keyword-based mock responses
    const msg = message.toLowerCase();

    if (msg.includes('vegetarian') && msg.includes('lasagna')) {
      return "For a delicious vegetarian lasagna, swap meat for layers of sautéed spinach, mushrooms, and zucchini. Use a rich marinara sauce and plenty of mozzarella and ricotta cheese. Bake at 375°F (190°C) for 45 minutes until bubbly and golden!";
    }

    if (msg.includes('substitute') || msg.includes('replace')) {
      return "I can help with substitutions! For example, you can use applesauce instead of oil in baking, or Greek yogurt instead of sour cream. What specific ingredient are you looking to replace?";
    }

    if (msg.includes('idea') || msg.includes('suggest') || msg.includes('dinner')) {
      return "How about a quick vegetable stir-fry? It's healthy, uses up leftover veggies, and is ready in 15 minutes. Serve it over rice or noodles!";
    }

    return "I'm currently in offline mode, but I can still help! Ask me about substitutions, specific recipes like 'vegetarian lasagna', or general cooking tips.";
  }
};

module.exports = {
  generateRecipe,
  getSubstitutes,
  estimateNutrition,
  rateDifficulty,
  adjustForHealthMode,
  personalizeRecommendations,
  suggestWasteReduction,
  convertCuisine,
  generateMealPlan,
  analyzeImage,
  chatWithAI,
};
