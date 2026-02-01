const { apiResponse } = require('../utils/response');
const aiService = require('../services/aiService');
const db = require('../services/realtimeDbService');

// Fallback recipe templates when AI fails
const fallbackRecipes = {
  en: {
    rice: {
      title: 'Simple Fried Rice',
      description: 'A quick and easy fried rice recipe using your available ingredients',
      difficulty: 'Easy',
      prepTime: 10,
      cookTime: 15,
      estimatedCost: 5,
      wasteSavings: 2,
      ingredients: [
        { name: 'rice', quantity: 2, unit: 'cups' },
        { name: 'oil', quantity: 2, unit: 'tablespoons' },
        { name: 'salt', quantity: 1, unit: 'teaspoon' },
        { name: 'soy sauce', quantity: 1, unit: 'tablespoon' },
      ],
      steps: [
        { stepNumber: 1, instruction: 'Heat 2 tablespoons of oil in a large wok or frying pan over medium-high heat. Make sure the pan is hot before adding the rice - you should see the oil shimmering.', duration: 2 },
        { stepNumber: 2, instruction: 'Add the cooked rice to the hot pan, breaking up any clumps with a spatula. Spread it out evenly across the pan surface.', duration: 2 },
        { stepNumber: 3, instruction: 'Stir-fry the rice continuously for 5-7 minutes, tossing and flipping to ensure even heating. The rice should start to get slightly crispy and golden on the edges.', duration: 7 },
        { stepNumber: 4, instruction: 'Add soy sauce and salt to taste. Mix well to ensure the seasoning is evenly distributed throughout the rice.', duration: 1 },
        { stepNumber: 5, instruction: 'Remove from heat and transfer to a serving dish. Serve immediately while hot and crispy. Garnish with green onions or sesame seeds if available.', duration: 1 },
      ],
      nutrition: {
        calories: 250,
        protein: 5,
        fat: 8,
        carbs: 40,
        fiber: 2,
      },
    },
    chicken: {
      title: 'Simple Grilled Chicken',
      description: 'Perfectly seasoned grilled chicken with a golden, crispy exterior',
      difficulty: 'Easy',
      prepTime: 10,
      cookTime: 20,
      estimatedCost: 8,
      wasteSavings: 3,
      ingredients: [
        { name: 'chicken', quantity: 500, unit: 'grams' },
        { name: 'salt', quantity: 1, unit: 'teaspoon' },
        { name: 'pepper', quantity: 0.5, unit: 'teaspoon' },
        { name: 'oil', quantity: 1, unit: 'tablespoon' },
        { name: 'garlic powder', quantity: 0.5, unit: 'teaspoon' },
      ],
      steps: [
        { stepNumber: 1, instruction: 'Pat the chicken dry with paper towels to remove excess moisture. This helps achieve a better sear and prevents steaming.', duration: 2 },
        { stepNumber: 2, instruction: 'Season both sides of the chicken generously with salt, pepper, and garlic powder. Rub the seasonings into the meat to ensure they adhere well.', duration: 3 },
        { stepNumber: 3, instruction: 'Heat 1 tablespoon of oil in a large skillet or grill pan over medium heat. Let the pan heat for about 2 minutes until the oil is shimmering but not smoking.', duration: 2 },
        { stepNumber: 4, instruction: 'Carefully place the chicken in the hot pan. Cook without moving for 8-10 minutes until the bottom develops a golden-brown crust.', duration: 10 },
        { stepNumber: 5, instruction: 'Flip the chicken and cook the other side for another 8-10 minutes. The internal temperature should reach 165°F (74°C) when fully cooked.', duration: 10 },
        { stepNumber: 6, instruction: 'Remove from heat and let the chicken rest on a cutting board for 5 minutes. This allows the juices to redistribute, keeping the meat moist and tender.', duration: 5 },
        { stepNumber: 7, instruction: 'Slice and serve with your favorite sides. The chicken should be juicy inside with a crispy, flavorful exterior.', duration: 2 },
      ],
      nutrition: {
        calories: 300,
        protein: 35,
        fat: 15,
        carbs: 2,
        fiber: 0,
      },
    },
    eggs: {
      title: 'Classic Scrambled Eggs',
      description: 'Fluffy, creamy scrambled eggs cooked to perfection',
      difficulty: 'Easy',
      prepTime: 2,
      cookTime: 5,
      estimatedCost: 3,
      wasteSavings: 1,
      ingredients: [
        { name: 'eggs', quantity: 3, unit: 'pieces' },
        { name: 'butter', quantity: 1, unit: 'tablespoon' },
        { name: 'milk', quantity: 1, unit: 'tablespoon' },
        { name: 'salt', quantity: 0.5, unit: 'teaspoon' },
        { name: 'pepper', quantity: 0.25, unit: 'teaspoon' },
      ],
      steps: [
        { stepNumber: 1, instruction: 'Crack the eggs into a medium bowl. Add milk, salt, and pepper. Whisk vigorously for about 30 seconds until the mixture is well combined and slightly frothy.', duration: 2 },
        { stepNumber: 2, instruction: 'Heat a non-stick pan over medium-low heat. Add butter and let it melt completely, swirling to coat the entire bottom of the pan. The butter should foam but not brown.', duration: 1 },
        { stepNumber: 3, instruction: 'Pour the egg mixture into the pan. Let it sit undisturbed for about 20 seconds until the edges just begin to set.', duration: 1 },
        { stepNumber: 4, instruction: 'Using a silicone spatula, gently push the eggs from the edges toward the center, tilting the pan to let uncooked egg flow to the edges. Continue this process for 3-4 minutes.', duration: 4 },
        { stepNumber: 5, instruction: 'When the eggs are mostly set but still slightly wet and glossy, remove from heat immediately. The residual heat will finish cooking them to creamy perfection.', duration: 1 },
        { stepNumber: 6, instruction: 'Transfer to a plate and serve immediately. The eggs should be soft, fluffy, and creamy - not dry or rubbery. Garnish with fresh herbs if desired.', duration: 1 },
      ],
      nutrition: {
        calories: 220,
        protein: 18,
        fat: 16,
        carbs: 2,
        fiber: 0,
      },
    },
  },
  te: {
    rice: {
      title: 'సింపుల్ ఫ్రైడ్ రైస్',
      description: 'మీ అందుబాటులో ఉన్న పదార్థాలను ఉపయోగించి త్వరగా మరియు సులభంగా ఫ్రైడ్ రైస్ రెసిపీ',
      difficulty: 'సులభం',
      prepTime: 10,
      cookTime: 15,
      estimatedCost: 5,
      wasteSavings: 2,
      ingredients: [
        { name: 'బియ్యం', quantity: 2, unit: 'కప్పులు' },
        { name: 'నూనె', quantity: 2, unit: 'టేబుల్‌స్పూన్లు' },
        { name: 'ఉప్పు', quantity: 1, unit: 'టీస్పూన్' },
        { name: 'సోయా సాస్', quantity: 1, unit: 'టేబుల్‌స్పూన్' },
      ],
      steps: [
        { stepNumber: 1, instruction: 'పెద్ద వోక్ లేదా ఫ్రైయింగ్ పాన్‌లో 2 టేబుల్‌స్పూన్ల నూనెను మధ్యం-అధిక వేడిపై వేడి చేయండి. బియ్యం జోడించే ముందు పాన్ వేడిగా ఉందని నిర్ధారించుకోండి - మీరు నూనె మెరుస్తున్నట్లు చూడాలి.', duration: 2 },
        { stepNumber: 2, instruction: 'వండిన బియ్యాన్ని వేడి పాన్‌లోకి జోడించండి, గడ్డలను స్పాటులాతో విడదీయండి. పాన్ ఉపరితలం అంతటా సమానంగా విస్తరించండి.', duration: 2 },
        { stepNumber: 3, instruction: 'బియ్యాన్ని 5-7 నిమిషాలు నిరంతరం వేయించండి, సమాన వేడిని నిర్ధారించడానికి తిప్పండి. బియ్యం అంచులలో కొంచెం క్రిస్పీగా మరియు బంగారు రంగులోకి మారడం ప్రారంభించాలి.', duration: 7 },
        { stepNumber: 4, instruction: 'రుచికి సోయా సాస్ మరియు ఉప్పు జోడించండి. మసాలా బియ్యం అంతటా సమానంగా పంపిణీ చేయబడిందని నిర్ధారించుకోవడానికి బాగా కలపండి.', duration: 1 },
        { stepNumber: 5, instruction: 'వేడి నుండి తొలగించి, సర్వింగ్ డిష్‌కు బదిలీ చేయండి. వేడిగా మరియు క్రిస్పీగా ఉన్నప్పుడు వెంటనే సర్వ్ చేయండి. అందుబాటులో ఉంటే పచ్చి ఉల్లిపాయలు లేదా నువ్వులతో అలంకరించండి.', duration: 1 },
      ],
      nutrition: {
        calories: 250,
        protein: 5,
        fat: 8,
        carbs: 40,
        fiber: 2,
      },
    },
    chicken: {
      title: 'సింపుల్ గ్రిల్డ్ చికెన్',
      description: 'బంగారు, క్రిస్పీ బాహ్య భాగంతో సంపూర్ణంగా మసాలా చేసిన గ్రిల్డ్ చికెన్',
      difficulty: 'సులభం',
      prepTime: 10,
      cookTime: 20,
      estimatedCost: 8,
      wasteSavings: 3,
      ingredients: [
        { name: 'చికెన్', quantity: 500, unit: 'గ్రాములు' },
        { name: 'ఉప్పు', quantity: 1, unit: 'టీస్పూన్' },
        { name: 'మిరియాలు', quantity: 0.5, unit: 'టీస్పూన్' },
        { name: 'నూనె', quantity: 1, unit: 'టేబుల్‌స్పూన్' },
        { name: 'వెల్లుల్లి పొడి', quantity: 0.5, unit: 'టీస్పూన్' },
      ],
      steps: [
        { stepNumber: 1, instruction: 'అదనపు తేమను తొలగించడానికి కాగితపు టవల్స్‌తో చికెన్‌ను పొడిగా తుడవండి. ఇది మెరుగైన సీర్‌ను సాధించడానికి మరియు ఆవిరిని నివారించడానికి సహాయపడుతుంది.', duration: 2 },
        { stepNumber: 2, instruction: 'చికెన్ రెండు వైపులా ఉప్పు, మిరియాలు మరియు వెల్లుల్లి పొడితో ఉదారంగా మసాలా చేయండి. మసాలాలు బాగా అతుక్కునేలా మాంసంలోకి రుద్దండి.', duration: 3 },
        { stepNumber: 3, instruction: 'పెద్ద స్కిల్లెట్ లేదా గ్రిల్ పాన్‌లో 1 టేబుల్‌స్పూన్ నూనెను మధ్యం వేడిపై వేడి చేయండి. నూనె మెరుస్తున్నప్పుడు కానీ పొగ రాకుండా ఉండే వరకు పాన్‌ను సుమారు 2 నిమిషాలు వేడి చేయనివ్వండి.', duration: 2 },
        { stepNumber: 4, instruction: 'చికెన్‌ను జాగ్రత్తగా వేడి పాన్‌లో ఉంచండి. దిగువ భాగం బంగారు-గోధుమ రంగు క్రస్ట్‌ను అభివృద్ధి చేసే వరకు 8-10 నిమిషాలు కదలకుండా ఉడికించండి.', duration: 10 },
        { stepNumber: 5, instruction: 'చికెన్‌ను తిప్పండి మరియు మరో 8-10 నిమిషాలు మరో వైపు ఉడికించండి. పూర్తిగా ఉడికినప్పుడు అంతర్గత ఉష్ణోగ్రత 165°F (74°C) చేరుకోవాలి.', duration: 10 },
        { stepNumber: 6, instruction: 'వేడి నుండి తొలగించి, చికెన్‌ను కట్టింగ్ బోర్డ్‌పై 5 నిమిషాలు విశ్రాంతి తీసుకోనివ్వండి. ఇది రసాలను పునఃపంపిణీ చేయడానికి అనుమతిస్తుంది, మాంసాన్ని తేమగా మరియు మృదువుగా ఉంచుతుంది.', duration: 5 },
        { stepNumber: 7, instruction: 'ముక్కలు చేసి మీకు ఇష్టమైన సైడ్‌లతో సర్వ్ చేయండి. చికెన్ లోపల రసవంతంగా మరియు బయట క్రిస్పీ, రుచికరమైన బాహ్యంతో ఉండాలి.', duration: 2 },
      ],
      nutrition: {
        calories: 300,
        protein: 35,
        fat: 15,
        carbs: 2,
        fiber: 0,
      },
    },
    eggs: {
      title: 'క్లాసిక్ స్క్రాంబుల్డ్ గుడ్లు',
      description: 'పరిపూర్ణతకు వండిన మెత్తని, క్రీమీ స్క్రాంబుల్డ్ గుడ్లు',
      difficulty: 'సులభం',
      prepTime: 2,
      cookTime: 5,
      estimatedCost: 3,
      wasteSavings: 1,
      ingredients: [
        { name: 'గుడ్లు', quantity: 3, unit: 'ముక్కలు' },
        { name: 'వెన్న', quantity: 1, unit: 'టేబుల్‌స్పూన్' },
        { name: 'పాలు', quantity: 1, unit: 'టేబుల్‌స్పూన్' },
        { name: 'ఉప్పు', quantity: 0.5, unit: 'టీస్పూన్' },
        { name: 'మిరియాలు', quantity: 0.25, unit: 'టీస్పూన్' },
      ],
      steps: [
        { stepNumber: 1, instruction: 'గుడ్లను మధ్యం గిన్నెలో పగులగొట్టండి. పాలు, ఉప్పు మరియు మిరియాలు జోడించండి. మిశ్రమం బాగా కలిసిపోయి కొంచెం నురుగుగా మారే వరకు సుమారు 30 సెకన్ల పాటు బలంగా కొట్టండి.', duration: 2 },
        { stepNumber: 2, instruction: 'నాన్-స్టిక్ పాన్‌ను మధ్యం-తక్కువ వేడిపై వేడి చేయండి. వెన్న జోడించి పూర్తిగా కరిగేలా చేయండి, పాన్ దిగువ భాగం మొత్తాన్ని పూత పూయడానికి తిప్పండి. వెన్న నురుగు కావాలి కానీ గోధుమ రంగులోకి మారకూడదు.', duration: 1 },
        { stepNumber: 3, instruction: 'గుడ్డు మిశ్రమాన్ని పాన్‌లోకి పోయండి. అంచులు సెట్ అవ్వడం ప్రారంభించే వరకు సుమారు 20 సెకన్ల పాటు కదలకుండా కూర్చోనివ్వండి.', duration: 1 },
        { stepNumber: 4, instruction: 'సిలికాన్ స్పాటులా ఉపయోగించి, గుడ్లను అంచుల నుండి మధ్యలోకి మెల్లగా నెట్టండి, ఉడకని గుడ్డు అంచులకు ప్రవహించేలా పాన్‌ను వంచండి. ఈ ప్రక్రియను 3-4 నిమిషాలు కొనసాగించండి.', duration: 4 },
        { stepNumber: 5, instruction: 'గుడ్లు ఎక్కువగా సెట్ అయినప్పుడు కానీ ఇంకా కొంచెం తడిగా మరియు మెరుస్తున్నప్పుడు, వెంటనే వేడి నుండి తొలగించండి. అవశేష వేడి వాటిని క్రీమీ పరిపూర్ణతకు ఉడికించడం ముగిస్తుంది.', duration: 1 },
        { stepNumber: 6, instruction: 'ప్లేట్‌కు బదిలీ చేసి వెంటనే సర్వ్ చేయండి. గుడ్లు మృదువుగా, మెత్తగా మరియు క్రీమీగా ఉండాలి - పొడిగా లేదా రబ్బరుగా కాదు. కావాలనుకుంటే తాజా మూలికలతో అలంకరించండి.', duration: 1 },
      ],
      nutrition: {
        calories: 220,
        protein: 18,
        fat: 16,
        carbs: 2,
        fiber: 0,
      },
    },
  },
};

const getAllRecipes = async (req, res, next) => {
  try {
    const recipes = await db.getDocs(db.paths.recipes);
    apiResponse(res, 200, true, 'Recipes retrieved successfully', recipes);
  } catch (error) {
    next(error);
  }
};

const searchRecipes = async (req, res, next) => {
  try {
    const { query } = req.params;
    const recipes = await db.searchDocs(db.paths.recipes, 'title', query, 15);
    apiResponse(res, 200, true, 'Recipes found', recipes);
  } catch (error) {
    next(error);
  }
};

const getRecipeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const recipe = await db.getDocById(db.paths.recipes, id);

    if (!recipe) {
      return apiResponse(res, 404, false, 'Recipe not found');
    }

    apiResponse(res, 200, true, 'Recipe retrieved successfully', recipe);
  } catch (error) {
    next(error);
  }
};

const generateRecipe = async (req, res, next) => {
  try {
    const { ingredients, healthMode = 'Normal', servings = 4, language = 'en' } = req.body;

    if (!ingredients || ingredients.length === 0) {
      return apiResponse(res, 400, false, 'At least one ingredient is required');
    }

    let generatedRecipe;

    try {
      // Try to use AI service
      generatedRecipe = await aiService.generateRecipe(
        ingredients,
        healthMode,
        servings
      );
    } catch (aiError) {
      console.log('AI service failed, using fallback recipe:', aiError.message);

      // Use fallback recipe based on first ingredient
      const firstIngredient = ingredients[0].toLowerCase();
      const lang = language === 'te' ? 'te' : 'en'; const recipes = fallbackRecipes[lang]; let template = recipes.rice; // default

      if (firstIngredient.includes('chicken')) {
        template = recipes.chicken;
      } else if (firstIngredient.includes('egg')) {
        template = recipes.eggs;
      } else if (firstIngredient.includes('rice')) {
        template = recipes.rice;
      }

      // Create dynamic ingredients list from ALL user inputs
      const dynamicIngredients = ingredients.map((ing, idx) => ({
        name: ing,
        quantity: idx === 0 ? 2 : 1,
        unit: idx === 0 ? (lang === 'te' ? 'కప్పులు' : 'cups') : (lang === 'te' ? 'ముక్కలు' : 'pieces')
      }));

      // Add health mode-specific ingredients and seasonings
      switch (healthMode) {
        case 'Keto':
          // Keto: High fat, low carb
          dynamicIngredients.push(
            { name: lang === 'te' ? 'వెన్న' : 'butter', quantity: 2, unit: lang === 'te' ? 'టేబుల్‌స్పూన్లు' : 'tablespoons' },
            { name: lang === 'te' ? 'చీజ్' : 'cheese', quantity: 50, unit: lang === 'te' ? 'గ్రాములు' : 'grams' },
            { name: lang === 'te' ? 'ఉప్పు' : 'salt', quantity: 1, unit: lang === 'te' ? 'టీస్పూన్' : 'teaspoon' },
            { name: lang === 'te' ? 'నల్ల మిరియాలు' : 'black pepper', quantity: 0.5, unit: lang === 'te' ? 'టీస్పూన్' : 'teaspoon' }
          );
          break;

        case 'Diabetic':
          // Diabetic: Low sugar, high fiber
          dynamicIngredients.push(
            { name: lang === 'te' ? 'ఆలివ్ నూనె' : 'olive oil', quantity: 1, unit: lang === 'te' ? 'టేబుల్‌స్పూన్' : 'tablespoon' },
            { name: lang === 'te' ? 'వెల్లుల్లి' : 'garlic', quantity: 2, unit: lang === 'te' ? 'రెబ్బలు' : 'cloves' },
            { name: lang === 'te' ? 'ఉప్పు' : 'salt', quantity: 0.5, unit: lang === 'te' ? 'టీస్పూన్' : 'teaspoon' },
            { name: lang === 'te' ? 'పచ్చి కూరలు' : 'fresh herbs', quantity: 1, unit: lang === 'te' ? 'టేబుల్‌స్పూన్' : 'tablespoon' }
          );
          break;

        case 'HighProtein':
          // High Protein: Extra protein sources
          dynamicIngredients.push(
            { name: lang === 'te' ? 'నూనె' : 'oil', quantity: 1.5, unit: lang === 'te' ? 'టేబుల్‌స్పూన్లు' : 'tablespoons' },
            { name: lang === 'te' ? 'పెసలు' : 'lentils', quantity: 0.5, unit: lang === 'te' ? 'కప్పు' : 'cup' },
            { name: lang === 'te' ? 'ఉప్పు' : 'salt', quantity: 1, unit: lang === 'te' ? 'టీస్పూన్' : 'teaspoon' },
            { name: lang === 'te' ? 'మిరపకాయ పొడి' : 'chili powder', quantity: 0.5, unit: lang === 'te' ? 'టీస్పూన్' : 'teaspoon' }
          );
          break;

        case 'WeightLoss':
          // Weight Loss: Low calorie, high volume
          dynamicIngredients.push(
            { name: lang === 'te' ? 'ఆలివ్ నూనె స్ప్రే' : 'olive oil spray', quantity: 3, unit: lang === 'te' ? 'స్ప్రేలు' : 'sprays' },
            { name: lang === 'te' ? 'కూరగాయలు' : 'vegetables', quantity: 1, unit: lang === 'te' ? 'కప్పు' : 'cup' },
            { name: lang === 'te' ? 'నిమ్మరసం' : 'lemon juice', quantity: 1, unit: lang === 'te' ? 'టేబుల్‌స్పూన్' : 'tablespoon' },
            { name: lang === 'te' ? 'ఉప్పు' : 'salt', quantity: 0.5, unit: lang === 'te' ? 'టీస్పూన్' : 'teaspoon' }
          );
          break;

        default:
          // Normal: Basic seasonings
          dynamicIngredients.push(
            { name: lang === 'te' ? 'నూనె' : 'oil', quantity: 2, unit: lang === 'te' ? 'టేబుల్‌స్పూన్లు' : 'tablespoons' },
            { name: lang === 'te' ? 'ఉప్పు' : 'salt', quantity: 1, unit: lang === 'te' ? 'టీస్పూన్' : 'teaspoon' }
          );
      }



      // Create dynamic cooking steps based on ingredients
      const dynamicSteps = [];
      let stepNum = 1;

      // Helper function to get ingredient-specific cooking instructions
      const getIngredientInstructions = (ingredient, lang) => {
        const ingLower = ingredient.toLowerCase();

        // Rice-specific instructions
        if (ingLower.includes('rice')) {
          return {
            prep: lang === 'te'
              ? `${ingredient} సిద్ధం చేయడం: మొదట ${ingredient} ను ఒక పెద్ద గిన్నెలో వేయండి. చల్లని నీటిని జోడించి, మీ చేతులతో బియ్యాన్ని మెల్లగా రుద్దండి 30 సెకన్లు. తెల్లని మేఘావృత నీరు వస్తుంది - ఇది స్టార్చ్. ఈ నీరు పారేయండి. ఈ ప్రక్రియను 3-4 సార్లు పునరావృతం చేయండి నీరు స్వచ్ఛంగా మరియు పారదర్శకంగా వచ్చే వరకు. తరువాత, శుభ్రమైన చల్లని నీటిలో ${ingredient} ను 30 నిమిషాలు నానబెట్టండి. ఇది బియ్యం గింజలను మృదువుగా చేస్తుంది మరియు సమానంగా ఉడికేలా చేస్తుంది. నానబెట్టిన తరువాత, నీరు పూర్తిగా తీసేయండి ఒక జల్లెడ ఉపయోగించి.`
              : `Prepare ${ingredient}: First, place ${ingredient} in a large bowl. Add cold water and gently rub the rice grains with your hands for 30 seconds. You'll see cloudy white water - this is starch. Drain this water completely. Repeat this washing process 3-4 times until the water runs clear and transparent. This removes excess starch and prevents sticky, gummy rice. Next, soak the washed ${ingredient} in fresh cold water for 30 minutes. This softens the grains and ensures even cooking. After soaking, drain the water completely using a strainer. The rice should be moist but not sitting in water.`,
            cook: lang === 'te'
              ? `${ingredient} వండటం: నానబెట్టిన మరియు ఎండబెట్టిన ${ingredient} ను పాన్‌లో జోడించండి. ఖచ్చితమైన నీటి నిష్పత్తి చాలా ముఖ్యం: ప్రతి 1 కప్పు బియ్యం కు సరిగ్గా 2 కప్పుల నీరు జోడించండి (1:2 నిష్పత్తి). ఉదాహరణకు, 2 కప్పుల బియ్యం కు 4 కప్పుల నీరు. ఒక చిటికెడు ఉప్పు జోడించండి రుచి కోసం. బియ్యం మరియు నీరు బాగా కలపండి చెక్క గరిటెతో. పాన్‌ను అధిక వేడిపై ఉంచండి మరియు మరుగు వచ్చే వరకు వేడి చేయండి - మీరు పెద్ద బుడగలు చూస్తారు ఉపరితలం మీద. మరుగు వచ్చిన వెంటనే, వేడిని చాలా తక్కువకు తగ్గించండి (అతి తక్కువ సెట్టింగ్). పాన్‌ను గట్టిగా మూత పెట్టండి. 15-18 నిమిషాలు ఉడికించండి కదలించకుండా - మూత తీయకండి! 15 నిమిషాల తరువాత, ఒక గింజ తీసి చూడండి - అది మృదువుగా ఉండాలి మరియు నీరు పూర్తిగా శోషించబడి ఉండాలి. ఇంకా గట్టిగా ఉంటే, మరో 2-3 నిమిషాలు వండండి. పూర్తయినప్పుడు, వేడి నుండి తొలగించి, మూత పెట్టి 5 నిమిషాలు ఆవిరి తీయనివ్వండి. తరువాత ఫోర్క్‌తో మెల్లగా కదిలించండి గింజలను వేరు చేయడానికి.`
              : `Cook ${ingredient}: Add the soaked and drained ${ingredient} to the pan. The exact water ratio is crucial: add exactly 2 cups of water for every 1 cup of rice (1:2 ratio). For example, if you have 2 cups of rice, add 4 cups of water. Add a pinch of salt for flavor. Stir the rice and water well with a wooden spoon to ensure even distribution. Place the pan on high heat and bring to a full rolling boil - you'll see large bubbles breaking the surface. As soon as it boils, immediately reduce heat to the lowest setting (simmer). Cover the pan tightly with a lid. Cook for 15-18 minutes WITHOUT stirring or lifting the lid - this traps the steam which cooks the rice perfectly. After 15 minutes, test one grain - it should be tender and the water should be completely absorbed. If still firm, cook for another 2-3 minutes. When done, remove from heat and let it steam with the lid on for 5 minutes. This final steaming makes the rice fluffy. Then gently fluff with a fork to separate the grains.`,
            duration: 18
          };
        }

        // Egg-specific instructions
        if (ingLower.includes('egg')) {
          return {
            prep: lang === 'te'
              ? `${ingredient} పగలగొట్టి ఒక గిన్నెలో వేయండి. చిటికెడు ఉప్పు, మిరియాలు జోడించి బాగా కొట్టండి గాలి రావాలి.`
              : `Crack ${ingredient} into a bowl. Add a pinch of salt and pepper, beat well until frothy and air is incorporated.`,
            cook: lang === 'te'
              ? `కొట్టిన గుడ్లు వేడి పాన్‌లో పోయండి. 30 సెకన్లు ఆగండి, తరువాత మెల్లగా కదిలించండి స్పాటులాతో పెద్ద కర్డ్స్ తయారు చేయడానికి. 3-4 నిమిషాలు వండండి మృదువుగా మరియు కొంచెం తేమగా ఉండే వరకు. ఎక్కువ వండకండి.`
              : `Pour beaten ${ingredient} into the hot pan. Wait 30 seconds, then gently stir with spatula to form large curds. Cook for 3-4 minutes until soft and slightly moist. Don't overcook.`,
            duration: 4
          };
        }

        // Chicken-specific instructions
        if (ingLower.includes('chicken')) {
          return {
            prep: lang === 'te'
              ? `${ingredient} చిన్న ముక్కలుగా కట్ చేయండి (1-2 అంగుళాలు). ఉప్పు, మిరియాలు, నిమ్మరసం తో మ్యారినేట్ చేయండి 15 నిమిషాలు. ఇది రుచిని పెంచుతుంది.`
              : `Cut ${ingredient} into small pieces (1-2 inches). Marinate with salt, pepper, and lemon juice for 15 minutes. This enhances flavor and tenderness.`,
            cook: lang === 'te'
              ? `మ్యారినేట్ చేసిన ${ingredient} వేడి పాన్‌లో జోడించండి. ఒక వైపు 4-5 నిమిషాలు వండండి కదలించకుండా బంగారు రంగు వచ్చే వరకు. తిప్పి మరో వైపు 4-5 నిమిషాలు వండండి. చికెన్ పూర్తిగా ఉడికిందో చెక్ చేయండి - లోపల గులాబీ రంగు ఉండకూడదు.`
              : `Add marinated ${ingredient} to the hot pan. Cook one side for 4-5 minutes without stirring until golden brown. Flip and cook other side for 4-5 minutes. Check chicken is fully cooked - no pink inside.`,
            duration: 10
          };
        }

        // Generic vegetable/ingredient instructions
        return {
          prep: lang === 'te'
            ? `${ingredient} శుభ్రం చేసి, చిన్న ముక్కలుగా కట్ చేయండి సమానంగా ఉండేలా. ఇది సమానంగా వండటానికి సహాయపడుతుంది.`
            : `Clean and cut ${ingredient} into small, uniform pieces. This helps in even cooking.`,
          cook: lang === 'te'
            ? `${ingredient} వేడి పాన్‌లో జోడించండి. తరచుగా కదిలిస్తూ 5-7 నిమిషాలు వండండి మృదువుగా మరియు కొంచెం బంగారు రంగు వచ్చే వరకు.`
            : `Add ${ingredient} to the hot pan. Cook for 5-7 minutes, stirring frequently, until tender and lightly golden.`,
          duration: 6
        };
      };

      // Step 1: Detailed preparation for each ingredient
      ingredients.forEach((ing, idx) => {
        const instructions = getIngredientInstructions(ing, lang);
        dynamicSteps.push({
          stepNumber: stepNum++,
          instruction: instructions.prep,
          duration: 3
        });
      });

      // Step 2: Heat oil/fat based on health mode
      const oilInstruction = healthMode === 'Keto'
        ? (lang === 'te' ? 'పెద్ద పాన్‌లో 2 టేబుల్‌స్పూన్ల వెన్న వేడి చేయండి మధ్యం వేడిపై. వెన్న కరిగి నురుగు వచ్చే వరకు వేడి చేయండి కానీ గోధుమ రంగు రాకూడదు.' : 'Heat 2 tablespoons of butter in a large pan over medium heat. Let butter melt and foam but not brown.')
        : healthMode === 'WeightLoss'
          ? (lang === 'te' ? 'పాన్‌ను మధ్యం వేడిపై వేడి చేయండి. ఆలివ్ నూనె స్ప్రే 3 సార్లు స్ప్రే చేయండి పాన్ అంతటా సమానంగా.' : 'Heat pan over medium heat. Spray olive oil spray 3 times evenly across the pan surface.')
          : (lang === 'te' ? 'పెద్ద పాన్ లేదా వోక్‌లో 2 టేబుల్‌స్పూన్ల నూనె వేడి చేయండి మధ్యం-అధిక వేడిపై. నూనె మెరుస్తున్నప్పుడు కానీ పొగ రాకుండా ఉండే వరకు వేడి చేయండి.' : 'Heat 2 tablespoons of oil in a large pan or wok over medium-high heat. Let the oil heat until it shimmers but does not smoke.');

      dynamicSteps.push({
        stepNumber: stepNum++,
        instruction: oilInstruction,
        duration: 2
      });

      // Step 3: Cook each ingredient with specific techniques
      ingredients.forEach((ing) => {
        const instructions = getIngredientInstructions(ing, lang);
        dynamicSteps.push({
          stepNumber: stepNum++,
          instruction: instructions.cook,
          duration: instructions.duration
        });
      });

      // Step 4: Season with details
      dynamicSteps.push({
        stepNumber: stepNum++,
        instruction: lang === 'te'
          ? '1 టీస్పూన్ ఉప్పు జోడించండి (లేదా రుచికి అనుగుణంగా సర్దుబాటు చేయండి). అన్ని పదార్థాలలో మసాలా సమానంగా పంపిణీ చేయబడేలా బాగా కలపండి. రుచి చూసి అవసరమైతే మరింత ఉప్పు జోడించండి.'
          : 'Add 1 teaspoon of salt (or adjust to taste). Mix everything thoroughly to ensure the seasoning is evenly distributed. Taste and add more salt if needed. You can also add other spices or herbs at this stage.',
        duration: 2
      });

      // Step 5: Final cooking
      dynamicSteps.push({
        stepNumber: stepNum++,
        instruction: lang === 'te'
          ? 'అన్ని పదార్థాలు బాగా కలిసిపోయేలా మరో 2-3 నిమిషాలు వండండి. రుచులు కలిసిపోవడానికి అనుమతించండి. అన్నీ వేడిగా మరియు బాగా వండినట్లు నిర్ధారించుకోండి.'
          : 'Continue cooking for another 2-3 minutes, allowing all ingredients to blend together well. Let the flavors meld and ensure everything is hot and thoroughly cooked.',
        duration: 3
      });

      // Step 6: Serve with presentation tips
      dynamicSteps.push({
        stepNumber: stepNum++,
        instruction: lang === 'te'
          ? `వేడి నుండి తొలగించి, సర్వింగ్ డిష్‌కు బదిలీ చేయండి. వేడిగా వెంటనే సర్వ్ చేయండి. అందుబాటులో ఉంటే తాజా మూలికలు లేదా నిమ్మ ముక్కలతో అలంకరించండి. ఈ వంటకం ${servings} మందికి సరిపోతుంది. ఆనందించండి!`
          : `Remove from heat and transfer to a serving dish. Serve immediately while hot for the best taste. Garnish with fresh herbs or lemon wedges if available. This dish serves ${servings} people. Enjoy!`,
        duration: 2
      });



      // Calculate realistic cooking times based on ingredients
      const prepTime = 5 + (ingredients.length * 2); // 5 base + 2 min per ingredient
      const cookTime = 2 + (ingredients.length * 5) + 5; // 2 for oil + 5 per ingredient + 5 for seasoning/final

      // Create health mode-specific descriptions
      let healthDescription = '';
      switch (healthMode) {
        case 'Keto':
          healthDescription = lang === 'te'
            ? 'కీటో డైట్ కోసం అధిక కొవ్వు, తక్కువ కార్బోహైడ్రేట్ వంటకం. వెన్న మరియు చీజ్‌తో సమృద్ధిగా.'
            : 'High-fat, low-carb recipe for Keto diet. Rich with butter and cheese for sustained energy.';
          break;
        case 'Diabetic':
          healthDescription = lang === 'te'
            ? 'డయాబెటిక్ స్నేహపూర్వక వంటకం. తక్కువ చక్కెర, ఆలివ్ నూనె మరియు వెల్లుల్లితో ఆరోగ్యకరమైనది.'
            : 'Diabetic-friendly recipe. Low sugar, healthy with olive oil and garlic for better blood sugar control.';
          break;
        case 'HighProtein':
          healthDescription = lang === 'te'
            ? 'అధిక ప్రోటీన్ వంటకం. పెసలు జోడించి కండరాల పెరుగుదలకు మరియు శక్తికి.'
            : 'High-protein recipe. Added lentils for muscle growth and sustained energy throughout the day.';
          break;
        case 'WeightLoss':
          healthDescription = lang === 'te'
            ? 'బరువు తగ్గడానికి తక్కువ కేలరీ వంటకం. కూరగాయలు మరియు నిమ్మరసంతో తేలికైనది.'
            : 'Low-calorie recipe for weight loss. Light with vegetables and lemon juice for maximum nutrition, minimum calories.';
          break;
        default:
          healthDescription = lang === 'te'
            ? `${ingredients.join(', ')} ఉపయోగించి త్వరగా మరియు సులభంగా వంటకం`
            : `A quick and easy recipe using ${ingredients.join(', ')}`;
      }

      generatedRecipe = {
        ...template,
        title: `${healthMode !== 'Normal' ? healthMode + ' ' : ''}${template.title} with ${ingredients.join(', ')}`,
        description: healthDescription,
        ingredients: dynamicIngredients,
        steps: dynamicSteps,
        prepTime: prepTime,
        cookTime: cookTime,
      };
    }

    // Save to Realtime Database
    const recipe = await db.createDoc(db.paths.recipes, {
      userId: req.userId,
      title: generatedRecipe.title,
      description: generatedRecipe.description || '',
      difficulty: generatedRecipe.difficulty,
      prepTime: generatedRecipe.prepTime,
      cookTime: generatedRecipe.cookTime,
      servings,
      estimatedCost: generatedRecipe.estimatedCost,
      healthMode,
      wasteSavings: generatedRecipe.wasteSavings,
      generatedByAI: true,
      ingredients: generatedRecipe.ingredients || [],
      steps: generatedRecipe.steps || [],
      nutrition: generatedRecipe.nutrition || null,
    });

    apiResponse(res, 201, true, 'Recipe generated successfully', recipe);
  } catch (error) {
    next(error);
  }
};

const getSubstitutes = async (req, res, next) => {
  try {
    const { missingIngredient, availableIngredients, dishType = 'general' } = req.body;

    if (!missingIngredient || !availableIngredients) {
      return apiResponse(res, 400, false, 'Missing required fields');
    }

    try {
      const substitutes = await aiService.getSubstitutes(
        missingIngredient,
        availableIngredients,
        dishType
      );
      apiResponse(res, 200, true, 'Substitutes found', substitutes);
    } catch (error) {
      // Fallback substitutes
      const commonSubstitutes = {
        milk: ['almond milk', 'soy milk', 'coconut milk'],
        butter: ['oil', 'margarine', 'ghee'],
        egg: ['flax egg', 'chia egg', 'applesauce'],
        sugar: ['honey', 'maple syrup', 'stevia'],
      };

      const subs = commonSubstitutes[missingIngredient.toLowerCase()] || ['similar ingredient'];
      apiResponse(res, 200, true, 'Substitutes found (fallback)', { substitutes: subs });
    }
  } catch (error) {
    next(error);
  }
};

const getNutrition = async (req, res, next) => {
  try {
    const { ingredients, servings = 1 } = req.body;

    if (!ingredients || ingredients.length === 0) {
      return apiResponse(res, 400, false, 'At least one ingredient is required');
    }

    try {
      const nutrition = await aiService.estimateNutrition(ingredients, servings);
      apiResponse(res, 200, true, 'Nutrition estimated', nutrition);
    } catch (error) {
      // Fallback nutrition estimate
      const estimate = {
        calories: 250 * servings,
        protein: 15 * servings,
        fat: 10 * servings,
        carbs: 30 * servings,
        fiber: 5 * servings,
      };
      apiResponse(res, 200, true, 'Nutrition estimated (fallback)', estimate);
    }
  } catch (error) {
    next(error);
  }
};

const scaleRecipe = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newServings } = req.body;

    if (!newServings || newServings < 1 || newServings > 10) {
      return apiResponse(res, 400, false, 'Servings must be between 1 and 10');
    }

    const recipe = await db.getDocById(db.paths.recipes, id);

    if (!recipe) {
      return apiResponse(res, 404, false, 'Recipe not found');
    }

    const scale = newServings / recipe.servings;

    const scaledRecipe = {
      ...recipe,
      servings: newServings,
      ingredients: recipe.ingredients.map((ing) => ({
        ...ing,
        quantity: ing.quantity * scale,
      })),
      nutrition: recipe.nutrition
        ? {
          calories: recipe.nutrition.calories * scale,
          protein: recipe.nutrition.protein * scale,
          fat: recipe.nutrition.fat * scale,
          carbs: recipe.nutrition.carbs * scale,
          fiber: recipe.nutrition.fiber * scale,
        }
        : null,
      estimatedCost: recipe.estimatedCost ? recipe.estimatedCost * scale : null,
    };

    apiResponse(res, 200, true, 'Recipe scaled successfully', scaledRecipe);
  } catch (error) {
    next(error);
  }
};

const convertCuisine = async (req, res, next) => {
  try {
    const { recipeId, targetCuisine } = req.body;

    if (!recipeId || !targetCuisine) {
      return apiResponse(res, 400, false, 'Recipe ID and target cuisine are required');
    }

    const recipe = await db.getDocById(db.paths.recipes, recipeId);

    if (!recipe) {
      return apiResponse(res, 404, false, 'Recipe not found');
    }

    try {
      const convertedRecipe = await aiService.convertCuisine(recipe, targetCuisine);
      apiResponse(res, 200, true, 'Recipe converted successfully', convertedRecipe);
    } catch (error) {
      // Return original recipe with cuisine type updated
      const updated = {
        ...recipe,
        cuisineType: targetCuisine,
        title: `${targetCuisine} Style ${recipe.title}`,
      };
      apiResponse(res, 200, true, 'Recipe converted (fallback)', updated);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRecipes,
  searchRecipes,
  getRecipeById,
  generateRecipe,
  getSubstitutes,
  getNutrition,
  scaleRecipe,
  convertCuisine,
};

