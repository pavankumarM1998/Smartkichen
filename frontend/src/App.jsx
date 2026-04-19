import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import { FaBoxOpen, FaCalendarAlt, FaShoppingCart, FaCamera, FaMagic, FaArrowLeft } from 'react-icons/fa';
import './i18n';

// Pages
import HomePage            from './pages/HomePage';
import LoginPage           from './pages/LoginPage';
import RecipeResultsPage   from './pages/RecipeResultsPage';
import PantryPage          from './pages/PantryPage';
import MyPantryPage        from './pages/MyPantryPage';
import MealPlannerPage     from './pages/MealPlannerPage';
import ShoppingListPage    from './pages/ShoppingListPage';
import FridgeScannerPage   from './pages/FridgeScannerPage';
import WasteReductionPage  from './pages/WasteReductionPage';
import CuisineConverterPage from './pages/CuisineConverterPage';
import DifficultyRatingPage from './pages/DifficultyRatingPage';
import SeasonalSuggestionsPage from './pages/SeasonalSuggestionsPage';
import AIChatPage          from './pages/AIChatPage';
import MonetizationPage    from './pages/MonetizationPage';

const NAV_ITEMS = [
  { to: '/',               icon: <FaBoxOpen />, label: 'Dashboard'      },
  { to: '/pantry',         icon: <FaBoxOpen />, label: 'Manage Pantry'    },
  { to: '/my-pantry',      icon: <FaBoxOpen />, label: 'Cook from Pantry' },
  { to: '/meal-planner',   icon: <FaCalendarAlt />, label: 'Meal Planner'     },
  { to: '/shopping-list',  icon: <FaShoppingCart />, label: 'Shopping List'    },
  { to: '/fridge-scanner', icon: <FaCamera />, label: 'Fridge Scanner'   },
];

const MORE_ITEMS = [
  { to: '/waste-reduction',      icon: <FaMagic />,  label: 'Waste Minimizer'   },
  { to: '/cuisine-converter',    icon: <FaMagic />, label: 'Cuisine Morph'  },
  { to: '/difficulty-rating',    icon: <FaMagic />, label: 'Chef Rating'  },
  { to: '/seasonal-suggestions', icon: <FaMagic />, label: 'Seasonal Magic'     },
  { to: '/ai-chat',              icon: <FaMagic />, label: 'AI Sous Chef'  },
  { to: '/pricing',              icon: <FaMagic />, label: 'Premium'    },
];

// ─── Sidebar ────────────────────────────────────────────────────────────────
const Sidebar = ({ user, onLogout }) => {
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();

  const linkClass = (to) => {
    const exact = to === '/';
    const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);
    return isActive 
      ? 'flex items-center gap-3 px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider bg-[#246A48] text-white shadow-lg shadow-[#246A48]/20 border border-white/10 transition-all'
      : 'flex items-center gap-3 px-4 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider text-[#8ca39a] hover:bg-[#246A48]/20 hover:text-white border border-transparent transition-all';
  };

  return (
    <aside style={{ width: 280, minWidth: 280 }}
      className="h-screen sticky top-0 flex flex-col bg-[#1f332c] border-r border-[#15231e] py-8 px-5 overflow-y-auto shadow-2xl z-50">

      {/* Logo */}
      <NavLink to="/" className="flex items-center gap-3 px-4 mb-8 group no-underline">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#246A48] to-[#1a2d27] flex items-center justify-center text-lg shadow-xl border border-white/10 group-hover:scale-110 transition-all duration-300">
          🥗
        </div>
        <div className="flex flex-col">
          <span className="text-base font-black text-white leading-tight tracking-tight">SmartKitchen</span>
          <span className="text-[8px] font-black text-[#567a68] tracking-[0.3em] uppercase opacity-70">Intelligence AI</span>
        </div>
      </NavLink>

      {/* Main nav */}
      <nav className="flex-1 space-y-1">
        <p className="px-4 text-[9px] font-black text-[#8ca39a] uppercase tracking-[0.3em] mb-2 mt-2">Main Navigator</p>
        {NAV_ITEMS.map(item => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'} className={linkClass(item.to)}>
            <span className="text-base opacity-90">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}

        {/* More section */}
        <div className="pt-3">
          <p className="px-4 text-[9px] font-black text-[#8ca39a] uppercase tracking-[0.3em] mb-2 mt-2">Chef Arsenal</p>
          <button
            onClick={() => setMoreOpen(o => !o)}
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider text-[#8ca39a] hover:bg-[#246A48]/20 hover:text-white transition-all group border border-transparent"
          >
            <span className="flex items-center gap-3">
              <span className="text-base group-hover:scale-110 transition-all duration-300 opacity-90"><FaMagic className="text-xs" /></span>
              <span>Advanced Stack</span>
            </span>
            <span className={`text-[8px] transition-transform duration-500 ${moreOpen ? 'rotate-180 text-white' : 'opacity-40'}`}>▼</span>
          </button>
          
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${moreOpen ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
            <div className="space-y-1 poly-blur rounded-2xl p-1 bg-black/10 border border-white/5">
              {MORE_ITEMS.map(item => (
                <NavLink key={item.to} to={item.to} className={linkClass(item.to)}>
                  <span className="text-sm ml-0.5 opacity-90">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* User section */}
      {user && (
        <div className="mt-8 pt-6 border-t border-[#2a453c]">
          <div className="p-4 rounded-[1.5rem] bg-[#162520] border border-[#233a32] mb-2 shadow-inner">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#246A48] to-[#12221b] flex items-center justify-center text-white font-black text-sm shadow-md border border-[#3e6b41]/30">
                {(user.name || user.email || 'U')[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{user.name || 'Professional Chef'}</p>
                <p className="text-[10px] font-semibold text-[#668f7c] truncate uppercase tracking-tight">{user.role || 'Free Tier'}</p>
              </div>
            </div>
            <button onClick={onLogout} className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-xl text-xs font-bold text-[#ff8080] hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all">
              <span className="text-base leading-none">↩</span> Sign Out
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

// ─── Protected Route ─────────────────────────────────────────────────────────
const ProtectedRoute = ({ children, isAuthenticated }) =>
  isAuthenticated ? children : <Navigate to="/login" />;

// ─── Shell (sidebar + content) ───────────────────────────────────────────────
const AppShell = ({ user, logout, children }) => (
  <div className="flex min-h-screen bg-[#F1F5F2]">
    <Sidebar user={user} onLogout={logout} />
    <main className="flex-1 overflow-auto relative p-4 lg:p-8">
      <div className="max-w-7xl mx-auto h-[calc(100vh-64px)]">
        {children}
      </div>
    </main>
  </div>
);

// ─── App ─────────────────────────────────────────────────────────────────────
function App() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { borderRadius: 12, fontSize: 14, fontWeight: 500 },
          success: { iconTheme: { primary: '#059669', secondary: '#fff' } },
        }}
      />
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AppShell user={user} logout={logout}><HomePage /></AppShell>
          </ProtectedRoute>
        } />
        <Route path="/recipe-results" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AppShell user={user} logout={logout}><RecipeResultsPage /></AppShell>
          </ProtectedRoute>
        } />
        <Route path="/pantry" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AppShell user={user} logout={logout}><PantryPage /></AppShell>
          </ProtectedRoute>
        } />
        <Route path="/my-pantry" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AppShell user={user} logout={logout}><MyPantryPage /></AppShell>
          </ProtectedRoute>
        } />
        <Route path="/meal-planner" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AppShell user={user} logout={logout}><MealPlannerPage /></AppShell>
          </ProtectedRoute>
        } />
        <Route path="/shopping-list" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AppShell user={user} logout={logout}><ShoppingListPage /></AppShell>
          </ProtectedRoute>
        } />
        <Route path="/fridge-scanner" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AppShell user={user} logout={logout}><FridgeScannerPage /></AppShell>
          </ProtectedRoute>
        } />
        <Route path="/waste-reduction" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AppShell user={user} logout={logout}><WasteReductionPage /></AppShell>
          </ProtectedRoute>
        } />
        <Route path="/cuisine-converter" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AppShell user={user} logout={logout}><CuisineConverterPage /></AppShell>
          </ProtectedRoute>
        } />
        <Route path="/difficulty-rating" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AppShell user={user} logout={logout}><DifficultyRatingPage /></AppShell>
          </ProtectedRoute>
        } />
        <Route path="/seasonal-suggestions" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AppShell user={user} logout={logout}><SeasonalSuggestionsPage /></AppShell>
          </ProtectedRoute>
        } />
        <Route path="/ai-chat" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AppShell user={user} logout={logout}><AIChatPage /></AppShell>
          </ProtectedRoute>
        } />
        <Route path="/pricing" element={<MonetizationPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
