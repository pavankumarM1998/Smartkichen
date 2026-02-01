import React, { useState, useEffect } from 'react';
import { Leaf, TrendingDown, AlertCircle } from 'lucide-react';
import apiService from '../services/apiService';
import { toast } from 'react-hot-toast';

export default function WasteReductionPage() {
  const [ingredients, setIngredients] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  useEffect(() => {
    fetchPantryItems();
  }, []);

  const fetchPantryItems = async () => {
    try {
      const response = await apiService.getPantry();
      setIngredients(response.data);
    } catch (error) {
      toast.error('Failed to load pantry items');
    }
  };

  const getWasteSuggestions = async () => {
    if (selectedIngredients.length === 0) {
      toast.error('Please select ingredients');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.getWasteReductionSuggestions({
        ingredients: selectedIngredients
      });
      setSuggestions(response.data.suggestions);
      toast.success('Waste reduction suggestions generated!');
    } catch (error) {
      toast.error('Failed to generate suggestions');
    } finally {
      setLoading(false);
    }
  };

  const toggleIngredient = (id) => {
    setSelectedIngredients(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Leaf className="w-8 h-8 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-900">Waste Reduction</h1>
          </div>
          <p className="text-lg text-gray-600">Smart suggestions to use ingredients before they expire</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Ingredient Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                Expiring Soon
              </h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {ingredients.map(item => (
                  <label key={item.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedIngredients.includes(item.id)}
                      onChange={() => toggleIngredient(item.id)}
                      className="w-4 h-4 text-green-600 rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        Expires: {new Date(item.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
              <button
                onClick={getWasteSuggestions}
                disabled={loading}
                className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Analyzing...' : 'Get Suggestions'}
              </button>
            </div>
          </div>

          {/* Suggestions */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {suggestions.length > 0 ? (
                suggestions.map((suggestion, idx) => (
                  <div key={idx} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{suggestion.title}</h3>
                    <p className="text-gray-700 mb-3">{suggestion.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 rounded p-3">
                        <p className="text-xs text-green-600 font-semibold">Ingredients to Use</p>
                        <ul className="mt-2 text-sm text-gray-700">
                          {suggestion.ingredients?.map((ing, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                              {ing}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-amber-50 rounded p-3">
                        <p className="text-xs text-amber-600 font-semibold">Storage Tips</p>
                        <ul className="mt-2 text-sm text-gray-700">
                          {suggestion.tips?.map((tip, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-green-700 text-sm font-medium">
                      <TrendingDown className="w-4 h-4" />
                      Saves ~{suggestion.wastePercentage}% food waste
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <Leaf className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Select ingredients and click "Get Suggestions" to see waste reduction tips</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Leaf className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-gray-900">0kg</p>
            <p className="text-gray-600 text-sm">Food Saved This Month</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <TrendingDown className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-gray-900">0%</p>
            <p className="text-gray-600 text-sm">Waste Reduction Rate</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <AlertCircle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-gray-900">{ingredients.length}</p>
            <p className="text-gray-600 text-sm">Items to Use</p>
          </div>
        </div>
      </div>
    </div>
  );
}
