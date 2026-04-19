import React, { useState } from 'react';
import { Zap, TrendingDown, Clock, Users } from 'lucide-react';
import apiService from '../services/apiService';
import { toast } from 'react-hot-toast';

export default function DifficultyRatingPage() {
  const [recipe, setRecipe] = useState('');
  const [ratingResult, setRatingResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adjustedRecipe, setAdjustedRecipe] = useState(null);
  const [targetLevel, setTargetLevel] = useState('');

  const difficultyLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const handleRateRecipe = async () => {
    if (!recipe.trim()) {
      toast.error('Please enter a recipe');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.rateDifficulty({
        recipe: recipe
      });
      setRatingResult(response.data);
      setTargetLevel('');
      setAdjustedRecipe(null);
      toast.success('Difficulty rated!');
    } catch (error) {
      toast.error('Failed to rate recipe difficulty');
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustDifficulty = async () => {
    if (!targetLevel) {
      toast.error('Please select a target difficulty level');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.adjustDifficulty({
        recipe: recipe,
        targetLevel: targetLevel
      });
      setAdjustedRecipe(response.data);
      toast.success('Recipe adjusted!');
    } catch (error) {
      toast.error('Failed to adjust recipe');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (level) => {
    switch(level) {
      case 'Beginner': return 'bg-green-100 text-green-800 border-green-300';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Advanced': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Expert': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyBars = (level) => {
    const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
    return levels.indexOf(level) + 1;
  };

  return (
    <div className="page-wide animate-page-enter h-full overflow-hidden flex flex-col !py-0">
      <div className="flex-1 flex flex-col space-y-4 min-h-0">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-black text-[#111827] leading-tight mb-1 tracking-tighter">
            Difficulty <span className="text-[#246A48]">Rating</span> ⚡
          </h1>
          <p className="text-[#3a5c51] font-bold uppercase tracking-[0.4em] text-[11px] opacity-60">
            Get accurate difficulty ratings and skill-level adjustments for any recipe
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-600" />
                Rate a Recipe
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="label py-1">Recipe Content</label>
                  <textarea
                    value={recipe}
                    onChange={(e) => setRecipe(e.target.value)}
                    placeholder="Paste your recipe or describe the dish..."
                    className="w-full h-24 p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-sm"
                  />
                </div>

                <button
                  onClick={handleRateRecipe}
                  disabled={loading}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50"
                >
                  {loading ? 'Rating...' : 'Rate Difficulty'}
                </button>
              </div>
            </div>
          </div>

          {/* Rating Result */}
          <div className="lg:col-span-2 overflow-y-auto pr-1 scrollbar-premium h-full min-h-0">
            {ratingResult ? (
              <div className="space-y-4">
                {/* Difficulty Level */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-4">Difficulty Assessment</h3>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div>
                      <p className={`inline-block px-4 py-2 rounded-lg font-bold text-lg border-2 ${getDifficultyColor(ratingResult.level)}`}>
                        {ratingResult.level}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-8 rounded ${
                            i < getDifficultyBars(ratingResult.level)
                              ? 'bg-orange-500'
                              : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{ratingResult.explanation}</p>

                  {/* Difficulty Factors */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-xs text-blue-600 font-semibold">Prep Time</p>
                      <p className="text-sm text-gray-900 font-medium">{ratingResult.prepTime}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded">
                      <p className="text-xs text-purple-600 font-semibold">Technique Complexity</p>
                      <p className="text-sm text-gray-900 font-medium">{ratingResult.techniqueDifficulty}</p>
                    </div>
                    <div className="bg-pink-50 p-3 rounded">
                      <p className="text-xs text-pink-600 font-semibold">Ingredient Count</p>
                      <p className="text-sm text-gray-900 font-medium">{ratingResult.ingredientCount} items</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <p className="text-xs text-green-600 font-semibold">Cooking Steps</p>
                      <p className="text-sm text-gray-900 font-medium">{ratingResult.stepCount} steps</p>
                    </div>
                  </div>
                </div>

                {/* Difficulty Factors */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">What Makes This Recipe Challenging?</h4>
                  <ul className="space-y-2">
                    {ratingResult.factors?.map((factor, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-orange-500 font-bold mt-1">!</span>
                        <span className="text-gray-700 text-sm">{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Adjust Difficulty */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Adjust for Your Skill Level</h4>
                  <div className="space-y-3">
                    <select
                      value={targetLevel}
                      onChange={(e) => setTargetLevel(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Select target level...</option>
                      {difficultyLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                    <button
                      onClick={handleAdjustDifficulty}
                      disabled={!targetLevel || loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
                    >
                      {loading ? 'Adjusting...' : 'Get Adjusted Recipe'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Zap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Enter a recipe and click "Rate Difficulty" to see detailed assessment</p>
              </div>
            )}
          </div>
        </div>

        {/* Adjusted Recipe */}
        {adjustedRecipe && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-green-600" />
              Adjusted Recipe for {targetLevel}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Simplifications:</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  {adjustedRecipe.simplifications?.map((s, i) => (
                    <li key={i}>✓ {s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Equipment Alternatives:</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  {adjustedRecipe.equipmentAlternatives?.map((e, i) => (
                    <li key={i}>• {e}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-green-50 rounded border-l-4 border-green-500">
              <p className="text-sm text-green-900"><strong>New Estimate:</strong> {adjustedRecipe.newDifficultyLevel}</p>
              <p className="text-sm text-green-900"><strong>Estimated Time:</strong> {adjustedRecipe.estimatedTime}</p>
            </div>
          </div>
        )}

        {/* Skills Guide (Redesigned) */}
        <div className="mt-auto bg-white/40 backdrop-blur-md rounded-2xl p-4 border border-white/60 shadow-inner shrink-0">
          <div className="grid md:grid-cols-4 gap-4">
            {difficultyLevels.map((level, idx) => {
              const colors = {
                Beginner: 'from-emerald-500/10 to-emerald-500/5 text-emerald-700 border-emerald-200/50',
                Intermediate: 'from-amber-500/10 to-amber-500/5 text-amber-700 border-amber-200/50',
                Advanced: 'from-orange-500/10 to-orange-500/5 text-orange-700 border-orange-200/50',
                Expert: 'from-rose-500/10 to-rose-500/5 text-rose-700 border-rose-200/50'
              };
              const icons = [<Clock key="1" className="w-4 h-4" />, <Users key="2" className="w-4 h-4" />, <Zap key="3" className="w-4 h-4" />, <TrendingDown key="4" className="w-4 h-4" />];

              return (
                <div 
                  key={level} 
                  className={`relative overflow-hidden p-4 rounded-xl border-2 bg-gradient-to-br transition-all hover:scale-[1.02] hover:shadow-lg ${colors[level]}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-black text-[13px] uppercase tracking-[0.2em]">{level}</span>
                    <div className="opacity-40">{icons[idx]}</div>
                  </div>
                  <p className="text-[11px] font-bold opacity-70 leading-relaxed">
                    {level === 'Beginner' && 'Perfect for fast, high-quality meals with minimal equipment.'}
                    {level === 'Intermediate' && 'Standard culinary techniques with moderate preparation depth.'}
                    {level === 'Advanced' && 'Multi-stage processes requiring precision and focus.'}
                    {level === 'Expert' && 'Comprehensive professional methods and elite presentation.'}
                  </p>
                  <div className="absolute -bottom-2 -right-2 text-4xl font-black opacity-[0.05] italic">
                    {idx + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
