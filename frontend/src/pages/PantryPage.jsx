import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaTh, FaList, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
import apiService, { pantryService } from '../services/apiService';
import { getExpiryStatus } from '../utils/helpers';
import toast from 'react-hot-toast';

const PantryPage = () => {
  const { t } = useTranslation();
  const [pantryItems, setPantryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [formData, setFormData] = useState({
    ingredientName: '',
    quantity: '',
    unit: 'gram',
    expiryDate: '',
    storageLocation: 'fridge',
    cost: '',
  });

  useEffect(() => {
    loadPantryItems();
  }, []);

  const loadPantryItems = async () => {
    try {
      setLoading(true);
      const response = await pantryService.getPantryItems();
      let items = [];
      if (response.data && response.data.data) {
        items = Array.isArray(response.data.data) ? response.data.data : Object.values(response.data.data);
      } else if (Array.isArray(response.data)) {
        items = response.data;
      } else if (response.data && typeof response.data === 'object') {
        items = Object.values(response.data);
      }
      setPantryItems(items);
    } catch (error) {
      toast.error('Failed to load pantry items');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await pantryService.addPantryItem({
        ingredientName: formData.ingredientName,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        expiryDate: formData.expiryDate,
        storageLocation: formData.storageLocation,
        cost: formData.cost ? parseFloat(formData.cost) : null,
      });

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
    <div className="page-wide animate-page-enter h-full overflow-hidden flex flex-col !py-0">
      <div className="flex-1 flex flex-col space-y-4 min-h-0">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-4xl font-black text-[#111827] leading-tight flex items-center gap-3 tracking-tighter">My Pantry <span className="text-3xl opacity-60">📦</span></h1>
          </div>
          <p className="text-[#3a5c51] font-black uppercase tracking-[0.6em] text-[12px] opacity-50 mt-1">Track inventory & manage expiry dates</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex p-1 bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex bg-[#F9FBFA] p-1 rounded-xl border border-slate-100 shadow-sm">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[#246A48] text-white shadow-md' : 'text-[#3a5c51] hover:bg-[#246A48]/5'}`}
                >
                  <FaTh className="text-[10px]" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-[#246A48] text-white shadow-md' : 'text-[#3a5c51] hover:bg-[#246A48]/5'}`}
                >
                  <FaList className="text-[10px]" />
                </button>
              </div>
              
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className={`btn-primary px-4 py-2 flex items-center gap-2 transform transition-all active:scale-95 ${showAddForm ? 'bg-[#111827]' : ''}`}
              >
                {showAddForm ? <><FaTimes className="text-[10px]" /> Close</> : <><FaPlus className="text-[10px]" /> Add Item</>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Item Form (Expandable) */}
      {showAddForm && (
        <div className="card shadow-md border border-white/80 bg-white/70 backdrop-blur-xl p-3 animate-page-enter shrink-0">
          <h2 className="text-[10px] font-black text-[#111827] mb-2 flex items-center gap-2 uppercase tracking-widest">
             <span className="p-1 bg-[#246A48]/10 rounded text-[#246A48]"><FaPlus className="text-[8px]" /></span>
             Register New Ingredient
          </h2>
          <form onSubmit={handleAddItem} className="grid grid-cols-2 md:grid-cols-6 gap-2">
            <div className="space-y-1 col-span-2">
              <label className="label text-[9px]">Item Name</label>
              <input
                type="text"
                placeholder="e.g. Avocado, Milk"
                value={formData.ingredientName || ''}
                onChange={(e) => setFormData({ ...formData, ingredientName: e.target.value })}
                className="input-field py-1.5 text-xs"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="label text-[9px]">Quantity</label>
              <div className="flex gap-1">
                <input
                  type="number"
                  placeholder="0"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="input-field flex-1 py-1.5 text-xs"
                  required
                />
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="input-field w-1/2 py-1.5 text-xs"
                >
                  <option value="gram">g</option>
                  <option value="ml">ml</option>
                  <option value="piece">pcs</option>
                  <option value="cup">cups</option>
                  <option value="kg">kg</option>
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="label text-[9px]">Expiry Date</label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="input-field py-1.5 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="label text-[9px]">Storage</label>
              <select
                value={formData.storageLocation}
                onChange={(e) => setFormData({ ...formData, storageLocation: e.target.value })}
                className="input-field py-1.5 text-xs"
              >
                <option value="fridge">Fridge ❄️</option>
                <option value="freezer">Freezer 🧊</option>
                <option value="pantry">Pantry 🥫</option>
                <option value="counter">Counter 🧺</option>
              </select>
            </div>
            <div className="flex items-end">
              <button type="submit" className="btn-primary w-full py-2 text-[9px] font-black uppercase tracking-widest shadow-md">
                Confirm
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pr-1 scrollbar-premium min-h-0">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
          <div className="w-12 h-12 border-4 border-[#246A48]/20 border-t-[#246A48] rounded-full animate-spin" />
          <p className="font-bold text-[#3a5c51] uppercase tracking-tighter">Scanning Inventory...</p>
        </div>
      ) : pantryItems.length === 0 ? (
        <div className="card text-center py-20 bg-white/40 border-dashed border-2 flex flex-col items-center gap-4">
          <div className="text-6xl grayscale opacity-30">🥫</div>
          <p className="text-xl font-black text-slate-400 italic">Your pantry looks suspiciously empty.</p>
          <button onClick={() => setShowAddForm(true)} className="btn-ghost lowercase font-medium border-b border-[#246A48]">click here to stock up</button>
        </div>
      ) : (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
            {pantryItems.map((item, idx) => {
              const expiryStatus = getExpiryStatus(item.expiryDate);
              const isExpired = expiryStatus.status === 'expired';
              return (
                <div 
                  key={item.id} 
                  className="card-hover p-3.5 bg-white group transform transition-all animate-page-enter"
                  style={{ animationDelay: `${idx * 15}ms` }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col">
                      <div className="p-2 bg-[#F9FBFA] rounded-xl text-xl shadow-inner border border-slate-50">
                        {item.storageLocation === 'fridge' ? '❄️' : item.storageLocation === 'freezer' ? '🧊' : '🧺'}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[8px] font-black text-slate-500 uppercase tracking-widest">{item.category || 'Basic'}</span>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <FaTrash className="text-[10px]" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-black text-[#111827] group-hover:text-[#246A48] transition-colors mb-0.5 truncate capitalize">
                    {item.ingredientName || item.ingredient?.name || 'Unknown Item'}
                  </h3>

                  <div className="flex items-baseline gap-1.5 mb-3">
                    <span className="text-2xl font-black text-[#246A48] leading-none tracking-tighter tabular-nums">{item.quantity}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.unit === 'piece' ? 'Pcs' : item.unit}</span>
                  </div>

                  <div className="flex flex-col gap-2.5 py-3 border-y border-slate-50 mb-2 bg-[#F9FBFA]/20 -mx-3.5 px-3.5">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-lg bg-white shadow-sm flex items-center justify-center text-[10px] border border-slate-50">📍</div>
                        <div className="flex flex-col">
                          <span className="text-[7px] font-black text-slate-300 uppercase tracking-tighter">Location</span>
                          <span className="text-[9px] font-black uppercase text-slate-600 tracking-wide leading-none">
                            {item.storageLocation || 'Ambient'}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[7px] font-black text-slate-300 uppercase tracking-tighter mb-0.5">Freshness</span>
                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                          isExpired ? 'bg-red-500 text-white' : expiryStatus.status === 'expiring-soon' ? 'bg-amber-400 text-white' : 'bg-emerald-500 text-white'
                        }`}>
                          {expiryStatus.label}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-1.5 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        isExpired ? 'bg-red-500' : expiryStatus.status === 'expiring-soon' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: item.expiryDate ? `${Math.max(5, Math.min(100, (expiryStatus.daysLeft / 30) * 100))}%` : '100%' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card-hover p-0 overflow-hidden border border-white bg-white/60">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#F9FBFA] border-b border-slate-100">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Ingredient</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Inventory</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Location</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Expiration</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {pantryItems.map((item) => {
                    const expiryStatus = getExpiryStatus(item.expiryDate);
                    return (
                      <tr key={item.id} className="group hover:bg-white/40 transition-colors">
                        <td className="px-8 py-5 font-bold text-[#111827]">
                          {item.ingredientName || item.ingredient?.name || 'Unknown Item'}
                        </td>
                        <td className="px-8 py-5">
                          <span className="font-black text-[#246A48]">{item.quantity}</span>
                          <span className="ml-1 text-[10px] font-bold text-slate-400 uppercase">{item.unit}</span>
                        </td>
                        <td className="px-8 py-5">
                          <span className="px-3 py-1 bg-white border border-slate-100 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">
                            {item.storageLocation}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          {item.expiryDate ? (
                            <span className={`text-[10px] font-black uppercase tracking-widest ${expiryStatus.status === 'expired' ? 'text-red-500' : 'text-slate-500'}`}>
                              {expiryStatus.status === 'expired' ? 'Expired' : `${expiryStatus.daysLeft} days`}
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-slate-300 italic">No Date</span>
                          )}
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                          >
                            <FaTrash className="text-sm" />
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
     </div>
    </div>
  );
};

export default PantryPage;
