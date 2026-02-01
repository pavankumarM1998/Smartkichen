import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { aiService, pantryService } from '../services/apiService';
import toast from 'react-hot-toast';
import { FaCheckSquare, FaSquare } from 'react-icons/fa';

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
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target?.result);
      reader.readAsDataURL(file);
    }
  };

  const handleScanFridge = async () => {
    if (!selectedFile) {
      toast.error('Please select an image');
      return;
    }

    setLoading(true);
    try {
      const response = await aiService.scanFridge(selectedFile, true);
      setAnalysisResult(response.data.data);
      // Select all detected items by default
      const itemIndices = response.data.data.detectedItems?.map((_, idx) => idx) || [];
      setSelectedItems(new Set(itemIndices));
      toast.success('Fridge scanned successfully!');
    } catch (error) {
      toast.error('Failed to scan fridge');
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
    const allIndices = analysisResult.detectedItems?.map((_, idx) => idx) || [];
    setSelectedItems(new Set(allIndices));
  };

  const deselectAll = () => {
    setSelectedItems(new Set());
  };

  const handleAddToPantry = async () => {
    if (selectedItems.size === 0) {
      toast.error('Please select at least one item to add');
      return;
    }

    setAddingToPantry(true);
    try {
      const token = localStorage.getItem('token');
      let successCount = 0;
      let errorCount = 0;

      // Add each selected item to pantry
      for (const index of selectedItems) {
        const item = analysisResult.detectedItems[index];
        try {
          await fetch('/api/pantry/add', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              ingredientName: item.name,
              quantity: parseFloat(item.quantity) || 1,
              unit: item.unit || 'piece'
            })
          });
          successCount++;
        } catch (err) {
          console.error(`Failed to add ${item.name}:`, err);
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`✅ Added ${successCount} item(s) to pantry!`);
        // Clear selection after successful add
        setSelectedItems(new Set());
      }
      if (errorCount > 0) {
        toast.error(`❌ Failed to add ${errorCount} item(s)`);
      }
    } catch (error) {
      toast.error('Failed to add items to pantry');
    } finally {
      setAddingToPantry(false);
    }
  };

  const handleGoToPantry = () => {
    navigate('/my-pantry');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">📱 Fridge Scanner</h1>
      <p className="text-gray-600 mb-8">
        Take a photo of your fridge or pantry to auto-detect and add ingredients
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="card border-2 border-dashed border-green-300 p-8">
          <h2 className="font-bold text-lg mb-6">Upload Image</h2>

          {previewUrl ? (
            <div className="mb-6">
              <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  setAnalysisResult(null);
                  setSelectedItems(new Set());
                }}
                className="btn-outline w-full mt-4"
              >
                ✕ Change Image
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="text-center">
                <div className="text-4xl mb-2">📸</div>
                <p className="font-medium">Click to upload</p>
                <p className="text-sm text-gray-600">PNG, JPG, or WEBP (Max 5MB)</p>
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
            className="btn-primary w-full mt-6 disabled:opacity-50"
          >
            {loading ? '⏳ Scanning...' : '🔍 Scan Fridge'}
          </button>
        </div>

        {/* Results Section */}
        <div>
          {analysisResult ? (
            <div className="space-y-4">
              <div className="card">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">
                    ✅ Detected Items ({analysisResult.detectedItems?.length || 0})
                    {selectedItems.size > 0 && (
                      <span className="ml-2 text-sm text-green-600">
                        ({selectedItems.size} selected)
                      </span>
                    )}
                  </h3>
                  {analysisResult.detectedItems?.length > 0 && (
                    <div className="flex gap-2">
                      <button
                        onClick={selectAll}
                        className="text-xs px-2 py-1 border border-green-500 text-green-600 rounded hover:bg-green-50"
                      >
                        Select All
                      </button>
                      <button
                        onClick={deselectAll}
                        className="text-xs px-2 py-1 border border-gray-400 text-gray-600 rounded hover:bg-gray-50"
                      >
                        Deselect All
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {analysisResult.detectedItems?.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => toggleItemSelection(idx)}
                      className={`p-3 rounded border-2 cursor-pointer transition-all ${selectedItems.has(idx)
                          ? 'bg-green-50 border-green-400'
                          : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-xl mt-1">
                          {selectedItems.has(idx) ? (
                            <FaCheckSquare className="text-green-600" />
                          ) : (
                            <FaSquare className="text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold">{item.name}</p>
                              <p className="text-sm text-gray-600">
                                {item.quantity} {item.unit}
                              </p>
                              <p
                                className={`text-xs font-semibold mt-1 ${item.freshness === 'Fresh'
                                    ? 'text-green-600'
                                    : item.freshness === 'OK'
                                      ? 'text-yellow-600'
                                      : 'text-red-600'
                                  }`}
                              >
                                {item.freshness}
                              </p>
                            </div>
                            <span className="text-xs bg-white px-2 py-1 rounded border">
                              {Math.round(item.confidence * 100)}% confident
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add to Pantry Button */}
                {analysisResult.detectedItems?.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <button
                      onClick={handleAddToPantry}
                      disabled={selectedItems.size === 0 || addingToPantry}
                      className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold transition-colors"
                    >
                      {addingToPantry
                        ? '⏳ Adding to Pantry...'
                        : `📦 Add Selected to Pantry (${selectedItems.size})`}
                    </button>
                    <button
                      onClick={handleGoToPantry}
                      className="w-full px-4 py-2 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 font-semibold transition-colors"
                    >
                      🍳 Go to My Pantry
                    </button>
                  </div>
                )}
              </div>

              {analysisResult.warnings && analysisResult.warnings.length > 0 && (
                <div className="card bg-orange-50 border border-orange-200">
                  <h3 className="font-bold text-lg mb-2">⚠️ Warnings</h3>
                  <ul className="text-sm space-y-1">
                    {analysisResult.warnings.map((warning, idx) => (
                      <li key={idx} className="text-orange-700">
                        • {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="text-sm text-gray-600 bg-blue-50 p-4 rounded">
                ℹ️ {analysisResult.summary}
              </p>
            </div>
          ) : (
            <div className="card text-center py-12">
              <p className="text-gray-600">Scan an image to see detected ingredients</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FridgeScannerPage;
