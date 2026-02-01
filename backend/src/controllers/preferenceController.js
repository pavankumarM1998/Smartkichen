const { apiResponse } = require('../utils/response');

const getPreferences = async (req, res, next) => {
  try {
    const preferences = await global.prisma.preferences.findUnique({
      where: { userId: req.userId },
    });

    if (!preferences) {
      return apiResponse(res, 404, false, 'Preferences not found');
    }

    apiResponse(res, 200, true, 'Preferences retrieved', preferences);
  } catch (error) {
    next(error);
  }
};

const updatePreferences = async (req, res, next) => {
  try {
    const { healthMode, servingsDefault, voiceEnabled, darkMode, notifications, language } =
      req.body;

    const preferences = await global.prisma.preferences.update({
      where: { userId: req.userId },
      data: {
        healthMode: healthMode ?? undefined,
        servingsDefault: servingsDefault ?? undefined,
        voiceEnabled: voiceEnabled ?? undefined,
        darkMode: darkMode ?? undefined,
        notifications: notifications ?? undefined,
        language: language ?? undefined,
      },
    });

    apiResponse(res, 200, true, 'Preferences updated', preferences);
  } catch (error) {
    next(error);
  }
};

const getTasteProfile = async (req, res, next) => {
  try {
    const tasteProfile = await global.prisma.userTasteProfile.findUnique({
      where: { userId: req.userId },
    });

    if (!tasteProfile) {
      return apiResponse(res, 404, false, 'Taste profile not found');
    }

    apiResponse(res, 200, true, 'Taste profile retrieved', tasteProfile);
  } catch (error) {
    next(error);
  }
};

const updateTasteProfile = async (req, res, next) => {
  try {
    const {
      spiceLevel,
      cuisinePreferences,
      dislikedIngredients,
      allergens,
      dietaryRestrictions,
    } = req.body;

    const tasteProfile = await global.prisma.userTasteProfile.update({
      where: { userId: req.userId },
      data: {
        spiceLevel: spiceLevel ?? undefined,
        cuisinePreferences: cuisinePreferences ?? undefined,
        dislikedIngredients: dislikedIngredients ?? undefined,
        allergens: allergens ?? undefined,
        dietaryRestrictions: dietaryRestrictions ?? undefined,
      },
    });

    apiResponse(res, 200, true, 'Taste profile updated', tasteProfile);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPreferences,
  updatePreferences,
  getTasteProfile,
  updateTasteProfile,
};
