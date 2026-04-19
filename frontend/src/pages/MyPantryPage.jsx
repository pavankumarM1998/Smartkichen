import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaPlus, FaTrash, FaTimes, FaUtensils, FaCheckSquare, FaSquare } from 'react-icons/fa';
import apiService, { pantryService } from '../services/apiService';

const MyPantryPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [pantryItems, setPantryItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [healthMode, setHealthMode] = useState('Normal');
    const [servings, setServings] = useState(4);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Load pantry items on mount
    useEffect(() => {
        loadPantryItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadPantryItems = async () => {
        try {
            setLoading(true);
            const response = await pantryService.getPantryItems();
            console.log('MyPantry API response:', response);
            console.log('response.data:', response.data);

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

            setPantryItems(Array.isArray(items) ? items : []);
            // Select all items by default
            if (Array.isArray(items) && items.length > 0) {
                setSelectedItems(new Set(items.map(item => item.id)));
            }
            setError('');
        } catch (err) {
            console.error('Error loading pantry:', err);
            setError(t('myPantry.errorLoadingPantry') || 'Failed to load pantry items');
            setPantryItems([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddIngredient = async () => {
        if (!searchQuery.trim()) {
            setError(t('myPantry.pleaseEnterIngredient') || 'Please enter an ingredient name');
            return;
        }

        try {
            await pantryService.addPantryItem({
                ingredientName: searchQuery.trim(),
                quantity: 1,
                unit: 'piece'
            });

            setSearchQuery('');
            setSuccess(t('myPantry.ingredientAdded') || 'Ingredient added to pantry!');
            setTimeout(() => setSuccess(''), 3000);
            await loadPantryItems();
        } catch (err) {
            console.error('Error adding ingredient:', err);
            setError(t('myPantry.errorAddingIngredient') || 'Failed to add ingredient');
        }
    };

    const handleRemoveIngredient = async (itemId) => {
        try {
            await pantryService.deletePantryItem(itemId);
            setSuccess(t('myPantry.ingredientRemoved') || 'Ingredient removed from pantry');
            setTimeout(() => setSuccess(''), 3000);
            // Remove from selected items
            setSelectedItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(itemId);
                return newSet;
            });
            await loadPantryItems();
        } catch (err) {
            console.error('Error removing ingredient:', err);
            setError(t('myPantry.errorRemovingIngredient') || 'Failed to remove ingredient');
        }
    };

    const handleClearPantry = async () => {
        if (!window.confirm(t('myPantry.confirmClearPantry') || 'Are you sure you want to clear your entire pantry?')) {
            return;
        }

        try {
            for (const item of pantryItems) {
                await pantryService.deletePantryItem(item.id);
            }

            setSuccess(t('myPantry.pantryClearedSuccess') || 'Pantry cleared successfully!');
            setTimeout(() => setSuccess(''), 3000);
            setSelectedItems(new Set());
            await loadPantryItems();
        } catch (err) {
            console.error('Error clearing pantry:', err);
            setError(t('myPantry.errorClearingPantry') || 'Failed to clear pantry');
        }
    };

    const toggleItemSelection = (itemId) => {
        setSelectedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
    };

    const selectAll = () => {
        setSelectedItems(new Set(pantryItems.map(item => item.id)));
    };

    const deselectAll = () => {
        setSelectedItems(new Set());
    };

    const handleGenerateRecipe = async () => {
        if (selectedItems.size === 0) {
            setError(t('myPantry.pleaseSelectIngredients') || 'Please select at least one ingredient!');
            return;
        }

        try {
            setGenerating(true);
            setError('');

            // Get selected ingredient names
            const selectedIngredients = pantryItems
                .filter(item => selectedItems.has(item.id))
                .map(item => item.ingredientName || item.name);

            // Call recipe generation API directly with selected ingredients
            const response = await apiService.post('/recipes/generate', {
                ingredients: selectedIngredients,
                healthMode,
                servings,
                language: localStorage.getItem('language') || 'en'
            });

            // Navigate to recipe results page with the already generated recipe
            navigate('/recipe-results', {
                state: {
                    recipe: response.data.data, // Backend returns data in .data field
                    ingredients: selectedIngredients,
                    healthMode,
                    servings,
                    fromPantry: true
                }
            });
        } catch (err) {
            console.error('Error generating recipe:', err);
            setError(t('myPantry.errorGeneratingRecipe') || 'Failed to generate recipe from pantry');
        } finally {
            setGenerating(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleAddIngredient();
        }
    };

    return (
        <div className="animate-page-enter space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="text-left">
                    <h1 className="text-4xl font-black text-[#111827] leading-tight mb-1 tracking-tighter">
                        🍳 Cook from <span className="text-[#246A48]">Pantry</span>
                    </h1>
                    <p className="text-[#3a5c51] font-black uppercase tracking-[0.6em] text-[12px] opacity-50 mt-1">
                        Select ingredients and let AI suggest a meal.
                    </p>
                </div>
            </div>

                {/* Error/Success Messages */}
                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex justify-between items-center">
                        <span>{error}</span>
                        <button onClick={() => setError('')} className="text-red-700 hover:text-red-900">
                            <FaTimes />
                        </button>
                    </div>
                )}
                {success && (
                    <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex justify-between items-center">
                        <span>{success}</span>
                        <button onClick={() => setSuccess('')} className="text-green-700 hover:text-green-900">
                            <FaTimes />
                        </button>
                    </div>
                )}

                {/* Add Ingredient Section */}
                <div className="card shadow-lg p-4 bg-white/80">
                    <h2 className="text-sm font-black text-[#111827] mb-3 flex items-center gap-2">
                         <span className="p-1.5 bg-emerald-50 text-[#246A48] rounded-lg text-xs">✏️</span>
                        {t('myPantry.addIngredients') || 'Add Ingredients'}
                    </h2>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            className="input-field flex-1"
                            placeholder={t('myPantry.typeIngredientName') || 'Type ingredient name (e.g., Rice, Eggs, Chicken)'}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <button
                            onClick={handleAddIngredient}
                            className="btn-primary whitespace-nowrap px-6 py-2 text-[10px]"
                        >
                            <FaPlus className="mr-1" />
                            {t('myPantry.add') || 'Add'}
                        </button>
                    </div>
                </div>

                {/* Pantry Items Section */}
                <div className="card shadow-xl overflow-hidden">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                        <div>
                            <h2 className="text-xl font-bold text-[#111827]">
                                {t('myPantry.pantryItems') || 'Your Ingredients'} 
                                <span className="ml-2 text-sm font-bold text-slate-400">({pantryItems.length})</span>
                            </h2>
                            {selectedItems.size > 0 && (
                                <p className="text-xs font-black uppercase tracking-widest text-[#246A48] mt-1">
                                    {selectedItems.size} selected for cooking
                                </p>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                             <button
                                onClick={selectAll}
                                className="px-3 py-1.5 text-xs font-bold border-2 border-emerald-50 text-[#246A48] rounded-xl hover:bg-emerald-50 transition-all uppercase tracking-tight"
                            >
                                Select All
                            </button>
                            <button
                                onClick={deselectAll}
                                className="px-3 py-1.5 text-xs font-bold border-2 border-slate-50 text-slate-500 rounded-xl hover:bg-slate-50 transition-all uppercase tracking-tight"
                            >
                                Deselect All
                            </button>
                            <button
                                onClick={handleClearPantry}
                                className="px-3 py-1.5 text-xs font-bold border-2 border-red-50 text-red-500 rounded-xl hover:bg-red-50 flex items-center gap-2 transition-all uppercase tracking-tight"
                            >
                                <FaTrash />
                                Clear
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                        </div>
                    ) : pantryItems.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <p>{t('myPantry.pantryEmpty') || 'Your pantry is empty. Add ingredients to get started!'}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {Array.isArray(pantryItems) && pantryItems.map((item) => (
                                <div
                                    key={item.id}
                                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer group ${selectedItems.has(item.id)
                                        ? 'bg-[#F5F8F6] border-[#246A48]/20 shadow-sm'
                                        : 'bg-white border-slate-100 hover:border-[#246A48]/10'
                                        }`}
                                    onClick={() => toggleItemSelection(item.id)}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="flex-shrink-0">
                                            {selectedItems.has(item.id) ? (
                                                <div className="w-5 h-5 rounded-md bg-[#246A48] flex items-center justify-center text-[10px] text-white">
                                                    ✓
                                                </div>
                                            ) : (
                                                <div className="w-5 h-5 rounded-md border-2 border-slate-200" />
                                            )}
                                        </div>
                                        <span className={`font-bold text-sm truncate ${selectedItems.has(item.id) ? 'text-[#246A48]' : 'text-[#111827]'}`}>
                                            {item.ingredientName || item.name || 'Unknown Item'}
                                        </span>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveIngredient(item.id);
                                        }}
                                        className="text-red-400 hover:text-red-600 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <FaTrash size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recipe Generation Section */}
                {pantryItems.length > 0 && (
                    <div className="card shadow-2xl border-t-4 border-t-[#246A48] bg-white">
                        <div className="flex items-center gap-3 mb-6">
                             <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#246A48] flex items-center justify-center text-xl shadow-sm">
                                🥣
                             </div>
                             <div>
                                <h2 className="text-xl font-black text-[#111827]">
                                    {t('myPantry.generateRecipe') || 'Ready to Cook?'}
                                </h2>
                                <p className="text-[10px] font-bold text-[#3a5c51] uppercase tracking-[0.2em] opacity-80">Recipe Configuration</p>
                             </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Health Mode */}
                            <div>
                                <label className="label">
                                    {t('myPantry.healthMode') || 'Dietary Goal'}
                                </label>
                                <select
                                    value={healthMode}
                                    onChange={(e) => setHealthMode(e.target.value)}
                                    className="input-field"
                                >
                                    <option value="Normal">{t('myPantry.normal') || 'Balanced'}</option>
                                    <option value="Keto">{t('myPantry.keto') || 'Keto'}</option>
                                    <option value="Diabetic">{t('myPantry.diabetic') || 'Blood Sugar Control'}</option>
                                    <option value="HighProtein">{t('myPantry.highProtein') || 'High Protein'}</option>
                                    <option value="WeightLoss">{t('myPantry.weightLoss') || 'Weight Loss'}</option>
                                </select>
                            </div>

                            {/* Servings */}
                            <div>
                                <label className="label">
                                    {t('myPantry.servings') || 'Portion Size'}
                                </label>
                                <div className="relative">
                                    <select
                                        value={servings}
                                        onChange={(e) => setServings(Number(e.target.value))}
                                        className="input-field appearance-none"
                                    >
                                        <option value={1}>1 Person</option>
                                        <option value={2}>2 People</option>
                                        <option value={4}>4 People</option>
                                        <option value={6}>6 People</option>
                                        <option value={8}>8 People</option>
                                    </select>
                                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-slate-400 pointer-events-none">People</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleGenerateRecipe}
                            disabled={generating || selectedItems.size === 0}
                            className="btn-primary w-full py-2.5 text-xs font-bold flex items-center justify-center gap-4 group uppercase tracking-widest"
                        >
                            {generating ? (
                                <>
                                    <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                    {t('myPantry.generatingRecipe') || 'CRAFTING RECIPE...'}
                                </>
                            ) : (
                                <>
                                    <span className="group-hover:rotate-12 transition-transform">🍳</span>
                                    {t('myPantry.generateFromPantry') || `CREATE MEAL FROM ${selectedItems.size} ITEMS`}
                                    <span className="group-hover:-rotate-12 transition-transform">🍳</span>
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        );
    };

export default MyPantryPage;
