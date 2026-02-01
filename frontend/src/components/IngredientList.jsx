import React, { useState, useEffect } from 'react';
import { recipeService } from '../services/apiService';
import toast from 'react-hot-toast';
import { scaleQuantity } from '../utils/helpers';

const IngredientList = ({ ingredients, servings: originalServings = 4, recipeId }) => {
  const [scaledIngredients, setScaledIngredients] = useState(ingredients);
  const [servings, setServings] = useState(originalServings);
  const [loading, setLoading] = useState(false);

  const handleScaleChange = async (newServings) => {
    if (newServings < 1 || newServings > 10) {
      toast.error('Servings must be between 1 and 10');
      return;
    }

    setLoading(true);
    try {
      const response = await recipeService.scaleRecipe(recipeId, newServings);
      setScaledIngredients(response.data.data.ingredients);
      setServings(newServings);
    } catch (error) {
      toast.error('Failed to scale recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Ingredients</h3>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Servings:</label>
          <input
            type="number"
            min="1"
            max="10"
            value={servings}
            onChange={(e) => handleScaleChange(parseInt(e.target.value))}
            disabled={loading}
            className="input-field w-16"
          />
        </div>
      </div>

      <div className="space-y-2">
        {scaledIngredients?.map((ing, idx) => (
          <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <div>
              <p className="font-medium">{ing.ingredient?.name || ing.name}</p>
              {ing.substitutes && ing.substitutes.length > 0 && (
                <p className="text-xs text-gray-500">
                  Or use: {ing.substitutes.join(', ')}
                </p>
              )}
            </div>
            <span className="font-semibold text-primary">
              {ing.quantity} {ing.unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IngredientList;
