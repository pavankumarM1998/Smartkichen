import React, { useState } from 'react';
import { Globe, RefreshCw, ChefHat } from 'lucide-react';
import apiService from '../services/apiService';
import { toast } from 'react-hot-toast';

export default function CuisineConverterPage() {
  const [recipe, setRecipe] = useState('');
  const [targetCuisine, setTargetCuisine] = useState('');
  const [convertedRecipe, setConvertedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);

  const cuisines = [
    'Italian', 'Mexican', 'Indian', 'Chinese', 'Japanese',
    'Thai', 'Mediterranean', 'French', 'Spanish', 'Korean',
    'Turkish', 'Greek', 'Vietnamese', 'Brazilian', 'Lebanese'
  ];

  const handleConvert = async () => {
    if (!recipe.trim() || !targetCuisine) {
      toast.error('Please enter a recipe and select a cuisine');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.convertRecipeCuisine({
        recipe: recipe,
        targetCuisine: targetCuisine
      });
      setConvertedRecipe(response.data);
      toast.success('Recipe converted successfully!');
    } catch (error) {
      toast.error('Failed to convert recipe');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setRecipe('');
    setTargetCuisine('');
    setConvertedRecipe(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-900">Cuisine Converter</h1>
          </div>
          <p className="text-lg text-gray-600">Transform any recipe into a different culinary style</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <ChefHat className="w-6 h-6 text-purple-600" />
              Original Recipe
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipe Details</label>
                <textarea
                  value={recipe}
                  onChange={(e) => setRecipe(e.target.value)}
                  placeholder="Paste your recipe here or describe the dish..."
                  className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Cuisine</label>
                <select
                  value={targetCuisine}
                  onChange={(e) => setTargetCuisine(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select a cuisine...</option>
                  {cuisines.map(cuisine => (
                    <option key={cuisine} value={cuisine}>{cuisine}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleConvert}
                  disabled={loading}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'Converting...' : 'Convert Recipe'}
                </button>
                <button
                  onClick={handleClear}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-3 px-4 rounded-lg transition"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Globe className="w-6 h-6 text-pink-600" />
              {targetCuisine ? `${targetCuisine} Style` : 'Converted Recipe'}
            </h2>

            {convertedRecipe ? (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{convertedRecipe.title}</h3>
                  <p className="text-gray-700 text-sm mb-3">{convertedRecipe.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Key Changes:</h4>
                  <ul className="space-y-2">
                    {convertedRecipe.changes?.map((change, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-purple-600 font-bold">•</span>
                        <span className="text-gray-700 text-sm">{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Ingredients to Substitute:</h4>
                  <div className="space-y-1 text-sm text-gray-700">
                    {convertedRecipe.substitutions?.map((sub, idx) => (
                      <p key={idx}>
                        <span className="text-purple-600 font-medium">{sub.original}</span>
                        {' → '}
                        <span className="text-pink-600 font-medium">{sub.replacement}</span>
                      </p>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                  <p className="text-sm text-blue-900"><strong>Difficulty:</strong> {convertedRecipe.difficulty}</p>
                  <p className="text-sm text-blue-900"><strong>Prep Time:</strong> {convertedRecipe.prepTime}</p>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-center">
                <div>
                  <Globe className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Enter a recipe and select a cuisine to see the converted version</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cuisine Tips */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Cuisine Conversion Tips</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="font-semibold text-purple-900 mb-2">🌶️ Spice Levels</p>
              <p className="text-sm text-gray-700">Different cuisines have varying spice profiles. We adjust heat and flavor intensity accordingly.</p>
            </div>
            <div className="p-4 bg-pink-50 rounded-lg">
              <p className="font-semibold text-pink-900 mb-2">🥘 Cooking Methods</p>
              <p className="text-sm text-gray-700">Techniques vary by cuisine - we suggest the best methods for your target style.</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="font-semibold text-blue-900 mb-2">🧂 Flavor Profiles</p>
              <p className="text-sm text-gray-700">We maintain the essence while adapting flavors to match regional preferences.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
