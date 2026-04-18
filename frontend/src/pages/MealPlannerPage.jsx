import React, { useState } from 'react';
import { mealPlanService } from '../services/apiService';
import toast from 'react-hot-toast';

const PLAN_TYPES = [
  { id: 'Healthy', label: '🥗 Healthy', desc: 'Balanced, nutritious meals for everyday wellness', color: 'from-green-500 to-emerald-600' },
  { id: 'Diet', label: '⚖️ Diet / Weight Loss', desc: 'Low calorie, high fiber to help you reach your goals', color: 'from-blue-500 to-cyan-600' },
  { id: 'HighProtein', label: '💪 High Protein', desc: 'Protein-rich meals for muscle building & recovery', color: 'from-orange-500 to-red-600' },
  { id: 'Keto', label: '🥑 Keto', desc: 'Low carb, high fat meals for ketogenic lifestyle', color: 'from-yellow-500 to-amber-600' },
  { id: 'Diabetic', label: '🩺 Diabetic Friendly', desc: 'Low glycemic index meals for blood sugar control', color: 'from-purple-500 to-violet-600' },
  { id: 'Vegetarian', label: '🌿 Vegetarian', desc: 'Plant-based meals packed with nutrients', color: 'from-teal-500 to-green-600' },
  { id: 'Vegan', label: '🌱 Vegan', desc: 'Entirely plant-based, no animal products', color: 'from-lime-500 to-green-600' },
  { id: 'Custom', label: '✨ Custom / Mixed', desc: 'Variety of cuisines and meal styles', color: 'from-pink-500 to-rose-600' },
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEAL_COLORS = {
  breakfast: { bg: 'bg-blue-50 dark:bg-blue-900/20', badge: 'bg-blue-100 text-blue-700', icon: '🌅' },
  lunch:     { bg: 'bg-green-50 dark:bg-green-900/20', badge: 'bg-green-100 text-green-700', icon: '☀️' },
  dinner:    { bg: 'bg-orange-50 dark:bg-orange-900/20', badge: 'bg-orange-100 text-orange-700', icon: '🌙' },
  snack:     { bg: 'bg-purple-50 dark:bg-purple-900/20', badge: 'bg-purple-100 text-purple-700', icon: '🍎' },
};

const MealPlannerPage = () => {
  const [step, setStep] = useState('select'); // 'select' | 'config' | 'result'
  const [planType, setPlanType] = useState(null);
  const [servings, setServings] = useState(2);
  const [selectedWeek, setSelectedWeek] = useState(new Date().toISOString().split('T')[0]);
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSelectPlan = (type) => {
    setPlanType(type);
    setStep('config');
  };

  const generateMealPlan = async () => {
    setLoading(true);
    try {
      const response = await mealPlanService.generateMealPlan(selectedWeek, servings, planType.id);
      if (response.data && response.data.data) {
        setMealPlan(response.data.data);
        setStep('result');
        toast.success(`${planType.label} meal plan generated! 🎉`);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error generating meal plan:', error);
      toast.error('Failed to generate meal plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetPlanner = () => {
    setStep('select');
    setPlanType(null);
    setMealPlan(null);
  };

  // Build a day-keyed map from the meals array
  const buildDayMap = (meals) => {
    const map = {};
    (meals || []).forEach(meal => {
      const dayIdx = parseInt(meal.dayOfWeek);
      if (!map[dayIdx]) map[dayIdx] = {};
      map[dayIdx][meal.mealType] = meal.recipeTitle;
    });
    return map;
  };

  // ─── STEP 1: Select Plan Type ──────────────────────────────────────────────
  if (step === 'select') {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-3">📅 Weekly Meal Planner</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">What kind of meal plan are you looking for?</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PLAN_TYPES.map(type => (
            <button
              key={type.id}
              onClick={() => handleSelectPlan(type)}
              className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-left"
            >
              <div className={`bg-gradient-to-br ${type.color} p-5 h-full`}>
                <p className="text-white text-xl font-bold mb-2">{type.label}</p>
                <p className="text-white/80 text-sm leading-snug">{type.desc}</p>
                <div className="mt-4 flex justify-end">
                  <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full group-hover:bg-white/30 transition-colors">
                    Select →
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ─── STEP 2: Configure & Generate ─────────────────────────────────────────
  if (step === 'config') {
    return (
      <div className="max-w-xl mx-auto px-4 py-16">
        <button onClick={() => setStep('select')} className="text-sm text-gray-400 hover:text-gray-600 mb-6 inline-flex items-center gap-1">
          ← Back to plan types
        </button>

        <div className={`bg-gradient-to-br ${planType.color} rounded-2xl p-6 text-white mb-8 shadow-lg`}>
          <p className="text-3xl font-extrabold">{planType.label}</p>
          <p className="mt-1 text-white/80">{planType.desc}</p>
        </div>

        <div className="card space-y-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Configure Your Plan</h2>

          <div>
            <label className="label">Week Starting</label>
            <input
              type="date"
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="label">Number of Servings per Meal</label>
            <div className="flex items-center gap-4 mt-2">
              <button
                onClick={() => setServings(Math.max(1, servings - 1))}
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-xl font-bold hover:bg-gray-200 transition"
              >−</button>
              <span className="text-2xl font-bold w-8 text-center text-gray-800 dark:text-white">{servings}</span>
              <button
                onClick={() => setServings(Math.min(10, servings + 1))}
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-xl font-bold hover:bg-gray-200 transition"
              >+</button>
            </div>
            <p className="text-xs text-gray-400 mt-1">Each meal will be sized for {servings} person{servings > 1 ? 's' : ''}</p>
          </div>

          <button
            onClick={generateMealPlan}
            disabled={loading}
            className="btn-primary w-full text-lg py-3 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Generating AI Plan…
              </span>
            ) : '✨ Generate My Meal Plan'}
          </button>
        </div>
      </div>
    );
  }

  // ─── STEP 3: Result Grid ───────────────────────────────────────────────────
  const dayMap = mealPlan ? buildDayMap(mealPlan.meals) : {};
  const totalMeals = Object.values(dayMap).reduce((acc, d) => acc + Object.keys(d).length, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            {planType.label} — Weekly Plan
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {servings} serving{servings > 1 ? 's' : ''} · Week of {new Date(selectedWeek).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            {' · '}{totalMeals} meals planned
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={generateMealPlan}
            disabled={loading}
            className="btn-primary disabled:opacity-60"
          >
            {loading ? '⏳ Regenerating…' : '🔄 Regenerate'}
          </button>
          <button
            onClick={resetPlanner}
            className="btn-secondary"
          >
            ← New Plan
          </button>
        </div>
      </div>

      {/* Plan type badge */}
      <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${planType.color} text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6 shadow`}>
        {planType.label} Plan
      </div>

      {/* Day Grid */}
      <div className="grid xl:grid-cols-7 md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
        {DAYS.map((day, idx) => {
          const dayMeals = dayMap[idx] || {};
          return (
            <div key={idx} className="card p-4 flex flex-col gap-3 min-w-0">
              <h3 className="font-bold text-center text-sm text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700 pb-2">
                {day}
              </h3>
              {['breakfast', 'lunch', 'dinner', 'snack'].map(mealType => {
                const col = MEAL_COLORS[mealType];
                const recipe = dayMeals[mealType];
                return (
                  <div key={mealType} className={`${col.bg} rounded-xl p-3`}>
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${col.badge} mb-1`}>
                      {col.icon} {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                    </span>
                    <p className="text-xs text-gray-700 dark:text-gray-200 leading-snug mt-1 font-medium">
                      {recipe || <span className="text-gray-400 italic">—</span>}
                    </p>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {Object.keys(dayMap).length === 0 && (
        <div className="card text-center py-12 mt-4">
          <p className="text-gray-400 text-lg">No meals found. Try regenerating the plan.</p>
        </div>
      )}
    </div>
  );
};

export default MealPlannerPage;
