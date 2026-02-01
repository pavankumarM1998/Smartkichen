export const formatTime = (minutes) => {
  if (!minutes) return '0 min';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

export const calculateTotalTime = (prepTime, cookTime) => {
  return (prepTime || 0) + (cookTime || 0);
};

export const formatCost = (cost) => {
  if (!cost) return '$0.00';
  return `$${cost.toFixed(2)}`;
};

export const formatNutrition = (nutrition) => {
  return {
    calories: Math.round(nutrition.calories || 0),
    protein: (nutrition.protein || 0).toFixed(1),
    fat: (nutrition.fat || 0).toFixed(1),
    carbs: (nutrition.carbs || 0).toFixed(1),
    fiber: (nutrition.fiber || 0).toFixed(1),
  };
};

export const difficultyColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'easy':
      return 'bg-green-100 text-green-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'hard':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const healthModeLabel = (mode) => {
  const labels = {
    Normal: 'Balanced',
    Keto: 'Keto Diet',
    Diabetic: 'Diabetic-Friendly',
    HighProtein: 'High Protein',
    WeightLoss: 'Weight Loss',
  };
  return labels[mode] || mode;
};

export const scaleQuantity = (quantity, oldServings, newServings) => {
  return (quantity * newServings) / oldServings;
};

export const parseIngredientString = (ingredientStr) => {
  // Parse strings like "2 cups flour" or "1.5 tbsp salt"
  const regex = /^([0-9.\/]+)\s+(\w+)\s+(.+)$/;
  const match = ingredientStr.match(regex);

  if (match) {
    return {
      quantity: parseFloat(match[1]),
      unit: match[2],
      name: match[3],
    };
  }

  return {
    quantity: 1,
    unit: 'piece',
    name: ingredientStr,
  };
};

export const getExpiryStatus = (expiryDate) => {
  if (!expiryDate) return { status: 'unknown', color: 'gray' };

  const now = new Date();
  const expiry = new Date(expiryDate);
  const daysLeft = Math.floor((expiry - now) / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) {
    return { status: 'expired', color: 'red', daysLeft };
  } else if (daysLeft < 3) {
    return { status: 'expiring-soon', color: 'orange', daysLeft };
  } else if (daysLeft < 7) {
    return { status: 'soon', color: 'yellow', daysLeft };
  } else {
    return { status: 'fresh', color: 'green', daysLeft };
  }
};
