const { apiResponse } = require('../utils/response');
const aiService = require('../services/aiService');
const db = require('../services/realtimeDbService');



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

// ---------------------------------------------------------------------------
// Dynamic fallback recipe generator — used only when the AI is unavailable.
// Intelligently handles ingredient compatibility and produces varied output.
// ---------------------------------------------------------------------------
const buildFallbackRecipe = (ingredients, healthMode, servings, language) => {
  const lang = language === 'te' ? 'te' : 'en';
  const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // --- STEP 1: Categorize ingredients and detect incompatible combinations ---
  const categorizeIngredient = (ing) => {
    const lower = ing.toLowerCase();
    
    // Proteins
    if (/chicken|mutton|lamb|beef|pork|fish|prawn|shrimp|egg|paneer|tofu/.test(lower))
      return 'protein';
    
    // Dairy
    if (/milk|yogurt|curd|cream|butter|cheese|ghee/.test(lower))
      return 'dairy';
    
    // Fruits
    if (/banana|mango|apple|orange|grape|berry|strawberry|papaya|guava|pineapple|watermelon/.test(lower))
      return 'fruit';
    
    // Grains
    if (/rice|wheat|oats|quinoa|barley|flour|roti|bread/.test(lower))
      return 'grain';
    
    // Legumes
    if (/dal|lentil|chickpea|bean|pea/.test(lower))
      return 'legume';
    
    // Default to vegetable
    return 'vegetable';
  };

  const categorized = ingredients.map(ing => ({
    name: ing,
    category: categorizeIngredient(ing)
  }));

  // Detect incompatible groups
  const hasProtein = categorized.some(i => i.category === 'protein');
  const hasFruit   = categorized.some(i => i.category === 'fruit');
  const hasDairy   = categorized.some(i => i.category === 'dairy');

  let selectedIngredients;
  let recipeType;

  // Compatibility rules: fruit/dairy + protein = incompatible
  if ((hasFruit || hasDairy) && hasProtein) {
    // Count group sizes
    const fruitDairyCount = categorized.filter(i => i.category === 'fruit' || i.category === 'dairy').length;
    const proteinCount    = categorized.filter(i => i.category === 'protein').length;

    // Pick the larger group
    if (fruitDairyCount >= proteinCount) {
      // Use fruit/dairy group → make shake/smoothie/dessert
      selectedIngredients = categorized.filter(i => i.category !== 'protein');
      recipeType = 'raw'; // no-cook preparation
    } else {
      // Use protein group → make cooked dish
      selectedIngredients = categorized.filter(i => i.category !== 'fruit' && i.category !== 'dairy');
      recipeType = 'cooked';
    }
  } else {
    // All compatible → use everything
    selectedIngredients = categorized;
    recipeType = (hasFruit || hasDairy) ? 'raw' : 'cooked';
  }

  const finalIngredients = selectedIngredients.map(i => i.name);

  // --- STEP 2: Generate recipe based on type (raw vs cooked) ---
  if (recipeType === 'raw') {
    return buildRawRecipe(finalIngredients, healthMode, servings, lang, rand);
  } else {
    return buildCookedRecipe(finalIngredients, healthMode, servings, lang, rand);
  }
};

// --- Build a no-cook recipe (shake, smoothie, lassi, salad) ---
const buildRawRecipe = (ingredients, healthMode, servings, lang, rand) => {
  const mainIngredient = ingredients[0];
  
  const rawTypes = {
    en: ['Smoothie', 'Shake', 'Lassi', 'Drink', 'Bowl'],
    te: ['స్మూతీ', 'షేక్', 'లస్సీ', 'డ్రింక్', 'బౌల్']
  };

  const titlePrefixes = {
    en: ['Refreshing', 'Creamy', 'Chilled', 'Healthy', 'Quick'],
    te: ['తాజా', 'క్రీమీ', 'చల్లని', 'ఆరోగ్యకరమైన', 'త్వరగా']
  };

  const rawType = rand(rawTypes[lang]);
  const prefix  = rand(titlePrefixes[lang]);

  const title = lang === 'te'
    ? `${prefix} ${mainIngredient} ${rawType}`
    : `${prefix} ${mainIngredient} ${rawType}`;

  const description = lang === 'te'
    ? `${ingredients.join(', ')} తో తయారు చేసిన పోషకమైన ${rawType}. వేడి చేయకుండా సిద్ధం.`
    : `A nutritious ${rawType.toLowerCase()} made with ${ingredients.join(', ')}. No cooking required.`;

  const baseIngredients = ingredients.map((ing, idx) => ({
    name: ing,
    quantity: idx === 0 ? 1 : 0.5,
    unit: lang === 'te' ? 'కప్పు' : 'cup'
  }));

  const extraIngredients = [
    { name: lang === 'te' ? 'ఐస్ క్యూబ్స్' : 'ice cubes', quantity: 4, unit: lang === 'te' ? 'ముక్కలు' : 'pieces' },
    { name: lang === 'te' ? 'తేనె' : 'honey', quantity: 1, unit: lang === 'te' ? 'టేబుల్స్పూన్' : 'tbsp' }
  ];

  const steps = [
    {
      stepNumber: 1,
      instruction: lang === 'te'
        ? `అన్ని తాజా పదార్థాలను చల్లని ప్రవహించే నీటి కింద బాగా కడిగి శుభ్రం చేయండి. బ్లెండింగ్ సులభంగా మరియు సమానంగా అవ్వడానికి ముక్కలను సమానమైన చిన్న సైజులో కట్ చేసుకోండి. ప్రారంభించడానికి ముందు మీ బ్లెండర్ జార్ పూర్తిగా శుభ్రంగా, పొడిగా మరియు మునుపటి వాసనలు లేకుండా ఉందో లేదో సరిచూసుకోండి.`
        : `Begin by thoroughly washing all fresh ingredients under cold running water to remove any surface impurities or dirt. Slice or chop the ingredients (especially fruits like bananas, mangoes, or apples) into uniform 1-inch pieces. Ensuring they are small and uniform prevents motor strain on your blender and yields an exceptionally smooth texture. Confirm that your blender jar is clean, odor-free, and securely attached to the motor base.`,
      duration: 3
    },
    {
      stepNumber: 2,
      instruction: lang === 'te'
        ? `బ్లెండర్లో ${ingredients.join(', ')} వేయండి. ఐస్ క్యూబ్స్ మరియు తేనె జోడించండి. తీపి కోసం సహజ తేనెను ఉపయోగించడం వల్ల రుచి అద్భుతంగా ఉంటుంది మరియు పోషకాలు సమృద్ధిగా లభిస్తాయి.`
        : `Place the heavier or frozen ingredients (like ice cubes) at the bottom, followed by the chopped ${ingredients.join(', ')}. Drizzle the liquid honey or pure jaggery syrup evenly over the ingredients for a natural, rich sweetness. Keeping liquid and soft ingredients near the blades ensures that they create a vortex, pulling everything down for an even blend without pockets of unblended food.`,
      duration: 1
    },
    {
      stepNumber: 3,
      instruction: lang === 'te'
        ? `అధిక వేగంలో 1-2 నిమిషాలు బ్లెండ్ చేయండి మృదువైన, క్రీమీ స్థిరత్వం వచ్చే వరకు. బ్లెండర్ తిరగడం కష్టమైతే, అవసరమైతే కొంచెం చల్లటి నీరు లేదా పాలు జోడించండి.`
        : `Secure the blender lid firmly and start blending on low speed for 10 seconds to break down the larger pieces. Gradually increase the speed to high and blend continuously for 1 to 2 minutes until the mixture turns fully liquefied and velvet-smooth. If the mixture is too thick to blend properly, pause the blender and add a splash of cold water or milk to adjust the consistency, then blend again.`,
      duration: 2
    },
    {
      stepNumber: 4,
      instruction: lang === 'te'
        ? `గ్లాసులో పోసి వెంటనే వడ్డించండి. చల్లగా సర్వ్ చేయడం వల్ల రుచి రెట్టింపు అవుతుంది. ఈ పరిమాణం ${servings} మందికి సరిపోతుంది.`
        : `Turn off the blender and carefully pour the luscious, creamy beverage into chilled tall serving glasses. Serve this instantly while it remains icy cold to experience the vibrant, refreshing flavors of ${mainIngredient} at their best. This preparation serves ${servings} people perfectly, making it an excellent nutritious treat.`,
      duration: 1
    }
  ];

  return {
    title,
    description,
    difficulty: 'Easy',
    prepTime: 5,
    cookTime: 0,
    estimatedCost: Math.floor(20 + ingredients.length * 10),
    wasteSavings: Math.floor(5 + Math.random() * 10),
    ingredients: [...baseIngredients, ...extraIngredients],
    steps,
    nutrition: { calories: 150, protein: 5, fat: 2, carbs: 32, fiber: 3 }
  };
};

// --- Build a cooked recipe (curry, stir-fry, etc.) ---
const buildCookedRecipe = (ingredients, healthMode, servings, lang, rand) => {
  const mainIngredient = ingredients[0];

  const cookingMethods = {
    en: [
      { method: 'Stir-fry', oil: 'sesame oil',  verb: 'toss',            heatLevel: 'high'   },
      { method: 'Sauté',    oil: 'olive oil',   verb: 'stir',            heatLevel: 'medium' },
      { method: 'Curry',    oil: 'ghee',        verb: 'simmer',          heatLevel: 'medium' },
      { method: 'Roast',    oil: 'coconut oil', verb: 'bake',            heatLevel: 'high'   },
      { method: 'Tadka',    oil: 'mustard oil', verb: 'temper',          heatLevel: 'medium' },
    ],
    te: [
      { method: 'వేయించడం',  oil: 'నువ్వుల నూనె', verb: 'కలపండి',        heatLevel: 'అధికం'  },
      { method: 'వడకట్టడం', oil: 'ఆలివ్ నూనె',   verb: 'కదిలించండి',    heatLevel: 'మధ్యం'  },
      { method: 'కర్రీ',    oil: 'నెయ్యి',       verb: 'మరగించండి',     heatLevel: 'మధ్యం'  },
      { method: 'వేపుడు',   oil: 'కొబ్బరి నూనె', verb: 'వండండి',        heatLevel: 'అధికం'  },
      { method: 'తడక',      oil: 'ఆవాల నూనె',    verb: 'పోపు పెట్టండి', heatLevel: 'మధ్యం'  },
    ],
  };

  const spiceProfiles = {
    en: [
      { name: 'South Indian',   spices: ['mustard seeds', 'curry leaves', 'turmeric', 'red chilli'] },
      { name: 'North Indian',   spices: ['cumin', 'garam masala', 'coriander powder', 'ginger-garlic paste'] },
      { name: 'Andhra Style',   spices: ['green chilli', 'tamarind', 'turmeric', 'chilli powder'] },
      { name: 'Simple & Light', spices: ['salt', 'pepper', 'cumin', 'lemon juice'] },
      { name: 'Aromatic',       spices: ['cardamom', 'cinnamon', 'cloves', 'bay leaf'] },
    ],
    te: [
      { name: 'దక్షిణ భారత',   spices: ['ఆవాలు', 'కరివేపాకు', 'పసుపు', 'ఎర్ర మిర్చి'] },
      { name: 'ఉత్తర భారత',   spices: ['జీలక్రర', 'గరం మసాలా', 'కొత్తిమీర పొడి', 'అల్లం-వెల్లుల్లి పేస్ట్'] },
      { name: 'ఆంధ్ర స్టైల్', spices: ['పచ్చిమిర్చి', 'చింతపండు', 'పసుపు', 'మిర్చి పొడి'] },
      { name: 'తేలికైన వంటకం', spices: ['ఉప్పు', 'మిరియాలు', 'జీలక్రర', 'నిమ్మరసం'] },
      { name: 'సువాసన',        spices: ['యాలకులు', 'దాల్చిన చెక్క', 'లవంగాలు', 'అల్లం'] },
    ],
  };

  const titlePrefixes = {
    en: ['Quick', 'Spicy', 'Homestyle', 'Classic', 'Easy', 'Rustic', 'Hearty', 'Smoky'],
    te: ['త్వరగా', 'కారంగా', 'ఇంటి స్టైల్', 'క్లాసిక్', 'సులభమైన', 'ఆరోగ్యకరమైన'],
  };

  const chosenMethod   = rand(cookingMethods[lang]);
  const chosenSpices   = rand(spiceProfiles[lang]);
  const titlePrefix    = rand(titlePrefixes[lang]);

  const healthAdditions = {
    Keto:        { en: [{ name: 'butter',     quantity: 2,   unit: 'tbsp'   }, { name: 'cheese',     quantity: 30,  unit: 'g'    }],
                   te: [{ name: 'వెన్న',       quantity: 2,   unit: 'టేబుల్స్పూన్లు' }, { name: 'చీజ్',       quantity: 30,  unit: 'గ్రాములు' }] },
    Diabetic:    { en: [{ name: 'olive oil',  quantity: 1,   unit: 'tbsp'   }, { name: 'garlic',     quantity: 2,   unit: 'cloves'}],
                   te: [{ name: 'ఆలివ్ నూనె', quantity: 1,   unit: 'టేబుల్స్పూన్'  }, { name: 'వెల్లుల్లి', quantity: 2,   unit: 'రెబ్బలు'  }] },
    HighProtein: { en: [{ name: 'lentils',    quantity: 0.5, unit: 'cup'    }, { name: 'chickpeas',  quantity: 0.5, unit: 'cup'  }],
                   te: [{ name: 'పెసలు',       quantity: 0.5, unit: 'కప్పు'  }, { name: 'శనగలు',     quantity: 0.5, unit: 'కప్పు' }] },
    WeightLoss:  { en: [{ name: 'lemon juice',quantity: 1,   unit: 'tbsp'   }, { name: 'spinach',    quantity: 1,   unit: 'cup'  }],
                   te: [{ name: 'నిమ్మరసం',   quantity: 1,   unit: 'టేబుల్స్పూన్'  }, { name: 'పాలకూర',    quantity: 1,   unit: 'కప్పు' }] },
    Normal:      { en: [], te: [] },
  };

  const baseIngredients = ingredients.map((ing, idx) => ({
    name: ing,
    quantity: idx === 0 ? (Math.floor(Math.random() * 2) + 1) * 100 : Math.floor(Math.random() * 3) + 1,
    unit: idx === 0 ? (lang === 'te' ? 'గ్రాములు' : 'grams') : (lang === 'te' ? 'ముక్కలు' : 'pieces'),
  }));

  const spiceIngredients = chosenSpices.spices.map((s) => ({
    name: s, quantity: Math.random() > 0.5 ? 1 : 0.5, unit: lang === 'te' ? 'టీస్పూన్' : 'tsp',
  }));

  const oilIngredient    = [{ name: chosenMethod.oil, quantity: 2, unit: lang === 'te' ? 'టేబుల్స్పూన్లు' : 'tbsp' }];
  const extraIngredients = (healthAdditions[healthMode] || healthAdditions.Normal)[lang];
  const allIngredients   = [...baseIngredients, ...oilIngredient, ...spiceIngredients, ...extraIngredients];

  const steps = [];
  let n = 1;

  const prepDetails = {
    en: [
      `Begin by thoroughly washing all ingredients under cold running water. Carefully chop them into uniform, bite-sized pieces so they cook evenly throughout the process. Gently pat dry with a clean kitchen towel to remove excess surface moisture, which prevents steaming and ensures a beautiful, golden-brown sear.`,
      `Rinse the ${mainIngredient} and associated vegetables thoroughly under running water. Slice them into clean, equal-sized pieces to ensure consistent heat absorption during cooking. Keep each ingredient separated on a clean prep board so they can be added at their respective steps.`,
      `Prepare all ingredients before lighting the stove (mise en place). Finely chop the ${mainIngredient}, mince the aromatics like garlic and ginger, and measure out your dry spices into a small bowl. This prep work ensures you cook stress-free and prevents spices from burning while you chop.`,
    ],
    te: [
      `అన్ని పదార్థాలను చల్లని నీటిలో కడిగి శుభ్రం చేయండి. సమానంగా వండటానికి వాటన్నింటినీ చిన్న సమాన ముక్కలుగా కట్ చేసుకోండి. కిచెన్ టవల్తో పొడిగా తుడవండి, ఇది వంట చేసేటప్పుడు అదనపు తేమను నివారించి అద్భుతమైన రుచిని ఇస్తుంది.`,
      `${mainIngredient} ను బాగా కడిగి ముక్కలుగా కోయండి. సమాన ముక్కలు కావడం వల్ల ఉష్ణోగ్రత సమానంగా వ్యాపించి ప్రతి ముక్కా చక్కగా ఉడుకుతుంది. వండే ముందు అన్ని సిద్ధం చేసుకోండి.`,
      `వండటం ప్రారంభించే ముందు అన్ని పదార్థాలు సిద్ధం చేయండి. ${mainIngredient} ను ముక్కలుగా కోసి, అల్లం-వెల్లుల్లి పేస్ట్ సిద్ధం చేసుకుని, మసాలాలను ఒక గిన్నెలో కొలిచి పెట్టుకోండి. ఇది వండేటప్పుడు సమయాన్ని ఆదా చేస్తుంది.`,
    ],
  };
  steps.push({ stepNumber: n++, instruction: rand(prepDetails[lang]), duration: 5 });

  const heatSteps = {
    en: [
      `Heat ${chosenMethod.oil} in a wide, heavy-bottomed pan over ${chosenMethod.heatLevel} heat. Allow the oil to heat until it shimmers and moves fluidly across the pan. A faint, gentle heat rising from the surface indicates it is ready — adding ingredients to cold oil will make them greasy and soggy.`,
      `Warm the ${chosenMethod.oil} in a solid, heavy pan. Let it reach the optimal temperature gradually; this forms the crucial flavorful foundation of the entire dish, sealing in the juices of your ingredients as soon as they hit the pan.`,
    ],
    te: [
      `ఒక వెడల్పైన పాన్లో ${chosenMethod.oil} వేడి చేయండి. నూనె మెరిసే వరకు వేచి ఉండండి. నూనె సరైన వేడికి రావడం వల్ల పదార్థాలు పాన్ కు అంటుకోకుండా త్వరగా వేగుతాయి.`,
      `భారమైన అడుగున్న పాన్లో ${chosenMethod.oil} వేడి చేయండి. ఏదైనా వేసే ముందు సరైన ఉష్ణోగ్రతకు చేరుకోనివ్వండి, ఇది వంటకానికి సరైన పునాదిని ఇస్తుంది.`,
    ],
  };
  steps.push({ stepNumber: n++, instruction: rand(heatSteps[lang]), duration: 2 });

  const temperSteps = {
    en: [
      `Carefully add the whole ${chosenSpices.spices.slice(0, 2).join(' and ')} into the shimmering oil. Let them sizzle and splutter for 30 seconds to bloom their volatile oils and infuse the cooking fat with a deep, aromatic base. Watch closely so they do not darken or burn, which would turn the dish bitter.`,
      `Toss in ${chosenSpices.spices.slice(0, 2).join(', ')} into the pan. Stir constantly for 20 to 30 seconds until a rich, roasted fragrance fills your kitchen, signaling that the spices have opened up and are ready for the main ingredients.`,
    ],
    te: [
      `వేడి నూనెలో ${chosenSpices.spices.slice(0, 2).join(' మరియు ')} వేయండి. 30 సెకన్లు చిటపటలాడేలా వదిలివేయండి, ఇది సువాసన నూనెలోకి చేరేలా చేస్తుంది. మసాలాలు మాడిపోకుండా జాగ్రత్తపడండి.`,
      `${chosenSpices.spices.slice(0, 2).join(', ')} వేసి నిరంతరం కదిలిస్తూ 20–30 సెకన్లు మంచి సువాసన వచ్చే వరకు వేయించండి.`,
    ],
  };
  steps.push({ stepNumber: n++, instruction: rand(temperSteps[lang]), duration: 1 });

  ingredients.forEach((ing) => {
    const cookVariants = {
      en: [
        `Gently slide in the ${ing} and perform a swift ${chosenMethod.verb} over ${chosenMethod.heatLevel} heat for ${4 + Math.floor(Math.random() * 4)} minutes. Keep the food moving to prevent burning, cooking until they develop a beautiful golden exterior and are tender inside.`,
        `Introduce the ${ing} to the seasoned pan. Let them cook undisturbed for 2 minutes to develop a savory seared crust, then ${chosenMethod.verb} every minute for another ${3 + Math.floor(Math.random() * 3)} minutes until cooked through and tender.`,
        `Add the ${ing} directly to the pan. ${chosenMethod.verb} continuously with a spatula to ensure nothing sticks to the bottom. Cook for ${5 + Math.floor(Math.random() * 4)} minutes until the raw edge of the ingredient is completely replaced by cooked sweetness.`,
      ],
      te: [
        `${ing} వేసి ${chosenMethod.heatLevel} వేడిపై ${4 + Math.floor(Math.random() * 4)} నిమిషాలు ${chosenMethod.verb}. ముక్కలు ప్రతి వైపూ సమానంగా వేగేలా కలపండి.`,
        `${ing} పాన్లో వేయండి. 2 నిమిషాలు కదలించకుండా వదలండి, తర్వాత ${3 + Math.floor(Math.random() * 3)} నిమిషాలు ${chosenMethod.verb}.`,
        `${ing} వేసి అంటుకోకుండా నిరంతరం ${chosenMethod.verb}. పచ్చి వాసన పూర్తిగా పోయే వరకు ${5 + Math.floor(Math.random() * 4)} నిమిషాలు వండండి.`,
      ],
    };
    steps.push({ stepNumber: n++, instruction: rand(cookVariants[lang]), duration: 5 + Math.floor(Math.random() * 4) });
  });

  const finalSpiceSteps = {
    en: [
      `Sprinkle the ground ${chosenSpices.spices.slice(2).join(', ')} evenly over the cooking ingredients. Turn down the heat slightly and toss well to coat every single piece with the spice layer. Sauté for 1 more minute to cook off the raw spice taste, then sample a small piece to adjust the salt to your liking.`,
      `Reduce the flame and stir in the remaining dry spices: ${chosenSpices.spices.slice(2).join(', ')}. Mix thoroughly for 1 minute, letting the ambient heat blend the spices into the main ingredients without scorching them.`,
    ],
    te: [
      `${chosenSpices.spices.slice(2).join(', ')} వేసి అన్నీ సమానంగా కలపండి. 1 నిమిషం తక్కువ మంటపై వండి ఉప్పు సరిచూసుకోండి.`,
      `మిగిలిన మసాలాలు వేయండి: ${chosenSpices.spices.slice(2).join(', ')}. ప్రతి ముక్కకూ మసాలా అంటుకునేలా బాగా కలపండి.`,
    ],
  };
  steps.push({ stepNumber: n++, instruction: rand(finalSpiceSteps[lang]), duration: 2 });

  const serveSteps = {
    en: [
      `Remove the pan from the heat. Allow the dish to rest covered for 2 minutes; this crucial step lets the residual steam complete the cooking process gently. Garnish with fresh, vibrant coriander leaves and serve warm to ${servings} guests.`,
      `Turn off the heat completely. Squeeze a teaspoon of fresh, zesty lemon juice across the top to brighten the overall flavor profile. Stir once and plate immediately for ${servings} servings.`,
      `Transfer the hot dish into a pre-warmed serving bowl. Drizzle a tiny teardrop of fresh ${chosenMethod.oil} or ghee and sprinkle with fresh green herbs for a spectacular presentation. Best enjoyed while hot. Serves ${servings}.`,
    ],
    te: [
      `వేడి నుండి తొలగించండి. 2 నిమిషాలు మూతపెట్టి ఉంచండి, ఇది మిగిలిన వేడితో ముక్కను మరింత మృదువుగా చేస్తుంది. వేడిగా కొత్తిమీరతో అలంకరించి ${servings} మందికి వడ్డించండి.`,
      `వేడి పూర్తిగా ఆపండి. నిమ్మరసం పిండండి, ఇది తాజాదనాన్ని మరియు అద్భుతమైన రుచిని ఇస్తుంది. వెంటనే ${servings} మందికి వడ్డించండి.`,
    ],
  };
  steps.push({ stepNumber: n++, instruction: rand(serveSteps[lang]), duration: 2 });

  const nutritionMods = {
    Keto:        { calories: 320, protein: 18, fat: 26, carbs: 6,  fiber: 2 },
    Diabetic:    { calories: 180, protein: 14, fat: 6,  carbs: 20, fiber: 7 },
    HighProtein: { calories: 280, protein: 30, fat: 8,  carbs: 22, fiber: 5 },
    WeightLoss:  { calories: 160, protein: 14, fat: 4,  carbs: 18, fiber: 6 },
    Normal:      { calories: 220, protein: 12, fat: 8,  carbs: 28, fiber: 4 },
  };

  const title = lang === 'te'
    ? `${titlePrefix} ${mainIngredient} ${chosenMethod.method}`
    : `${titlePrefix} ${chosenMethod.method} ${mainIngredient}${ingredients.length > 1 ? ' & ' + ingredients.slice(1).join(', ') : ''}`;

  const description = lang === 'te'
    ? `${chosenSpices.name} మసాలాలతో ${mainIngredient} ను ఉపయోగించి వండిన రుచికరమైన వంటకం.${healthMode !== 'Normal' ? ' ' + healthMode + ' డైట్ కోసం అనుకూలంగా మార్చబడింది.' : ''}`
    : `A ${chosenSpices.name} ${chosenMethod.method.toLowerCase()} using ${ingredients.join(', ')}.${healthMode !== 'Normal' ? ` Adapted for a ${healthMode} diet.` : ' Simple, flavourful, and ready in under 30 minutes.'}`;

  return {
    title,
    description,
    difficulty: ingredients.length <= 2 ? 'Easy' : ingredients.length <= 4 ? 'Medium' : 'Hard',
    prepTime:       5 + ingredients.length * 2,
    cookTime:       8 + ingredients.length * 4,
    estimatedCost:  Math.floor(30 + ingredients.length * 15 + Math.random() * 20),
    wasteSavings:   Math.floor(5  + Math.random() * 15),
    ingredients:    allIngredients,
    steps,
    nutrition:      nutritionMods[healthMode] || nutritionMods.Normal,
  };
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
        servings,
        language
      );
    } catch (aiError) {
      console.log('AI service failed, using dynamic fallback:', aiError.message);
      generatedRecipe = buildFallbackRecipe(ingredients, healthMode, servings, language);
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

