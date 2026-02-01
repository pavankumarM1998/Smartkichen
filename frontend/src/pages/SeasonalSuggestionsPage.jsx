import React, { useState, useEffect } from 'react';
import { Cloud, Leaf, Lightbulb, Calendar } from 'lucide-react';
import apiService from '../services/apiService';
import { toast } from 'react-hot-toast';

export default function SeasonalSuggestionsPage() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];

  useEffect(() => {
    fetchSeasonalSuggestions();
  }, []);

  useEffect(() => {
    if (selectedSeason) {
      setFilteredSuggestions(suggestions.filter(s => s.season === selectedSeason));
    } else {
      setFilteredSuggestions(suggestions);
    }
  }, [selectedSeason, suggestions]);

  const fetchSeasonalSuggestions = async () => {
    setLoading(true);
    try {
      const response = await apiService.getSeasonalSuggestions();
      setSuggestions(response.data.suggestions);
      toast.success('Seasonal suggestions loaded!');
    } catch (error) {
      toast.error('Failed to load seasonal suggestions');
    } finally {
      setLoading(false);
    }
  };

  const getSeasonColor = (season) => {
    switch(season) {
      case 'Spring': return 'from-green-400 to-blue-400';
      case 'Summer': return 'from-yellow-400 to-orange-400';
      case 'Fall': return 'from-orange-400 to-red-400';
      case 'Winter': return 'from-blue-400 to-cyan-400';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getSeasonBadgeColor = (season) => {
    switch(season) {
      case 'Spring': return 'bg-green-100 text-green-800';
      case 'Summer': return 'bg-yellow-100 text-yellow-800';
      case 'Fall': return 'bg-orange-100 text-orange-800';
      case 'Winter': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeasonEmoji = (season) => {
    switch(season) {
      case 'Spring': return '🌸';
      case 'Summer': return '☀️';
      case 'Fall': return '🍂';
      case 'Winter': return '❄️';
      default: return '🌍';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-8 h-8 text-teal-600" />
            <h1 className="text-4xl font-bold text-gray-900">Seasonal Suggestions</h1>
          </div>
          <p className="text-lg text-gray-600">Discover fresh, seasonal recipes and ingredients for every time of year</p>
        </div>

        {/* Season Filter */}
        <div className="mb-8 flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedSeason('')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              selectedSeason === ''
                ? 'bg-teal-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-teal-500'
            }`}
          >
            All Seasons
          </button>
          {seasons.map(season => (
            <button
              key={season}
              onClick={() => setSelectedSeason(season)}
              className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
                selectedSeason === season
                  ? `bg-gradient-to-r ${getSeasonColor(season)} text-white`
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-teal-500'
              }`}
            >
              <span>{getSeasonEmoji(season)}</span>
              {season}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading seasonal suggestions...</p>
            </div>
          </div>
        ) : filteredSuggestions.length > 0 ? (
          <div className="space-y-6">
            {/* Ingredients Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Leaf className="w-6 h-6 text-green-600" />
                Seasonal Ingredients
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSuggestions
                  .filter(s => s.type === 'ingredient')
                  .map((item, idx) => (
                    <div key={idx} className={`bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500`}>
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-2 ${getSeasonBadgeColor(item.season)}`}>
                        {getSeasonEmoji(item.season)} {item.season}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
                      <p className="text-gray-700 text-sm mb-3">{item.description}</p>
                      <div className="flex items-center gap-2 text-green-700 text-xs font-medium">
                        <Leaf className="w-3 h-3" />
                        Peak: {item.peakMonths}
                      </div>
                    </div>
                  ))}
              </div>
            </section>

            {/* Recipes Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-orange-600" />
                Seasonal Recipes
              </h2>
              <div className="grid lg:grid-cols-2 gap-4">
                {filteredSuggestions
                  .filter(s => s.type === 'recipe')
                  .map((item, idx) => (
                    <div key={idx} className={`bg-gradient-to-br ${getSeasonColor(item.season)} rounded-lg shadow-lg overflow-hidden text-white`}>
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-2xl font-bold flex-1">{item.name}</h3>
                          <span className="text-3xl">{getSeasonEmoji(item.season)}</span>
                        </div>
                        <p className="mb-4 text-white/90 text-sm">{item.description}</p>
                        
                        <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
                          <div className="bg-white/20 rounded p-2">
                            <p className="font-semibold text-xs opacity-75">Prep</p>
                            <p className="font-bold">{item.prepTime}</p>
                          </div>
                          <div className="bg-white/20 rounded p-2">
                            <p className="font-semibold text-xs opacity-75">Cook</p>
                            <p className="font-bold">{item.cookTime}</p>
                          </div>
                          <div className="bg-white/20 rounded p-2">
                            <p className="font-semibold text-xs opacity-75">Serves</p>
                            <p className="font-bold">{item.servings}</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-xs font-semibold opacity-75 mb-2">Key Ingredients:</p>
                          <div className="flex flex-wrap gap-1">
                            {item.ingredients?.slice(0, 4).map((ing, i) => (
                              <span key={i} className="bg-white/20 rounded-full px-2 py-1 text-xs">
                                {ing}
                              </span>
                            ))}
                            {item.ingredients?.length > 4 && (
                              <span className="bg-white/20 rounded-full px-2 py-1 text-xs">
                                +{item.ingredients.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>

                        <button className="w-full bg-white text-gray-900 font-semibold py-2 px-3 rounded-lg hover:bg-gray-100 transition">
                          View Recipe
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </section>

            {/* Tips Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Cloud className="w-6 h-6 text-blue-600" />
                Seasonal Tips
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {filteredSuggestions
                  .filter(s => s.type === 'tip')
                  .map((item, idx) => (
                    <div key={idx} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
                      <p className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <span className="text-xl">{getSeasonEmoji(item.season)}</span>
                        {item.name}
                      </p>
                      <p className="text-gray-700 text-sm">{item.description}</p>
                    </div>
                  ))}
              </div>
            </section>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No suggestions found for the selected season</p>
          </div>
        )}

        {/* Season Calendar */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Seasonal Calendar</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { season: 'Spring', months: 'Mar - May', icon: '🌸', color: 'from-green-100 to-blue-100' },
              { season: 'Summer', months: 'Jun - Aug', icon: '☀️', color: 'from-yellow-100 to-orange-100' },
              { season: 'Fall', months: 'Sep - Nov', icon: '🍂', color: 'from-orange-100 to-red-100' },
              { season: 'Winter', months: 'Dec - Feb', icon: '❄️', color: 'from-blue-100 to-cyan-100' }
            ].map(s => (
              <div key={s.season} className={`bg-gradient-to-br ${s.color} rounded-lg p-4 text-center`}>
                <p className="text-3xl mb-2">{s.icon}</p>
                <p className="font-semibold text-gray-900">{s.season}</p>
                <p className="text-sm text-gray-600">{s.months}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
