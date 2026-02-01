import React from 'react';
import { formatNutrition } from '../utils/helpers';

const NutritionInfo = ({ nutrition, servings = 1 }) => {
  if (!nutrition) {
    return <div className="text-gray-500">No nutrition information available</div>;
  }

  const formatted = formatNutrition(nutrition);

  return (
    <div className="card">
      <h3 className="font-semibold text-lg mb-4">Nutrition per Serving</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Calories</div>
          <div className="text-2xl font-bold text-blue-600">{formatted.calories}</div>
        </div>
        <div className="bg-red-50 p-3 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Protein</div>
          <div className="text-2xl font-bold text-red-600">{formatted.protein}g</div>
        </div>
        <div className="bg-yellow-50 p-3 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Fat</div>
          <div className="text-2xl font-bold text-yellow-600">{formatted.fat}g</div>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Carbs</div>
          <div className="text-2xl font-bold text-purple-600">{formatted.carbs}g</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Fiber</div>
          <div className="text-2xl font-bold text-green-600">{formatted.fiber}g</div>
        </div>
      </div>

      {nutrition.allergenWarnings && nutrition.allergenWarnings.length > 0 && (
        <div className="mt-4 bg-orange-50 border border-orange-200 p-3 rounded">
          <p className="font-semibold text-orange-800 mb-2">⚠️ Allergen Warnings:</p>
          <p className="text-sm text-orange-700">{nutrition.allergenWarnings.join(', ')}</p>
        </div>
      )}
    </div>
  );
};

export default NutritionInfo;
