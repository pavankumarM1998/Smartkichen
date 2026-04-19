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
      const response = await apiService.getPantryItems();

      // Handle different response structures (Robust Logic from MyPantryPage)
      let items = [];

      // Check if response.data.data exists (nested data property)
      if (response.data && response.data.data) {
        items = Array.isArray(response.data.data) ? response.data.data : Object.values(response.data.data);
      }
      // Check if response.data is directly an array
      else if (Array.isArray(response.data)) {
        items = response.data;
      }
      // Check if response.data has an items property
      else if (response.data && Array.isArray(response.data.items)) {
        items = response.data.items;
      }
      // Check if response.data is an object (convert to array)
      else if (response.data && typeof response.data === 'object') {
        items = Object.values(response.data);
      }

      setIngredients(Array.isArray(items) ? items : []);
    } catch (error) {
      console.error('Error loading pantry items:', error);
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
      // Map selected IDs to ingredient names
      const ingredientsToSend = ingredients
        .filter(item => selectedIngredients.includes(item.id))
        .map(item => item.ingredientName || item.name);

      const response = await apiService.getWasteReductionSuggestions({
        ingredients: ingredientsToSend
      });
      setSuggestions(response.data.data.suggestions || []);
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
    <div className="page-wide animate-page-enter h-full overflow-hidden flex flex-col !py-0">
      <div className="flex-1 flex flex-col space-y-4 min-h-0">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-black text-[#111827] leading-tight mb-1 tracking-tighter">
            Waste <span className="text-[#246A48]">Reduction</span> 🌱
          </h1>
          <p className="text-[#3a5c51] font-bold uppercase tracking-[0.4em] text-[11px] opacity-60">
            Smart suggestions to use ingredients before they expire
          </p>
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
                      <p className="font-medium text-gray-900">{item.ingredientName || item.name || 'Unknown Item'}</p>
                      <p className="text-xs text-gray-500">
                        Expires: {item.expiryDate && !isNaN(new Date(item.expiryDate).getTime()) 
                          ? new Date(item.expiryDate).toLocaleDateString() 
                          : 'No date set'}
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
          <div className="lg:col-span-2 overflow-y-auto pr-1 scrollbar-premium h-full min-h-0">
            <div className="space-y-3">
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

        {/* Stats (Integrated) */}
        <div className="mt-auto grid grid-cols-1 md:grid-cols-3 gap-3 shrink-0">
          <div className="bg-white/50 rounded-xl p-4 border border-slate-100 flex items-center gap-4">
            <Leaf className="w-6 h-6 text-green-600" />
            <div>
              <p className="text-xl font-bold text-gray-900">0kg</p>
              <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest leading-none">Food Saved</p>
            </div>
          </div>
          <div className="bg-white/50 rounded-xl p-4 border border-slate-100 flex items-center gap-4">
            <TrendingDown className="w-6 h-6 text-blue-600" />
            <div>
              <p className="text-xl font-bold text-gray-900">0%</p>
              <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest leading-none">Reduction Rate</p>
            </div>
          </div>
          <div className="bg-white/50 rounded-xl p-4 border border-slate-100 flex items-center gap-4">
            <AlertCircle className="w-6 h-6 text-amber-600" />
            <div>
              <p className="text-xl font-bold text-gray-900">{ingredients.length}</p>
              <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest leading-none">Items to Use</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
