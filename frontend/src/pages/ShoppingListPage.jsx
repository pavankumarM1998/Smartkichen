import React, { useState, useEffect } from 'react';
import { shoppingService } from '../services/apiService';
import { FaPlus, FaCheckCircle, FaRegCircle, FaTrashAlt, FaShoppingBasket } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ShoppingListPage = () => {
  const [shoppingLists, setShoppingLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newListName, setNewListName] = useState('');
  const [selectedListId, setSelectedListId] = useState(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState(1);

  useEffect(() => {
    loadShoppingLists();
  }, []);

  const loadShoppingLists = async () => {
    try {
      setLoading(true);
      const response = await shoppingService.getShoppingLists();
      let lists = response.data?.data || response.data || [];
      setShoppingLists(Array.isArray(lists) ? lists : []);
    } catch (error) {
      toast.error('Failed to load lists');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateList = async () => {
    if (!newListName.trim()) return toast.error('Enter list name');
    try {
      await shoppingService.createShoppingList(newListName);
      toast.success('List created');
      setNewListName('');
      await loadShoppingLists();
    } catch (error) {
      toast.error('Failed to create');
    }
  };

  const handleAddItem = async (listId) => {
    if (!newItemName.trim()) return toast.error('Enter item');
    try {
      await shoppingService.addItemToList(listId, {
        ingredientName: newItemName.trim(),
        quantity: newItemQuantity,
        unit: 'pcs'
      });
      setNewItemName('');
      setNewItemQuantity(1);
      await loadShoppingLists();
    } catch (error) {
      toast.error('Failed to add');
    }
  };

  const handleToggleItem = async (listId, itemId) => {
    try {
      await shoppingService.markAsPurchased(listId, itemId);
      await loadShoppingLists();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const handleRemoveItem = async (listId, itemId) => {
    try {
      await shoppingService.removeListItem(listId, itemId);
      await loadShoppingLists();
    } catch (error) {
      toast.error('Failed to remove');
    }
  };

  const handleDeleteList = async (listId) => {
    if (!listId) {
      toast.error('Invalid list ID');
      return;
    }
    if (!window.confirm('Delete this entire list?')) return;
    
    // Diagnostic log
    console.log('🗑️ Deleting list ID:', listId);
    try {
      await shoppingService.deleteShoppingList(listId);
      toast.success('List deleted');
      await loadShoppingLists();
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to delete list';
      toast.error(msg);
      console.error('Delete error:', error);
    }
  };

  return (
    <div className="page-wide animate-page-enter h-full overflow-hidden flex flex-col !py-0 bg-[#F9FBFA]">
      <div className="flex-1 flex flex-col space-y-4 min-h-0 py-6">
        {/* Header */}
        <div className="flex items-center justify-between px-2 shrink-0">
          <div>
            <h1 className="text-3xl font-black text-[#111827] tracking-tighter">
              Shopping <span className="text-[#246A48]">Vault</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#246A48]/40">Inventory Management</p>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="New List Name..."
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateList()}
              className="bg-white border-2 border-[#246A48]/5 rounded-xl px-4 py-2 text-xs font-bold focus:border-[#246A48]/20 focus:ring-0 w-64 shadow-sm"
            />
            <button onClick={handleCreateList} className="bg-[#246A48] text-white p-2.5 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all">
              <FaPlus className="text-sm" />
            </button>
          </div>
        </div>

        {/* List Wise Arrangement */}
        <div className="flex-1 overflow-y-auto pr-2 scrollbar-premium space-y-4 pb-12 shadow-inner">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-30">
              <div className="w-10 h-10 border-4 border-[#246A48]/20 border-t-[#246A48] rounded-full animate-spin mb-4" />
              <p className="text-[10px] font-black uppercase tracking-widest">Loading Vault...</p>
            </div>
          ) : shoppingLists.length === 0 ? (
            <div className="text-center py-32 opacity-20">
              <FaShoppingBasket className="mx-auto text-6xl mb-4" />
              <p className="font-black uppercase tracking-widest text-sm">No Lists Found</p>
            </div>
          ) : (
            shoppingLists.map((list) => (
              <div key={list.id} className="bg-white border border-[#246A48]/5 rounded-2xl shadow-sm overflow-hidden">
                {/* List Title Bar */}
                <div className="bg-[#f0f4f2] px-6 py-4 flex items-center justify-between border-b border-[#246A48]/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#246A48]/10 text-[#246A48] flex items-center justify-center font-black text-xs">
                      {list.items?.length || 0}
                    </div>
                    <h2 className="text-lg font-black text-[#111827] tracking-tight">{list.name}</h2>
                  </div>
                  <button 
                    onClick={() => handleDeleteList(list.id)}
                    className="text-slate-300 hover:text-rose-500 transition-colors"
                  >
                    <FaTrashAlt className="text-xs" />
                  </button>
                </div>

                {/* Items in a Simple List */}
                <div className="divide-y divide-[#246A48]/5">
                  {list.items?.map((item) => (
                    <div key={item.id} className="group flex items-center justify-between px-6 py-3.5 hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <button onClick={() => handleToggleItem(list.id, item.id)} className="transition-transform active:scale-90">
                          {item.isPurchased ? 
                            <FaCheckCircle className="text-emerald-500 text-lg shadow-sm" /> : 
                            <FaRegCircle className="text-slate-200 text-lg group-hover:text-[#246A48]/20" />
                          }
                        </button>
                        <div className="flex flex-col">
                          <span className={`${item.isPurchased ? 'line-through text-slate-300 font-medium' : 'text-[#111827] font-bold'} text-sm`}>
                            {item.ingredient?.name || item.name}
                          </span>
                          <span className="text-[10px] font-black text-[#246A48] opacity-50 uppercase tracking-tighter">
                            {item.quantity} units
                          </span>
                        </div>
                      </div>
                      <button 
                         onClick={() => handleRemoveItem(list.id, item.id)}
                         className="opacity-0 group-hover:opacity-100 p-2 text-slate-200 hover:text-rose-400 transition-all"
                      >
                         <FaTrashAlt className="text-[10px]" />
                      </button>
                    </div>
                  ))}
                  
                  {/* Flat Add Row */}
                  <div className="px-6 py-3 bg-slate-50/30 flex items-center gap-3">
                    <input 
                      type="text" 
                      placeholder="Add another item..."
                      value={selectedListId === list.id ? newItemName : ''}
                      onChange={(e) => {
                        setSelectedListId(list.id);
                        setNewItemName(e.target.value);
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddItem(list.id)}
                      className="bg-transparent border-0 rounded-lg py-2 px-0 text-xs font-bold focus:ring-0 flex-1 placeholder:text-slate-300"
                    />
                    <div className="flex items-center gap-2">
                       <input 
                          type="number" 
                          className="w-12 bg-white border border-slate-100 rounded-lg py-1 text-center text-[10px] font-black focus:ring-0"
                          value={selectedListId === list.id ? newItemQuantity : 1}
                          onChange={(e) => {
                            setSelectedListId(list.id);
                            setNewItemQuantity(e.target.value);
                          }}
                       />
                       <button 
                          onClick={() => handleAddItem(list.id)}
                          className="w-8 h-8 rounded-lg bg-[#246A48]/10 text-[#246A48] flex items-center justify-center hover:bg-[#246A48] hover:text-white transition-all shadow-sm"
                       >
                          <FaPlus className="text-[10px]" />
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingListPage;
