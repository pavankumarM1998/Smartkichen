import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import toast from 'react-hot-toast';

const MealPlannerPage = () => {
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [servings, setServings] = useState(4);
  const [selectedWeek, setSelectedWeek] = useState(new Date().toISOString().split('T')[0]);

  const generateMealPlan = async () => {
    setLoading(true);
    try {
      // Use the correct API service method
      const response = await apiService.generateMealPlan(selectedWeek, servings);
      console.log('Meal plan response:', response);
      if (response.data && response.data.data) {
        setMealPlan(response.data.data);
        toast.success('Meal plan generated!');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error generating meal plan:', error);
      toast.error('Failed to generate meal plan');
    } finally {
      setLoading(false);
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">📅 Weekly Meal Planner</h1>
        <button
          onClick={generateMealPlan}
          disabled={loading}
          className="btn-primary disabled:opacity-50"
        >
          {loading ? '⏳ Generating...' : '✨ Generate Plan'}
        </button>
      </div>

      {/* Week Selector */}
      <div className="card mb-6 flex gap-4 items-center">
        <label className="label">Week of:</label>
        <input
          type="date"
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(e.target.value)}
          className="input-field w-32"
        />
        <label className="label ml-4">Servings:</label>
        <input
          type="number"
          min="1"
          max="10"
          value={servings}
          onChange={(e) => setServings(parseInt(e.target.value))}
          className="input-field w-20"
        />
      </div>

      {/* Meal Plan Grid */}
      {mealPlan ? (
        <div className="grid md:grid-cols-7 gap-4">
          {days.map((day, idx) => (
            <div key={idx} className="card">
              <h3 className="font-bold text-center mb-4">{day}</h3>
              <div className="space-y-3">
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-xs text-gray-600 font-semibold">Breakfast</p>
                  <p className="text-sm mt-1">Oatmeal</p>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <p className="text-xs text-gray-600 font-semibold">Lunch</p>
                  <p className="text-sm mt-1">Salad</p>
                </div>
                <div className="bg-orange-50 p-3 rounded">
                  <p className="text-xs text-gray-600 font-semibold">Dinner</p>
                  <p className="text-sm mt-1">Grilled Chicken</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-gray-600 text-lg">Generate a meal plan to get started</p>
        </div>
      )}
    </div>
  );
};

export default MealPlannerPage;
