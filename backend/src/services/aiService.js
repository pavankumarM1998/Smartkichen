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
    throw error;
  }
};

const convertCuisine = async (originalRecipe, targetCuisine) => {
  try {
    const prompt = cuisineConverterPrompt(originalRecipe, targetCuisine);
    const response = await callAI(prompt);
    return JSON.parse(response);
  } catch (error) {
    console.error('Cuisine conversion error:', error);
    throw error;
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
    // If using GPT-4 Vision
    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
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
    throw error;
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
    throw new Error('Failed to chat with AI: ' + error.message);
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
