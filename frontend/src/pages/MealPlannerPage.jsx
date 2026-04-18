import React, { useState } from 'react';
import { mealPlanService } from '../services/apiService';
import toast from 'react-hot-toast';

const PLAN_TYPES = [
  { id: 'Healthy',     label: '🥗 Healthy',           desc: 'Balanced, nutritious meals for everyday wellness',       color: 'from-green-500 to-emerald-600' },
  { id: 'Diet',        label: '⚖️ Diet / Weight Loss', desc: 'Low calorie, high fiber to help you reach your goals',  color: 'from-blue-500 to-cyan-600'    },
  { id: 'HighProtein', label: '💪 High Protein',       desc: 'Protein-rich meals for muscle building & recovery',     color: 'from-orange-500 to-red-600'   },
  { id: 'Keto',        label: '🥑 Keto',               desc: 'Low carb, high fat meals for ketogenic lifestyle',      color: 'from-yellow-500 to-amber-600' },
  { id: 'Diabetic',    label: '🩺 Diabetic Friendly',  desc: 'Low glycemic index meals for blood sugar control',      color: 'from-purple-500 to-violet-600'},
  { id: 'Vegetarian',  label: '🌿 Vegetarian',         desc: 'Plant-based meals packed with nutrients',               color: 'from-teal-500 to-green-600'   },
  { id: 'Vegan',       label: '🌱 Vegan',              desc: 'Entirely plant-based, no animal products',              color: 'from-lime-500 to-green-600'   },
  { id: 'Custom',      label: '✨ Custom / Mixed',      desc: 'Variety of cuisines and meal styles',                   color: 'from-pink-500 to-rose-600'    },
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const MEAL_COLORS = {
  breakfast: { bg: 'bg-blue-100',   border: 'border-blue-300',   badge: 'bg-blue-600 text-white',    icon: '🌅' },
  lunch:     { bg: 'bg-green-100',  border: 'border-green-300',  badge: 'bg-green-600 text-white',   icon: '☀️' },
  dinner:    { bg: 'bg-orange-100', border: 'border-orange-300', badge: 'bg-orange-500 text-white',  icon: '🌙' },
  snack:     { bg: 'bg-purple-100', border: 'border-purple-300', badge: 'bg-purple-600 text-white',  icon: '🍎' },
};

const MealPlannerPage = () => {
  const [step, setStep] = useState('select');
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

  const buildDayMap = (meals) => {
    const map = {};
    (meals || []).forEach(meal => {
      const dayIdx = parseInt(meal.dayOfWeek);
      if (!map[dayIdx]) map[dayIdx] = {};
      map[dayIdx][meal.mealType] = meal.recipeTitle;
    });
    return map;
  };

  /* ─── STEP 1: Select Plan Type ─────────────────────────────────────── */
  if (step === 'select') {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 style={{ color: '#111827' }} className="text-4xl font-extrabold mb-3">
            📅 Weekly Meal Planner
          </h1>
          <p style={{ color: '#374151' }} className="text-lg font-medium">
            What kind of meal plan are you looking for?
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PLAN_TYPES.map(type => (
            <button
              key={type.id}
              onClick={() => handleSelectPlan(type)}
              className={`group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-left bg-gradient-to-br ${type.color}`}
            >
              <div className="p-5 h-full">
                <p className="text-white text-xl font-extrabold mb-2 drop-shadow">{type.label}</p>
                <p className="text-white font-semibold text-sm leading-snug opacity-90">{type.desc}</p>
                <div className="mt-4 flex justify-end">
                  <span className="bg-white/25 text-white text-xs font-bold px-3 py-1 rounded-full group-hover:bg-white/40 transition-colors">
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

  /* ─── STEP 2: Configure & Generate ────────────────────────────────── */
  if (step === 'config') {
    return (
      <div className="max-w-xl mx-auto px-4 py-12">
        <button
          onClick={() => setStep('select')}
          style={{ color: '#374151' }}
          className="text-sm font-semibold hover:underline mb-6 inline-flex items-center gap-1"
        >
          ← Back to plan types
        </button>

        {/* Plan banner */}
        <div className={`bg-gradient-to-br ${planType.color} rounded-2xl p-6 text-white mb-8 shadow-lg`}>
          <p className="text-3xl font-extrabold drop-shadow">{planType.label}</p>
          <p className="mt-1 text-white font-semibold opacity-90">{planType.desc}</p>
        </div>

        {/* Config card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 space-y-7">
          <h2 style={{ color: '#111827' }} className="text-xl font-extrabold">
            Configure Your Plan
          </h2>

          <div>
            <label style={{ color: '#1f2937' }} className="block text-sm font-bold mb-1">
              Week Starting
            </label>
            <input
              type="date"
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              style={{ color: '#111827' }}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg font-medium focus:outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label style={{ color: '#1f2937' }} className="block text-sm font-bold mb-2">
              Servings per Meal
            </label>
            <div className="flex items-center gap-5">
              <button
                onClick={() => setServings(Math.max(1, servings - 1))}
                className="w-10 h-10 rounded-full bg-gray-200 text-gray-900 text-xl font-extrabold hover:bg-gray-300 transition flex items-center justify-center"
              >−</button>
              <span style={{ color: '#111827' }} className="text-2xl font-extrabold w-8 text-center">{servings}</span>
              <button
                onClick={() => setServings(Math.min(10, servings + 1))}
                className="w-10 h-10 rounded-full bg-gray-200 text-gray-900 text-xl font-extrabold hover:bg-gray-300 transition flex items-center justify-center"
              >+</button>
            </div>
            <p style={{ color: '#4b5563' }} className="text-xs font-medium mt-2">
              Each meal will be sized for {servings} person{servings > 1 ? 's' : ''}
            </p>
          </div>

          <button
            onClick={generateMealPlan}
            disabled={loading}
            className="btn-primary w-full text-base font-bold py-3 disabled:opacity-60 disabled:cursor-not-allowed"
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

  /* ─── STEP 3: Result Grid ──────────────────────────────────────────── */
  const dayMap = mealPlan ? buildDayMap(mealPlan.meals) : {};
  const totalMeals = Object.values(dayMap).reduce((acc, d) => acc + Object.keys(d).length, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div>
          <h1 style={{ color: '#111827' }} className="text-3xl font-extrabold">
            {planType.label} — Weekly Plan
          </h1>
          <p style={{ color: '#374151' }} className="text-sm font-semibold mt-1">
            {servings} serving{servings > 1 ? 's' : ''} &nbsp;·&nbsp;
            Week of {new Date(selectedWeek).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            &nbsp;·&nbsp; {totalMeals} meals planned
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={generateMealPlan}
            disabled={loading}
            className="btn-primary disabled:opacity-60 font-bold"
          >
            {loading ? '⏳ Regenerating…' : '🔄 Regenerate'}
          </button>
          <button onClick={resetPlanner} className="btn-secondary font-bold">
            ← New Plan
          </button>
        </div>
      </div>

      {/* Plan badge */}
      <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${planType.color} text-white text-sm font-bold px-4 py-1.5 rounded-full mb-6 shadow`}>
        {planType.label} Plan
      </div>

      {/* Day grid */}
      <div className="grid xl:grid-cols-7 md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
        {DAYS.map((day, idx) => {
          const dayMeals = dayMap[idx] || {};
          return (
            <div key={idx} className="bg-white rounded-2xl shadow border border-gray-200 p-4 flex flex-col gap-3">

              {/* Day header */}
              <h3
                style={{ color: '#111827' }}
                className="font-extrabold text-center text-sm border-b border-gray-300 pb-2 tracking-wide"
              >
                {day}
              </h3>

              {['breakfast', 'lunch', 'dinner', 'snack'].map(mealType => {
                const col = MEAL_COLORS[mealType];
                const recipe = dayMeals[mealType];
                return (
                  <div
                    key={mealType}
                    className={`${col.bg} border ${col.border} rounded-xl p-3`}
                  >
                    {/* Meal type badge */}
                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${col.badge} mb-2`}>
                      {col.icon} {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                    </span>

                    {/* Recipe name — always dark */}
                    <p style={{ color: '#111827' }} className="text-xs font-bold leading-snug">
                      {recipe || <span style={{ color: '#9ca3af' }} className="italic font-normal">—</span>}
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
        <div className="bg-white rounded-2xl shadow border border-gray-200 text-center py-12 mt-4">
          <p style={{ color: '#374151' }} className="text-lg font-semibold">
            No meals found. Try regenerating the plan.
          </p>
        </div>
      )}
    </div>
  );
};

export default MealPlannerPage;
