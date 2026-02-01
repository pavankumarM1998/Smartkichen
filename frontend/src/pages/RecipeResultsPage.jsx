import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { recipeService } from '../services/apiService';
import RecipeCard from '../components/RecipeCard';
import toast from 'react-hot-toast';

const RecipeResultsPage = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipeLanguage, setRecipeLanguage] = useState('en'); // Language for recipes only

  const { ingredients, healthMode, servings } = location.state || {
    ingredients: [],
    healthMode: 'Normal',
    servings: 4,
  };

  useEffect(() => {
    generateRecipes();
  }, [recipeLanguage]); // Regenerate when language changes

  const generateRecipes = async () => {
    setLoading(true);
    console.log('🔍 Generating recipe with language:', recipeLanguage);
    try {
      console.log('📤 API Request:', { ingredients, healthMode, servings, language: recipeLanguage });
      const response = await recipeService.generateRecipe(ingredients, healthMode, servings, recipeLanguage);
      console.log('📥 API Response - Recipe Title:', response.data.data.title);
      console.log('📥 First Ingredient:', response.data.data.ingredients?.[0]);
      console.log('📥 First Step:', response.data.data.steps?.[0]?.instruction);
      setRecipes([response.data.data]);
      setSelectedRecipe(response.data.data);
      toast.success('Recipe generated!');
    } catch (error) {
      toast.error('Failed to generate recipe');
      console.error('❌ Recipe generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🤖</div>
          <p className="text-xl font-semibold">Generating recipe...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">🍳 Recipe Results</h1>
            <p className="text-gray-600">
              Generated from: <span className="font-semibold">{ingredients.join(', ')}</span>
            </p>
            {healthMode !== 'Normal' && (
              <p className="text-sm text-green-600">✓ Adjusted for {healthMode} diet</p>
            )}
          </div>

          {/* Language Switcher for Recipes */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Recipe Language:</span>
            <button
              onClick={() => setRecipeLanguage(recipeLanguage === 'en' ? 'te' : 'en')}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium transition-colors"
            >
              {recipeLanguage === 'en' ? '🇮🇳 తెలుగు' : '🇬🇧 English'}
            </button>
          </div>
        </div>
      </div>

      {recipes.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 text-lg">No recipes found. Try different ingredients!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Recipe List */}
          <div className="md:col-span-1">
            <h2 className="font-semibold text-lg mb-4">Recipes</h2>
            <div className="space-y-3">
              {recipes.map((recipe, idx) => (
                <div
                  key={idx}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedRecipe?.id === recipe.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                    }`}
                  onClick={() => setSelectedRecipe(recipe)}
                >
                  <p className="font-semibold">{recipe.title}</p>
                  <p className="text-xs text-gray-600 mt-1">⏱️ {recipe.prepTime + recipe.cookTime} min</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recipe Details */}
          <div className="md:col-span-2">
            {selectedRecipe && (
              <div className="space-y-6">
                {/* Header */}
                <div className="card border-l-4 border-green-500">
                  <h2 className="text-2xl font-bold mb-2">{selectedRecipe.title}</h2>
                  {selectedRecipe.description && (
                    <p className="text-gray-600 mb-4">{selectedRecipe.description}</p>
                  )}

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-xs text-gray-600">Prep Time</p>
                      <p className="font-bold text-blue-600">{selectedRecipe.prepTime} min</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded">
                      <p className="text-xs text-gray-600">Cook Time</p>
                      <p className="font-bold text-purple-600">{selectedRecipe.cookTime} min</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <p className="text-xs text-gray-600">Difficulty</p>
                      <p className="font-bold text-green-600">{selectedRecipe.difficulty}</p>
                    </div>
                  </div>
                </div>

                {/* Ingredients */}
                <div className="card">
                  <h3 className="font-bold text-lg mb-4">📝 Ingredients ({servings} servings)</h3>
                  <ul className="space-y-2">
                    {selectedRecipe.ingredients?.map((ing, idx) => (
                      <li key={idx} className="flex justify-between p-2 bg-gray-50 rounded">
                        <span>{ing.ingredient?.name || ing.name}</span>
                        <span className="font-semibold">{ing.quantity} {ing.unit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Steps */}
                <div className="card">
                  <h3 className="font-bold text-lg mb-4">👨‍🍳 Instructions</h3>
                  <ol className="space-y-4">
                    {selectedRecipe.steps?.map((step, idx) => (
                      <li key={idx} className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                          {step.stepNumber}
                        </span>
                        <div className="flex-1">
                          <p>{step.instruction}</p>
                          {step.duration && <p className="text-sm text-gray-600 mt-1">⏱️ {step.duration} min</p>}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Nutrition */}
                {selectedRecipe.nutritionInfo && (
                  <div className="card">
                    <h3 className="font-bold text-lg mb-4">🥗 Nutrition per Serving</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      <div className="bg-blue-50 p-3 rounded text-center">
                        <p className="text-xs text-gray-600">Calories</p>
                        <p className="font-bold text-lg">{Math.round(selectedRecipe.nutritionInfo.caloriesPerServing)}</p>
                      </div>
                      <div className="bg-red-50 p-3 rounded text-center">
                        <p className="text-xs text-gray-600">Protein</p>
                        <p className="font-bold text-lg">{selectedRecipe.nutritionInfo.proteinPerServing.toFixed(1)}g</p>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded text-center">
                        <p className="text-xs text-gray-600">Fat</p>
                        <p className="font-bold text-lg">{selectedRecipe.nutritionInfo.fatsPerServing.toFixed(1)}g</p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded text-center">
                        <p className="text-xs text-gray-600">Carbs</p>
                        <p className="font-bold text-lg">{selectedRecipe.nutritionInfo.carbsPerServing.toFixed(1)}g</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded text-center">
                        <p className="text-xs text-gray-600">Fiber</p>
                        <p className="font-bold text-lg">{(selectedRecipe.nutritionInfo.fiberPerServing || 0).toFixed(1)}g</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Waste Savings */}
                {selectedRecipe.wasteSavings && (
                  <div className="card bg-blue-50 border-l-4 border-blue-500">
                    <h3 className="font-bold text-lg mb-2">♻️ Waste Reduction Tips</h3>
                    <p className="text-gray-700">{selectedRecipe.wasteSavings}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeResultsPage;
