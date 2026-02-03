import React, { useState, useEffect } from 'react';
import { shoppingService } from '../services/apiService';
import toast from 'react-hot-toast';

const ShoppingListPage = () => {
  const [shoppingLists, setShoppingLists] = useState([]);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [selectedList, setSelectedList] = useState(null);
  const [newListName, setNewListName] = useState('');

  useEffect(() => {
    loadShoppingLists();
  }, []);

  const loadShoppingLists = async () => {
    try {
      setLoading(true);
      const response = await shoppingService.getShoppingLists();
      console.log('Shopping API response:', response);

      let lists = [];
      if (response.data && response.data.data) {
        lists = response.data.data;
      } else if (Array.isArray(response.data)) {
        lists = response.data;
      } else if (response.data && Array.isArray(response.data.items)) {
        lists = response.data.items;
      }

      console.log('Extracted shopping lists:', lists);
      setShoppingLists(Array.isArray(lists) ? lists : []);
    } catch (error) {
      console.error('Error loading shopping lists:', error);
      toast.error('Failed to load shopping lists');
      setShoppingLists([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateList = async () => {
    if (!newListName.trim()) {
      toast.error('Please enter a list name');
      return;
    }
    try {
      await shoppingService.createShoppingList(newListName);
      toast.success('Shopping list created');
      setNewListName('');
      loadShoppingLists();
    } catch (error) {
      toast.error('Failed to create list');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">🛒 Shopping Lists</h1>

      {/* Create New List */}
      <div className="card mb-8">
        <h2 className="font-bold text-lg mb-4">Create New List</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="List name (e.g., Weekly Groceries)"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            className="input-field flex-1"
          />
          <button onClick={handleCreateList} className="btn-primary">
            ➕ Create
          </button>
        </div>
      </div>

      {/* Shopping Lists */}
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : shoppingLists.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600">No shopping lists yet</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {Array.isArray(shoppingLists) && shoppingLists.map((list) => (
            <div key={list.id} className="card">
              <h3 className="font-bold text-lg mb-4">{list.name}</h3>
              <p className="text-sm text-gray-600 mb-4">
                {list.items?.length || 0} items
              </p>
              <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
                {list.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                  >
                    <input
                      type="checkbox"
                      defaultChecked={item.isPurchased}
                      className="w-4 h-4"
                    />
                    <span
                      className={item.isPurchased ? 'line-through text-gray-400' : ''}
                    >
                      {item.ingredient?.name} ({item.quantity} {item.unit})
                    </span>
                  </div>
                ))}
              </div>
              <button onClick={() => setSelectedList(list)} className="btn-outline w-full">
                Edit List
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShoppingListPage;
