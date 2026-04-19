import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { pantryService } from '../services/apiService';
import toast from 'react-hot-toast';
import { FaCheckSquare, FaSquare, FaMagic, FaBoxOpen, FaCalendarAlt, FaShoppingCart, FaCamera } from 'react-icons/fa';

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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good Morning', emoji: '🌅' };
    if (hour < 17) return { text: 'Good Afternoon', emoji: '☀️' };
    return { text: 'Good Evening', emoji: '🌙' };
  };
  const greeting = getGreeting();
  const firstName = user?.name?.split(' ')[0] || 'Chef';

  const quickLinks = [
    {
      path: '/pantry',
      emoji: '📦',
      label: 'My Pantry',
      sub: 'Track & manage ingredients',
      badge: 'Inventory',
      badgeColor: 'bg-emerald-100 text-[#246A48]',
      iconBg: 'bg-[#246A48]/10',
      hoverBorder: 'hover:border-[#246A48]/40',
    },
    {
      path: '/meal-planner',
      emoji: '📅',
      label: 'Weekly Planner',
      sub: 'Plan meals for the week',
      badge: 'Schedule',
      badgeColor: 'bg-violet-100 text-violet-800',
      iconBg: 'bg-violet-500/10',
      hoverBorder: 'hover:border-violet-500/40',
    },
    {
      path: '/shopping-list',
      emoji: '🛒',
      label: 'Shopping List',
      sub: 'Smart budget shopping',
      badge: 'Smart Buy',
      badgeColor: 'bg-orange-100 text-orange-800',
      iconBg: 'bg-orange-500/10',
      hoverBorder: 'hover:border-orange-500/40',
    },
    {
      path: '/fridge-scanner',
      emoji: '📸',
      label: 'Fridge Scanner',
      sub: 'AI ingredient scanner',
      badge: 'AI Vision',
      badgeColor: 'bg-cyan-100 text-cyan-800',
      iconBg: 'bg-cyan-500/10',
      hoverBorder: 'hover:border-cyan-500/40',
    },
  ];

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col gap-4 overflow-hidden pt-4 pb-2">

      {/* ── Welcome Banner ── */}
      <div className="w-full max-w-[920px] mx-auto">
        <div className="bg-gradient-to-r from-[#246A48] to-[#1f332c] relative overflow-hidden rounded-xl px-5 py-3.5 flex items-center justify-between shadow-sm">
          {/* decorative blobs */}
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 left-40 w-20 h-20 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)' }} />

          <div>
            <p className="text-emerald-50 text-[10px] font-bold uppercase tracking-[0.15em] mb-0.5">
              {greeting.emoji} {greeting.text}
            </p>
            <h1 className="text-white text-lg font-black leading-tight">
              Welcome back, <span className="text-emerald-200">{firstName}!</span>
            </h1>
            <p className="text-emerald-50/90 text-[11px] font-medium mt-0.5">
              What delicious dish will you create today? ✨
            </p>
          </div>

        {/* right: quick stats */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="text-center px-3 py-2 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
            <div className="text-white text-lg font-black">🍳</div>
            <p className="text-emerald-300 text-[9px] font-black uppercase tracking-wider mt-0.5">Cook</p>
          </div>
          <div className="text-center px-3 py-2 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
            <div className="text-white text-lg font-black">🤖</div>
            <p className="text-emerald-300 text-[9px] font-black uppercase tracking-wider mt-0.5">AI Chef</p>
          </div>
          <div className="text-center px-3 py-2 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
            <div className="text-white text-lg font-black">🥗</div>
            <p className="text-emerald-300 text-[9px] font-black uppercase tracking-wider mt-0.5">Healthy</p>
          </div>
        </div>
        </div>
      </div>

      {/* ── Main Layout: Left nav + Right recipe ── */}
      <div className="flex-1 flex justify-center gap-5 min-h-0 max-w-[920px] mx-auto w-full">

        {/* ─── Left: Navigation Cards (Single Column) ─── */}
        <div className="w-[280px] bg-white rounded-xl border border-slate-100 p-4 shadow-sm flex flex-col gap-3 min-h-0 flex-shrink-0">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Quick Access</p>
          <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-1">
            {quickLinks.map((link, i) => (
              <div
                key={i}
                onClick={() => navigate(link.path)}
                className={`group relative overflow-hidden bg-white rounded-xl border border-slate-100 cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${link.hoverBorder} animate-page-enter flex items-center p-3 gap-3 flex-1`}
              >
                
                {/* Header: Icon */}
                <div className={`w-10 h-10 rounded-xl ${link.iconBg} flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                  {link.emoji}
                </div>

                {/* Text & Badge (Horizontal Stack) */}
                <div className="flex-1 flex flex-col min-w-0 pr-1 gap-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[13px] font-black text-[#111827] leading-tight flex-shrink-0 whitespace-nowrap">{link.label}</h3>
                    <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-md ${link.badgeColor}`}>
                      {link.badge}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium leading-tight line-clamp-1">{link.sub}</p>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* ─── Right: AI Recipe Generator ─── */}
        <div className="w-[620px] max-w-full flex flex-col min-h-0 flex-shrink-0">
          <div className="flex flex-col overflow-hidden rounded-xl border border-emerald-200 bg-white h-full">

            {/* Body: Linear Stack matching requested layout including simplified title */}
            <div className="flex flex-col gap-5 p-6 flex-1 min-h-0 overflow-y-auto">

              {/* Simplified Header matching Mockup + Live badge */}
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🤖</span>
                  <h2 className="text-[22px] font-bold text-slate-800 tracking-tight">Generate Recipe</h2>
                </div>
                <div className="flex items-center gap-1.5 text-white bg-gradient-to-r from-[#246A48] to-[#1f332c] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </div>
              </div>

              <button
                onClick={handleShowPantrySelector}
                className="w-full py-2.5 rounded-xl text-[15px] flex items-center justify-center gap-2 text-white font-semibold bg-gradient-to-r from-[#246A48] to-[#1f332c] hover:opacity-90 transition-all shadow-md shadow-[#246A48]/20"
              >
                <span>📦</span> Select from Pantry
              </button>

              <div className="flex gap-3 items-center">
                <input
                  type="text"
                  placeholder="Or type ingredient manually"
                  value={ingredientInput}
                  onChange={(e) => setIngredientInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addIngredient(e)}
                  className="flex-1 border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-emerald-500 text-[14px] text-slate-700 placeholder:text-slate-400"
                />
                <button
                  onClick={addIngredient}
                  className="bg-gradient-to-r from-[#246A48] to-[#1f332c] hover:opacity-90 text-white px-5 py-2.5 rounded-xl font-semibold text-[15px] flex items-center gap-1.5 transition-all shadow-md shadow-[#246A48]/20 flex-shrink-0"
                >
                  <span className="text-emerald-400 font-bold text-lg leading-none">+</span> Add
                </button>
              </div>

              {/* Ingredients area */}
              {ingredients.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {ingredients.map((ing, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-md text-[13px] font-medium">
                      {ing}
                      <button onClick={() => removeIngredient(idx)} className="text-emerald-400 hover:text-emerald-600 font-bold ml-1 text-sm leading-none">×</button>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <label className="block text-[14px] text-slate-700 mb-2">Health Mode:</label>
                <select
                  value={healthMode}
                  onChange={(e) => setHealthMode(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:border-emerald-500 bg-white text-[14px] text-slate-700 cursor-pointer"
                >
                  {healthModes.map((mode) => (
                    <option key={mode.value} value={mode.value}>{mode.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[14px] text-slate-700 mb-2">Servings:</label>
                <input
                  type="number" min="1" max="10" value={servings}
                  onChange={(e) => setServings(parseInt(e.target.value))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:border-emerald-500 text-[14px] text-slate-700"
                />
              </div>

              <div className="mt-2 text-center">
                <button
                  onClick={handleGenerateRecipe}
                  disabled={ingredients.length === 0}
                  className={`w-full py-3.5 rounded-xl flex items-center justify-center gap-2 text-white font-bold text-[16px] transition-all duration-300 ${
                    ingredients.length === 0
                      ? 'bg-slate-300 cursor-not-allowed opacity-60'
                      : 'bg-gradient-to-r from-[#246A48] to-[#1f332c] hover:-translate-y-0.5 hover:shadow-xl shadow-lg shadow-[#246A48]/30'
                  }`}
                >
                  <span>✨</span> Generate Recipe
                </button>
                <p className="text-[13px] text-slate-500 mt-4">
                  Add at least 1 ingredient to generate recipes
                </p>
              </div>

            </div>
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
                        className="text-xs px-2 py-1 border border-[#3e6b41] text-[#3e6b41] rounded-xl hover:bg-emerald-50 transition-all font-bold"
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
                              <FaCheckSquare className="text-[#3e6b41]" />
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
