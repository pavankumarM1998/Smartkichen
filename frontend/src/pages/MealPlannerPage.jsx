import React, { useState } from 'react';
import { mealPlanService } from '../services/apiService';
import toast from 'react-hot-toast';

const PLAN_TYPES = [
  { id: 'Healthy',     label: '🥗 Healthy',           desc: 'Balanced, nutritious meals for wellness',       color: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: '🥗' },
  { id: 'Diet',        label: '⚖️ Weight Loss',       desc: 'Low calorie, high fiber goals',  color: 'bg-blue-50 text-blue-700 border-blue-100', icon: '⚖️'    },
  { id: 'HighProtein', label: '💪 High Protein',       desc: 'Muscle building & recovery focus',     color: 'bg-orange-50 text-orange-700 border-orange-100', icon: '💪'   },
  { id: 'Keto',        label: '🥑 Keto',               desc: 'Low carb, high fat lifestyle',      color: 'bg-amber-50 text-amber-700 border-amber-100', icon: '🥑' },
  { id: 'Diabetic',    label: '🩺 Diabetic',           desc: 'Blood sugar control meals',      color: 'bg-purple-50 text-purple-700 border-purple-100', icon: '🩺'},
  { id: 'Vegetarian',  label: '🌿 Vegetarian',         desc: 'Plant-based nutrient packed',               color: 'bg-teal-50 text-teal-700 border-teal-100', icon: '🌿'   },
  { id: 'Vegan',       label: '🌱 Vegan',              desc: 'Entirely plant-based meals',              color: 'bg-lime-50 text-lime-700 border-lime-100', icon: '🌱'   },
  { id: 'Custom',      label: '✨ Custom',             desc: 'Variety of cuisine styles',                   color: 'bg-pink-50 text-pink-700 border-pink-100', icon: '✨'    },
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const MEAL_COLORS = {
  breakfast: { bg: 'bg-blue-50/50',   border: 'border-blue-100',   badge: 'bg-blue-100 text-blue-700',    icon: '🌅' },
  lunch:     { bg: 'bg-emerald-50/50',  border: 'border-emerald-100',  badge: 'bg-emerald-100 text-emerald-700',   icon: '☀️' },
  dinner:    { bg: 'bg-orange-50/50', border: 'border-orange-100', badge: 'bg-orange-100 text-orange-700', icon: '🌙' },
  snack:     { bg: 'bg-purple-50/50', border: 'border-purple-100', badge: 'bg-purple-100 text-purple-700', icon: '🍎' },
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
      <div className="page-wide animate-page-enter h-full overflow-hidden flex flex-col !py-0">
        <div className="flex-1 flex flex-col space-y-4 min-h-0">
          <div className="text-left shrink-0">
          <h1 className="text-4xl font-black text-[#111827] leading-tight mb-1 tracking-tighter">
            Weekly <span className="text-[#246A48]">Planner</span> 📅
          </h1>
          <p className="text-[#3a5c51] font-bold uppercase tracking-[0.4em] text-[11px] opacity-60">
            Choose a lifestyle goal and let AI handle the nutrition.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto pr-2 scrollbar-premium flex-1 pb-4">
          {PLAN_TYPES.map((type, idx) => (
            <button
              key={type.id}
              onClick={() => handleSelectPlan(type)}
              className="group card-hover p-5 flex flex-col items-start gap-2.5 border-2 border-transparent hover:border-[#246A48]/20 transition-all text-left bg-white/90 shadow-lg"
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shadow-sm ${type.color.split(' ')[0]}`}>
                {type.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-[#111827] group-hover:text-[#246A48] transition-colors">{type.label}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight leading-tight">{type.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-50 w-full flex items-center justify-between text-[#246A48] text-[9px] font-black uppercase tracking-widest">
                <span>Customize Plan</span>
                <span className="group-hover:translate-x-1 transition-transform text-base">→</span>
              </div>
            </button>
          ))}
          </div>
        </div>
      </div>
    );
  }

  /* ─── STEP 2: Configure ─────────────────────────────────────────────── */
  if (step === 'config') {
    return (
      <div className="page-wide animate-page-enter h-full overflow-hidden flex flex-col !py-0">
        <div className="flex-1 flex flex-col items-center justify-center min-h-0 bg-slate-50/50 rounded-[3rem] p-4">
          <button onClick={resetPlanner} className="mb-4 btn-ghost text-[10px] font-black uppercase tracking-[0.4em] px-0 hover:bg-transparent opacity-40 hover:opacity-100 transition-opacity flex items-center gap-2">
            ← Back to selection
          </button>

          <div className="w-full max-w-lg card shadow-2xl overflow-hidden p-6 border-t-8 border-[#246A48] bg-white rounded-[2rem]">
            <div className="flex items-center gap-5 mb-6 pb-5 border-b border-slate-50">
              <div className={`w-12 h-12 rounded-2xl ${planType.color.split(' ')[0]} flex items-center justify-center text-2xl shadow-lg`}>
                {planType.icon}
              </div>
              <div>
                <h2 className="text-2xl font-black text-[#111827] tracking-tight leading-none">{planType.label}</h2>
                <p className="text-[9px] font-black text-[#3a5c51] uppercase tracking-[0.3em] opacity-40 mt-1">Optimization Phase</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1.5 block">Planned Week</label>
                  <input
                    type="date"
                    value={selectedWeek}
                    onChange={(e) => setSelectedWeek(e.target.value)}
                    className="w-full bg-slate-50/80 border-0 rounded-xl p-3 font-bold text-xs focus:ring-2 focus:ring-[#246A48]/10 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1.5 block">Servings Needed</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={servings}
                      onChange={(e) => setServings(parseInt(e.target.value))}
                      className="w-full bg-slate-50/80 border-0 rounded-xl p-3 font-bold text-xs focus:ring-2 focus:ring-[#246A48]/10 transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase text-slate-400 pointer-events-none">People</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-emerald-50/30 rounded-2xl border border-[#246A48]/5 border-dashed">
                <p className="text-[11px] font-bold text-[#3a5c51] text-center italic opacity-60 leading-relaxed italic">
                  "AI will architect a 21-meal comprehensive schedule perfectly balanced for your <span className="text-[#246A48]">{planType.id}</span> requirements."
                </p>
              </div>

              <button
                onClick={generateMealPlan}
                disabled={loading}
                className="btn-primary w-full py-4 text-sm font-black flex items-center justify-center gap-4 group rounded-xl shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    ANALYZING...
                  </>
                ) : (
                  <>
                    <span className="group-hover:rotate-12 transition-transform">✨</span>
                    GENERATE MEAL PLAN
                    <span className="group-hover:-rotate-12 transition-transform">✨</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─── STEP 3: Result Grid ──────────────────────────────────────────── */
  const dayMap = mealPlan ? buildDayMap(mealPlan.meals) : {};
  const totalMeals = Object.values(dayMap).reduce((acc, d) => acc + Object.keys(d).length, 0);

  return (
    <div className="page-wide animate-page-enter h-full overflow-hidden flex flex-col !py-0">
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
               <div className={`w-10 h-10 rounded-xl ${planType.color.split(' ')[0]} flex items-center justify-center text-xl shadow-sm`}>
                  {planType.icon}
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest text-[#246A48] opacity-60">{planType.label} Plan</span>
            </div>
            <h1 className="text-4xl font-black text-[#111827] leading-tight mb-0 tracking-tighter">Your Weekly <span className="text-[#246A48]">Menu</span></h1>
            <p className="text-[#3a5c51] font-bold uppercase tracking-[0.2em] text-[10px] opacity-40 mt-1">
              {new Date(selectedWeek).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} — {totalMeals} Custom Meals
            </p>
          </div>
          
          <div className="flex gap-2">
            <button onClick={generateMealPlan} disabled={loading} className="px-4 py-2 border-2 border-[#246A48]/10 text-[#246A48] rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#246A48] hover:text-white transition-all">
              Rebuild Plan
            </button>
            <button onClick={resetPlanner} className="px-4 py-2 bg-[#246A48] text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-[#246A48]/20 transition-all hover:-translate-y-1">
              New Plan
            </button>
          </div>
        </div>

        {/* Grid Container - Viewport Locked */}
        <div className="flex-1 overflow-x-auto pb-4 scrollbar-premium flex gap-4 min-h-0 pr-2">
          {DAYS.map((day, idx) => {
            const dayMeals = dayMap[idx] || {};
            return (
              <div key={idx} className="flex flex-col gap-3 min-w-[190px] h-full animate-page-enter" style={{ animationDelay: `${idx * 40}ms` }}>
                <div className="text-center py-2 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-100 shadow-sm shrink-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#3a5c51]">{day}</p>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-premium">
                  {['breakfast', 'lunch', 'dinner', 'snack'].map(mealType => {
                    const col = MEAL_COLORS[mealType];
                    const recipe = dayMeals[mealType];
                    return (
                      <div
                        key={mealType}
                        className={`card !p-3.5 border ${col.border} ${col.bg} transition-all hover:shadow-md group cursor-pointer relative overflow-hidden`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${col.badge}`}>
                            {col.icon} {mealType}
                          </span>
                        </div>
                        <p className="text-[13px] font-bold text-[#111827] leading-tight group-hover:text-[#246A48] transition-colors line-clamp-2">
                          {recipe || <span className="text-slate-300 font-normal italic">Rest Day</span>}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {Object.keys(dayMap).length === 0 && (
           <div className="card text-center py-20 bg-white/40 border-dashed border-2 flex-1 flex items-center justify-center">
              <p className="text-xl font-bold text-slate-400 italic">No meal schedule found. Use the regeneration button to start.</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default MealPlannerPage;
