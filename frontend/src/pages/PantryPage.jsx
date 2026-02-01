import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaTh, FaList, FaTrash } from 'react-icons/fa';
import { pantryService } from '../services/apiService';
import { getExpiryStatus } from '../utils/helpers';
import toast from 'react-hot-toast';

const PantryPage = () => {
  const { t } = useTranslation();
  const [pantryItems, setPantryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [formData, setFormData] = useState({
    ingredientName: '',
    quantity: '',
    unit: 'gram',
    expiryDate: '',
    storageLocation: 'fridge',
    cost: '',
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadPantryItems();
  }, []);

  const loadPantryItems = async () => {
    try {
      setLoading(true);
      const response = await pantryService.getPantryItems();
      console.log('Pantry API response:', response);

      // Handle different response structures
      let items = [];
      if (response.data && response.data.data) {
        items = Array.isArray(response.data.data) ? response.data.data : Object.values(response.data.data);
      } else if (Array.isArray(response.data)) {
        items = response.data;
      } else if (response.data && typeof response.data === 'object') {
        items = Object.values(response.data);
      }

      console.log('Extracted pantry items:', items);
      setPantryItems(items);
    } catch (error) {
      console.error('Error loading pantry:', error);
      toast.error('Failed to load pantry items');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      // Send ingredientName directly to backend - it will create the ingredient if needed
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/pantry/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ingredientName: formData.ingredientName,
          quantity: parseFloat(formData.quantity),
          unit: formData.unit,
          expiryDate: formData.expiryDate,
          storageLocation: formData.storageLocation,
          cost: formData.cost ? parseFloat(formData.cost) : null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add item');
      }

      toast.success('Item added to pantry');
      setFormData({
        ingredientName: '',
        quantity: '',
        unit: 'gram',
        expiryDate: '',
        storageLocation: 'fridge',
        cost: '',
      });
      setShowAddForm(false);
      loadPantryItems();
    } catch (error) {
      toast.error('Failed to add item');
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await pantryService.deletePantryItem(id);
      toast.success('Item removed');
      loadPantryItems();
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">📦 Manage Pantry</h1>
          <p className="text-gray-600">Track your ingredients and manage expiry dates</p>
        </div>
        <div className="flex gap-3 items-center">
          {/* View Mode Toggle */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 flex items-center gap-2 transition-colors ${viewMode === 'grid'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
            >
              <FaTh />
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 flex items-center gap-2 transition-colors ${viewMode === 'list'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
            >
              <FaList />
              List
            </button>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-primary"
          >
            ➕ Add Item
          </button>
        </div>
      </div>

      {/* Add Item Form */}
      {showAddForm && (
        <div className="card mb-8 border-l-4 border-green-500">
          <h2 className="font-bold text-lg mb-4">Add Item to Pantry</h2>
          <form onSubmit={handleAddItem} className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Ingredient Name (e.g., Chicken, Rice)"
              value={formData.ingredientName || ''}
              onChange={(e) => setFormData({ ...formData, ingredientName: e.target.value })}
              className="input-field"
              required
            />
            <input
              type="number"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className="input-field"
              required
            />
            <select
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="input-field"
            >
              <option value="gram">Grams</option>
              <option value="ml">Milliliters</option>
              <option value="piece">Pieces</option>
              <option value="cup">Cups</option>
              <option value="tbsp">Tablespoons</option>
              <option value="tsp">Teaspoons</option>
            </select>

            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              className="input-field"
            />
            <select
              value={formData.storageLocation}
              onChange={(e) => setFormData({ ...formData, storageLocation: e.target.value })}
              className="input-field"
            >
              <option value="fridge">Fridge</option>
              <option value="freezer">Freezer</option>
              <option value="pantry">Pantry</option>
              <option value="counter">Counter</option>
            </select>
            <input
              type="number"
              placeholder="Cost (optional)"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              className="input-field"
              step="0.01"
            />

            <div className="md:col-span-3 flex gap-4">
              <button type="submit" className="btn-primary">
                ✓ Add Item
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="btn-outline"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Items List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading pantry items...</p>
        </div>
      ) : pantryItems.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 text-lg">Your pantry is empty</p>
          <p className="text-gray-500 mt-2">Add items to get started</p>
        </div>
      ) : (
        viewMode === 'grid' ? (
          // Grid View
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pantryItems.map((item) => {
              const expiryStatus = getExpiryStatus(item.expiryDate);
              return (
                <div key={item.id} className="card">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold flex-1">{item.ingredientName || item.ingredient?.name || 'Unknown Item'}</h3>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-red-500 hover:text-red-700 text-xl"
                    >
                      🗑️
                    </button>
                  </div>

                  <div className="space-y-2 text-sm mb-3">
                    <p>
                      <span className="text-gray-600">Quantity:</span>
                      <span className="font-semibold ml-2">
                        {item.quantity} {item.unit}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-600">Location:</span>
                      <span className="font-semibold ml-2">{item.storageLocation}</span>
                    </p>
                    {item.cost && (
                      <p>
                        <span className="text-gray-600">Cost:</span>
                        <span className="font-semibold ml-2">${item.cost.toFixed(2)}</span>
                      </p>
                    )}
                  </div>

                  {item.expiryDate && (
                    <div
                      className={`px-3 py-2 rounded text-sm font-medium bg-${expiryStatus.color}-100 text-${expiryStatus.color}-800`}
                    >
                      📅 {expiryStatus.status === 'expired' ? '❌ Expired' : `${expiryStatus.daysLeft} days left`}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          // List View
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ingredient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pantryItems.map((item) => {
                    const expiryStatus = getExpiryStatus(item.expiryDate);
                    return (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.ingredientName || item.ingredient?.name || 'Unknown Item'}</div>
                          {item.cost && <div className="text-sm text-gray-500">${item.cost.toFixed(2)}</div>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{item.quantity} {item.unit}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {item.storageLocation}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.expiryDate ? (
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${expiryStatus.color}-100 text-${expiryStatus.color}-800`}>
                              {expiryStatus.status === 'expired' ? 'Expired' : `${expiryStatus.daysLeft} days`}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-500">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default PantryPage;
