import React, { useState } from 'react';
import { Zap, TrendingDown, Clock, Users } from 'lucide-react';
import apiService from '../services/apiService';
import { toast } from 'react-hot-toast';

export default function DifficultyRatingPage() {
  const [recipe, setRecipe] = useState('');
  const [ratingResult, setRatingResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adjustedRecipe, setAdjustedRecipe] = useState(null);
  const [targetLevel, setTargetLevel] = useState('');

  const difficultyLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const handleRateRecipe = async () => {
    if (!recipe.trim()) {
      toast.error('Please enter a recipe');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.rateDifficulty({
        recipe: recipe
      });
      setRatingResult(response.data);
      setTargetLevel('');
      setAdjustedRecipe(null);
      toast.success('Difficulty rated!');
    } catch (error) {
      toast.error('Failed to rate recipe difficulty');
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustDifficulty = async () => {
    if (!targetLevel) {
      toast.error('Please select a target difficulty level');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.adjustDifficulty({
        recipe: recipe,
        targetLevel: targetLevel
      });
      setAdjustedRecipe(response.data);
      toast.success('Recipe adjusted!');
    } catch (error) {
      toast.error('Failed to adjust recipe');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (level) => {
    switch(level) {
      case 'Beginner': return 'bg-green-100 text-green-800 border-green-300';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Advanced': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Expert': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyBars = (level) => {
    const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
    return levels.indexOf(level) + 1;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-8 h-8 text-orange-600" />
            <h1 className="text-4xl font-bold text-gray-900">Difficulty Rating</h1>
          </div>
          <p className="text-lg text-gray-600">Get accurate difficulty ratings and skill-level adjustments for any recipe</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-600" />
                Rate a Recipe
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recipe</label>
                  <textarea
                    value={recipe}
                    onChange={(e) => setRecipe(e.target.value)}
                    placeholder="Paste your recipe or describe the dish..."
                    className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  />
                </div>

                <button
                  onClick={handleRateRecipe}
                  disabled={loading}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50"
                >
                  {loading ? 'Rating...' : 'Rate Difficulty'}
                </button>
              </div>
            </div>
          </div>

          {/* Rating Result */}
          <div className="lg:col-span-2">
            {ratingResult ? (
              <div className="space-y-4">
                {/* Difficulty Level */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-4">Difficulty Assessment</h3>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div>
                      <p className={`inline-block px-4 py-2 rounded-lg font-bold text-lg border-2 ${getDifficultyColor(ratingResult.level)}`}>
                        {ratingResult.level}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-8 rounded ${
                            i < getDifficultyBars(ratingResult.level)
                              ? 'bg-orange-500'
                              : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{ratingResult.explanation}</p>

                  {/* Difficulty Factors */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-xs text-blue-600 font-semibold">Prep Time</p>
                      <p className="text-sm text-gray-900 font-medium">{ratingResult.prepTime}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded">
                      <p className="text-xs text-purple-600 font-semibold">Technique Complexity</p>
                      <p className="text-sm text-gray-900 font-medium">{ratingResult.techniqueDifficulty}</p>
                    </div>
                    <div className="bg-pink-50 p-3 rounded">
                      <p className="text-xs text-pink-600 font-semibold">Ingredient Count</p>
                      <p className="text-sm text-gray-900 font-medium">{ratingResult.ingredientCount} items</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <p className="text-xs text-green-600 font-semibold">Cooking Steps</p>
                      <p className="text-sm text-gray-900 font-medium">{ratingResult.stepCount} steps</p>
                    </div>
                  </div>
                </div>

                {/* Difficulty Factors */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">What Makes This Recipe Challenging?</h4>
                  <ul className="space-y-2">
                    {ratingResult.factors?.map((factor, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-orange-500 font-bold mt-1">!</span>
                        <span className="text-gray-700 text-sm">{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Adjust Difficulty */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Adjust for Your Skill Level</h4>
                  <div className="space-y-3">
                    <select
                      value={targetLevel}
                      onChange={(e) => setTargetLevel(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Select target level...</option>
                      {difficultyLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                    <button
                      onClick={handleAdjustDifficulty}
                      disabled={!targetLevel || loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
                    >
                      {loading ? 'Adjusting...' : 'Get Adjusted Recipe'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Zap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Enter a recipe and click "Rate Difficulty" to see detailed assessment</p>
              </div>
            )}
          </div>
        </div>

        {/* Adjusted Recipe */}
        {adjustedRecipe && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-green-600" />
              Adjusted Recipe for {targetLevel}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Simplifications:</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  {adjustedRecipe.simplifications?.map((s, i) => (
                    <li key={i}>✓ {s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Equipment Alternatives:</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  {adjustedRecipe.equipmentAlternatives?.map((e, i) => (
                    <li key={i}>• {e}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-green-50 rounded border-l-4 border-green-500">
              <p className="text-sm text-green-900"><strong>New Estimate:</strong> {adjustedRecipe.newDifficultyLevel}</p>
              <p className="text-sm text-green-900"><strong>Estimated Time:</strong> {adjustedRecipe.estimatedTime}</p>
            </div>
          </div>
        )}

        {/* Skills Guide */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Difficulty Levels Explained</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {difficultyLevels.map((level, idx) => (
              <div key={level} className={`p-4 rounded-lg border-2 ${getDifficultyColor(level)}`}>
                <p className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-lg">{'⭐'.repeat(idx + 1)}</span>
                  {level}
                </p>
                <p className="text-sm">
                  {level === 'Beginner' && 'Simple recipes with basic techniques, minimal prep.'}
                  {level === 'Intermediate' && 'Recipes with some techniques, moderate prep and timing.'}
                  {level === 'Advanced' && 'Complex techniques, precise timing, multiple steps.'}
                  {level === 'Expert' && 'Advanced skills, precise techniques, restaurant-quality results.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
