import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { pantryService } from '../services/apiService';
import toast from 'react-hot-toast';
import { FaCheckSquare, FaSquare } from 'react-icons/fa';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ingredients, setIngredients] = useState([]);
  const [ingredientInput, setIngredientInput] = useState('');
  const [healthMode, setHealthMode] = useState('Normal');
  const [servings, setServings] = useState(4);
  const [showPantrySelector, setShowPantrySelector] = useState(false);
  const [pantryItems, setPantryItems] = useState([]);
  const [selectedPantryItems, setSelectedPantryItems] = useState(new Set());
  const [loadingPantry, setLoadingPantry] = useState(false);

  const healthModes = [
    { value: 'Normal', label: 'Balanced' },
    { value: 'Keto', label: '🥑 Keto' },
    { value: 'Diabetic', label: '🩺 Diabetic-Friendly' },
    { value: 'HighProtein', label: '💪 High Protein' },
    { value: 'WeightLoss', label: '⚖️ Weight Loss' },
  ];

  const loadPantryItems = async () => {
    setLoadingPantry(true);
    try {
      const response = await pantryService.getPantryItems();
      console.log('Full API response:', response);
      console.log('response.data:', response.data);
      console.log('response.data type:', typeof response.data);

      // Handle different response structures
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

      console.log('Extracted items:', items);
      console.log('Items count:', items.length);
      if (items.length > 0) {
        console.log('First item:', items[0]);
        console.log('First item keys:', Object.keys(items[0]));
      }

      setPantryItems(items);
      // Select all by default
      if (items.length > 0) {
        setSelectedPantryItems(new Set(items.map((_, idx) => idx)));
      }
    } catch (error) {
      console.error('Error loading pantry:', error);
      toast.error('Failed to load pantry items');
      setPantryItems([]);
    } finally {
      setLoadingPantry(false);
    }
  };

  const handleShowPantrySelector = () => {
    setShowPantrySelector(true);
    loadPantryItems();
  };

  const togglePantryItem = (index) => {
    setSelectedPantryItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const selectAllPantry = () => {
    if (Array.isArray(pantryItems)) {
      setSelectedPantryItems(new Set(pantryItems.map((_, idx) => idx)));
    }
  };

  const deselectAllPantry = () => {
    setSelectedPantryItems(new Set());
  };

  const addSelectedFromPantry = () => {
    if (!Array.isArray(pantryItems)) {
      toast.error('Invalid pantry data');
      return;
    }

    const selectedIngredients = pantryItems
      .filter((_, idx) => selectedPantryItems.has(idx))
      .map(item => item.ingredientName || item.name);

    // Add to ingredients list (avoid duplicates)
    const newIngredients = [...new Set([...ingredients, ...selectedIngredients])];
    setIngredients(newIngredients);
    setShowPantrySelector(false);
    toast.success(`Added ${selectedIngredients.length} ingredient(s)`);
  };

  const addIngredient = (e) => {
    e.preventDefault();
    if (ingredientInput.trim()) {
      setIngredients([...ingredients, ingredientInput.trim()]);
      setIngredientInput('');
    }
  };

  const removeIngredient = (idx) => {
    setIngredients(ingredients.filter((_, i) => i !== idx));
  };

  const handleGenerateRecipe = () => {
    if (ingredients.length === 0) {
      toast.error('Add at least one ingredient');
      return;
    }

    navigate('/recipe-results', {
      state: {
        ingredients,
        healthMode,
        servings,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Feature Cards */}
          <div className="space-y-4">
            <div className="card-hover" onClick={() => navigate('/pantry')}>
              <div className="text-3xl mb-2">📦</div>
              <h3 className="font-semibold text-lg">My Pantry</h3>
              <p className="text-sm text-gray-600">Manage your ingredients & track expiry</p>
            </div>

            <div className="card-hover" onClick={() => navigate('/meal-planner')}>
              <div className="text-3xl mb-2">📅</div>
              <h3 className="font-semibold text-lg">Weekly Planner</h3>
              <p className="text-sm text-gray-600">Plan meals for the week ahead</p>
            </div>

            <div className="card-hover" onClick={() => navigate('/shopping-list')}>
              <div className="text-3xl mb-2">🛒</div>
              <h3 className="font-semibold text-lg">Shopping List</h3>
              <p className="text-sm text-gray-600">Smart shopping with cost estimates</p>
            </div>

            <div className="card-hover" onClick={() => navigate('/fridge-scanner')}>
              <div className="text-3xl mb-2">📱</div>
              <h3 className="font-semibold text-lg">Fridge Scanner</h3>
              <p className="text-sm text-gray-600">Scan & auto-add ingredients</p>
            </div>
          </div>

          {/* Right: Recipe Generator */}
          <div className="card border-2 border-green-200 p-6">
            <h2 className="text-2xl font-bold mb-6">🤖 Generate Recipe</h2>

            {/* Ingredients Input */}
            <div className="mb-6">
              <div className="flex gap-2 mb-3">
                <button
                  onClick={handleShowPantrySelector}
                  className="btn-outline flex-1"
                >
                  📦 Select from Pantry
                </button>
              </div>

              <form onSubmit={addIngredient} className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Or type ingredient manually"
                  value={ingredientInput}
                  onChange={(e) => setIngredientInput(e.target.value)}
                  className="input-field flex-1"
                />
                <button type="submit" className="btn-primary">
                  ➕ Add
                </button>
              </form>

              {ingredients.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {ingredients.map((ing, idx) => (
                    <div
                      key={idx}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {ing}
                      <button
                        onClick={() => removeIngredient(idx)}
                        className="hover:text-green-900 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Health Mode */}
            <div className="mb-6">
              <label className="label">Health Mode:</label>
              <select
                value={healthMode}
                onChange={(e) => setHealthMode(e.target.value)}
                className="input-field"
              >
                {healthModes.map((mode) => (
                  <option key={mode.value} value={mode.value}>
                    {mode.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Servings */}
            <div className="mb-6">
              <label className="label">Servings:</label>
              <input
                type="number"
                min="1"
                max="10"
                value={servings}
                onChange={(e) => setServings(parseInt(e.target.value))}
                className="input-field"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateRecipe}
              disabled={ingredients.length === 0}
              className="btn-primary w-full py-3 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ✨ Generate Recipe
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Add at least 1 ingredient to generate recipes
            </p>
          </div>
        </div>
      </div>

      {/* Pantry Selector Modal */}
      {showPantrySelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Select from Pantry</h3>
                <button
                  onClick={() => setShowPantrySelector(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {loadingPantry ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
              ) : pantryItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Your pantry is empty!</p>
                  <button
                    onClick={() => {
                      setShowPantrySelector(false);
                      navigate('/my-pantry');
                    }}
                    className="btn-primary mt-4"
                  >
                    Go to My Pantry
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-gray-600">
                      {pantryItems.length} items ({selectedPantryItems.size} selected)
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={selectAllPantry}
                        className="text-xs px-2 py-1 border border-green-500 text-green-600 rounded hover:bg-green-50"
                      >
                        Select All
                      </button>
                      <button
                        onClick={deselectAllPantry}
                        className="text-xs px-2 py-1 border border-gray-400 text-gray-600 rounded hover:bg-gray-50"
                      >
                        Deselect All
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {Array.isArray(pantryItems) && pantryItems.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => togglePantryItem(idx)}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${selectedPantryItems.has(idx)
                          ? 'bg-green-50 border-green-400'
                          : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-xl">
                            {selectedPantryItems.has(idx) ? (
                              <FaCheckSquare className="text-green-600" />
                            ) : (
                              <FaSquare className="text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <span className="font-medium">
                              {item.ingredientName || item.name || item.ingredient || item.itemName || `Item ${idx + 1}`}
                            </span>
                            {item.quantity && item.unit && (
                              <span className="text-sm text-gray-600 ml-2">
                                ({item.quantity} {item.unit})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="p-6 border-t">
              <button
                onClick={addSelectedFromPantry}
                disabled={selectedPantryItems.size === 0}
                className="btn-primary w-full py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Selected ({selectedPantryItems.size})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
