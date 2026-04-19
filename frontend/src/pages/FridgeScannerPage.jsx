import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';
import toast from 'react-hot-toast';
import { FaCheckSquare, FaSquare, FaCamera, FaBoxOpen, FaMagic, FaArrowRight, FaRedo } from 'react-icons/fa';

const FridgeScannerPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [addingToPantry, setAddingToPantry] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [selectedItems, setSelectedItems] = useState(new Set());

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target?.result);
      reader.readAsDataURL(file);
    }
  };

  const handleScanFridge = async () => {
    if (!selectedFile) {
      toast.error('Please select an image first');
      return;
    }

    setLoading(true);
    try {
      // AutoAdd set to false because we want user to confirm selection
      const response = await apiService.scanFridge(selectedFile, false);
      const data = response.data?.data;
      
      if (data && data.detectedItems) {
        setAnalysisResult(data);
        // Select all detected items by default
        const itemIndices = data.detectedItems?.map((_, idx) => idx) || [];
        setSelectedItems(new Set(itemIndices));
        toast.success('Successfully analyzed your kitchen!');
      } else {
        throw new Error('No items detected');
      }
    } catch (error) {
      console.error('Scan error:', error);
      toast.error(error.response?.data?.message || 'Failed to scan image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleItemSelection = (index) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    const allIndices = analysisResult?.detectedItems?.map((_, idx) => idx) || [];
    setSelectedItems(new Set(allIndices));
  };

  const deselectAll = () => {
    setSelectedItems(new Set());
  };

  const handleAddToPantry = async () => {
    if (selectedItems.size === 0) {
      toast.error('Please select at least one item');
      return;
    }

    setAddingToPantry(true);
    let successCount = 0;
    try {
      const itemsToAdd = Array.from(selectedItems).map(idx => analysisResult.detectedItems[idx]);
      
      for (const item of itemsToAdd) {
        try {
          // Using apiService instead of relative fetch for reliability
          await apiService.addPantryItem(
            null, // ingredientId (null because we're using name)
            item.quantity || 1,
            item.unit || 'pieces',
            item.estimatedExpiry || null,
            item.location || 'Fridge',
            null, // cost
            item.name // passing name as the last optional arg if supported, 
                      // or we rely on the backend to handle ingredientName in body
          );
          
          // Actually, our apiService.addPantryItem takes (ingredientId, quantity, unit, expiryDate, storageLocation, cost)
          // But our backend controller also checks for ingredientName in req.body.
          // Let's modify the call to match what the backend expects:
          await apiService.post('/pantry/add', {
            ingredientName: item.name,
            quantity: parseFloat(item.quantity) || 1,
            unit: item.unit || 'pieces',
            expiryDate: item.estimatedExpiry,
            storageLocation: item.location
          });
          
          successCount++;
        } catch (err) {
          console.error(`Failed to add ${item.name}:`, err);
        }
      }

      if (successCount > 0) {
        toast.success(`✅ Added ${successCount} items to your pantry!`);
        setSelectedItems(new Set());
        // Show option to go to pantry
      } else {
        toast.error('Failed to add items to pantry');
      }
    } catch (error) {
      toast.error('An error occurred while adding items');
    } finally {
      setAddingToPantry(false);
    }
  };

  return (
    <div className="page-wide animate-page-enter h-full overflow-hidden flex flex-col !py-0">
      <div className="flex flex-col md:flex-row justify-between items-end mb-4 gap-6 shrink-0">
        <div>
          <h1 className="text-4xl font-black text-[#111827] leading-tight mb-1 tracking-tighter">
            Fridge <span className="text-[#246A48]">Scanner</span> 📸
          </h1>
          <p className="text-[#3a5c51] font-bold uppercase tracking-[0.4em] text-[11px] opacity-60">
            AI-powered photo identification for your virtual pantry
          </p>
        </div>
        
        {analysisResult && (
          <button 
            onClick={() => navigate('/my-pantry')}
            className="btn-secondary group"
          >
            <FaBoxOpen className="text-[#3e6b41] group-hover:scale-110 transition-transform" />
            View Pantry
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-12 gap-8 flex-1 min-h-0">
        {/* Upload Column */}
        <div className="lg:col-span-4 space-y-4 flex flex-col min-h-0 overflow-y-auto pr-2 scrollbar-premium">
          <div className="card border-none bg-white shadow-xl p-6 border-t-4 border-[#246A48]">
            <h2 className="text-lg font-black text-[#111827] mb-4 tracking-tight">
              Step 1: <span className="text-[#246A48]">Upload Photo</span>
            </h2>

            {previewUrl ? (
              <div className="relative group overflow-hidden rounded-[1.5rem] shadow-inner bg-slate-100">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      setAnalysisResult(null);
                      setSelectedItems(new Set());
                    }}
                    className="bg-white/90 backdrop-blur px-4 py-2 rounded-xl font-bold text-red-600 flex items-center gap-2 shadow-lg hover:bg-white transition-colors"
                  >
                    <FaRedo /> Change Image
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-64 border-4 border-dashed border-[#d1fae5] bg-white rounded-[2rem] cursor-pointer hover:border-[#3e6b41] hover:bg-[#fdfcf6] transition-all group">
                <div className="text-center p-6">
                  <div className="w-20 h-20 bg-[#ecfdf5] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <FaCamera className="text-3xl text-[#3e6b41]" />
                  </div>
                  <p className="text-lg font-bold text-[#1f332c]">Take or Upload Photo</p>
                  <p className="text-sm text-slate-500 mt-2">Best for: Refrigerator shelves, fruit bowls, or pantry stocks.</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            )}

            <button
              onClick={handleScanFridge}
              disabled={!selectedFile || loading}
              className={`btn-primary w-full mt-10 py-5 text-lg font-black tracking-widest ${loading ? 'opacity-80' : ''}`}
            >
              {loading ? (
                <>
                  <div className="spinner w-5 h-5 border-white !border-t-transparent mr-2" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <FaMagic /> Scan My Fridge
                </>
              )}
            </button>
          </div>
          
          {/* Quick Tip Card */}
          <div className="bg-[#1f332c] text-white p-4 rounded-2xl shadow-lg relative overflow-hidden group mt-auto">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <FaMagic className="text-4xl rotate-12" />
            </div>
            <h3 className="text-sm font-bold mb-1">AI Vision Tip</h3>
            <p className="text-emerald-100/80 text-[10px] leading-tight">
              Ensure good lighting and avoid overlapping items for 99% accuracy!
            </p>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7">
          {analysisResult ? (
            <div className="space-y-6 animate-page-enter">
              <div className="card border-none">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#1f332c]">
                      Step 2: Detect & Add
                    </h3>
                    <p className="text-sm text-slate-500 font-medium">
                      {selectedItems.size} items selected for pantry
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={selectAll}
                      className="text-xs font-bold px-3 py-1.5 bg-emerald-50 text-[#3e6b41] rounded-lg hover:bg-emerald-100 transition-colors"
                    >
                      Select All
                    </button>
                    <button
                      onClick={deselectAll}
                      className="text-xs font-bold px-3 py-1.5 bg-slate-50 text-slate-500 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-premium">
                  {analysisResult.detectedItems?.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => toggleItemSelection(idx)}
                      className={`group p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                        selectedItems.has(idx)
                          ? 'bg-[#ecfdf5]/50 border-[#3e6b41] shadow-md'
                          : 'bg-white border-slate-100 hover:border-[#d1fae5] hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                          selectedItems.has(idx) ? 'bg-[#3e6b41] text-white' : 'bg-slate-50 text-slate-300'
                        }`}>
                          {selectedItems.has(idx) ? <FaCheckSquare /> : <FaSquare />}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <h4 className="font-bold text-[#1f332c] group-hover:text-[#3e6b41] transition-colors">
                              {item.name}
                            </h4>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                              {Math.round(item.confidence * 100)}% Match
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm text-slate-500 font-medium">
                              {item.quantity} {item.unit}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                              item.freshness === 'Fresh' ? 'bg-emerald-100 text-emerald-700' :
                              item.freshness === 'OK' ? 'bg-amber-100 text-amber-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {item.freshness}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleAddToPantry}
                  disabled={selectedItems.size === 0 || addingToPantry}
                  className="btn-primary w-full mt-8 py-4 shadow-2xl disabled:opacity-50 flex items-center justify-center gap-3 text-base"
                >
                  {addingToPantry ? (
                    'Adding to your pantry...'
                  ) : (
                    <>
                      <FaBoxOpen /> Add Items to Pantry ({selectedItems.size})
                    </>
                  )}
                </button>
              </div>

              {analysisResult.summary && (
                <div className="p-6 bg-[#fdfcf6] border border-[#e2ece6] rounded-[2rem] flex gap-4 items-start shadow-sm">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
                    <FaMagic className="text-[#gold || #3e6b41]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1f332c] text-sm uppercase tracking-wider mb-1">AI Insights</h4>
                    <p className="text-slate-600 text-sm italic leading-relaxed">
                      "{analysisResult.summary}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-20 bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[3rem] text-center p-10">
              <div className="relative mb-8">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-xl">
                  <FaBoxOpen className="text-5xl text-slate-200" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg animate-bounce-subtle">
                  <FaArrowRight className="text-emerald-500" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-[#111827] mb-3 tracking-tight">Awaiting Your Photo</h3>
              <p className="text-[#3a5c51] max-w-sm font-bold uppercase tracking-widest text-[11px] opacity-50 leading-relaxed">
                Upload an image on the left, and our AI will automatically detect all your ingredients here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FridgeScannerPage;

