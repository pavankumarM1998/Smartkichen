import React from 'react';
import { Link } from 'react-router-dom';
import { formatTime, difficultyColor, formatCost } from '../utils/helpers';

const RecipeCard = ({ recipe, onClick, compact = false }) => {
  if (compact) {
    return (
      <div
        className="card-hover"
        onClick={onClick}
      >
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{recipe.title}</h3>
        <div className="flex gap-4 text-sm text-gray-600 mb-2">
          <span>⏱️ {formatTime(recipe.prepTime + recipe.cookTime)}</span>
          <span className={`px-2 py-1 rounded ${difficultyColor(recipe.difficulty)}`}>
            {recipe.difficulty}
          </span>
        </div>
        <p className="text-sm text-gray-600">{recipe.servings} servings</p>
      </div>
    );
  }

  return (
    <div className="card-hover" onClick={onClick}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-lg flex-1">{recipe.title}</h3>
        {recipe.estimatedCost && (
          <span className="text-primary font-bold">{formatCost(recipe.estimatedCost)}</span>
        )}
      </div>

      {recipe.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{recipe.description}</p>
      )}

      <div className="flex flex-wrap gap-3 mb-3">
        <span className="text-sm text-gray-600">⏱️ {formatTime(recipe.prepTime)}</span>
        <span className="text-sm text-gray-600">🔥 {formatTime(recipe.cookTime)}</span>
        <span className={`px-2 py-1 rounded text-xs font-medium ${difficultyColor(recipe.difficulty)}`}>
          {recipe.difficulty}
        </span>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{recipe.servings} servings</span>
        {recipe.healthMode && recipe.healthMode !== 'Normal' && (
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
            {recipe.healthMode}
          </span>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;
