import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaPlus, FaTrash, FaTimes, FaUtensils, FaCheckSquare, FaSquare } from 'react-icons/fa';
import { pantryService } from '../services/apiService';

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
            const token = localStorage.getItem('token');
            const response = await fetch('/api/pantry/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ingredientName: searchQuery.trim(),
                    quantity: 1,
                    unit: 'piece'
                })
            });

            if (!response.ok) throw new Error('Failed to add ingredient');

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
            const token = localStorage.getItem('token');
            const response = await fetch('/api/recipes/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ingredients: selectedIngredients,
                    healthMode,
                    servings,
                    language: localStorage.getItem('language') || 'en'
                })
            });

            if (!response.ok) throw new Error('Failed to generate recipe');

            const data = await response.json();

            // Navigate to recipe results page
            navigate('/recipe-results', {
                state: {
                    recipe: data.recipe,
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
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <h1 className="text-4xl font-bold text-green-600 mb-8">
                    {t('myPantry.title') || '🍳 Cook from Pantry'}
                </h1>

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
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">
                        {t('myPantry.addIngredients') || 'Add Ingredients'}
                    </h2>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder={t('myPantry.typeIngredientName') || 'Type ingredient name (e.g., Rice, Eggs, Chicken)'}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <button
                            onClick={handleAddIngredient}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
                        >
                            <FaPlus />
                            {t('myPantry.add') || 'Add'}
                        </button>
                    </div>
                </div>

                {/* Pantry Items Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">
                            {t('myPantry.pantryItems') || 'Your Ingredients'} ({pantryItems.length})
                            {selectedItems.size > 0 && (
                                <span className="ml-2 text-sm text-green-600">
                                    ({selectedItems.size} selected)
                                </span>
                            )}
                        </h2>
                        <div className="flex gap-2">
                            {pantryItems.length > 0 && (
                                <>
                                    <button
                                        onClick={selectAll}
                                        className="px-3 py-1 text-sm border border-green-500 text-green-600 rounded hover:bg-green-50 transition-colors"
                                    >
                                        Select All
                                    </button>
                                    <button
                                        onClick={deselectAll}
                                        className="px-3 py-1 text-sm border border-gray-400 text-gray-600 rounded hover:bg-gray-50 transition-colors"
                                    >
                                        Deselect All
                                    </button>
                                    <button
                                        onClick={handleClearPantry}
                                        className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 flex items-center gap-2 transition-colors"
                                    >
                                        <FaTrash />
                                        {t('myPantry.clearAll') || 'Clear All'}
                                    </button>
                                </>
                            )}
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
                        <div className="space-y-2">
                            {Array.isArray(pantryItems) && pantryItems.map((item) => (
                                <div
                                    key={item.id}
                                    className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all cursor-pointer ${selectedItems.has(item.id)
                                        ? 'bg-green-50 border-green-400'
                                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                                        }`}
                                    onClick={() => toggleItemSelection(item.id)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl">
                                            {selectedItems.has(item.id) ? (
                                                <FaCheckSquare className="text-green-600" />
                                            ) : (
                                                <FaSquare className="text-gray-400" />
                                            )}
                                        </div>
                                        <span className="font-medium text-lg">
                                            {item.ingredientName || item.name || 'Unknown Item'}
                                        </span>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveIngredient(item.id);
                                        }}
                                        className="text-red-500 hover:text-red-700 p-2 transition-colors"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recipe Generation Section */}
                {pantryItems.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            {t('myPantry.generateRecipe') || 'Generate Recipe'}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {/* Health Mode */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('myPantry.healthMode') || 'Health Mode'}
                                </label>
                                <select
                                    value={healthMode}
                                    onChange={(e) => setHealthMode(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="Normal">{t('myPantry.normal') || 'Normal'}</option>
                                    <option value="Keto">{t('myPantry.keto') || 'Keto'}</option>
                                    <option value="Diabetic">{t('myPantry.diabetic') || 'Diabetic'}</option>
                                    <option value="HighProtein">{t('myPantry.highProtein') || 'High Protein'}</option>
                                    <option value="WeightLoss">{t('myPantry.weightLoss') || 'Weight Loss'}</option>
                                </select>
                            </div>

                            {/* Servings */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('myPantry.servings') || 'Servings'}
                                </label>
                                <select
                                    value={servings}
                                    onChange={(e) => setServings(Number(e.target.value))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value={1}>1 {t('myPantry.person') || 'Person'}</option>
                                    <option value={2}>2 {t('myPantry.people') || 'People'}</option>
                                    <option value={4}>4 {t('myPantry.people') || 'People'}</option>
                                    <option value={6}>6 {t('myPantry.people') || 'People'}</option>
                                    <option value={8}>8 {t('myPantry.people') || 'People'}</option>
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={handleGenerateRecipe}
                            disabled={generating || selectedItems.size === 0}
                            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg font-semibold transition-colors"
                        >
                            {generating ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    {t('myPantry.generatingRecipe') || 'Generating Recipe...'}
                                </>
                            ) : (
                                <>
                                    <FaUtensils />
                                    {t('myPantry.generateFromPantry') || '🍳 Generate Recipe from Selected Ingredients'} ({selectedItems.size})
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyPantryPage;
