import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
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
  { to: '/',               icon: '🏠', label: 'Home'             },
  { to: '/pantry',         icon: '📦', label: 'Manage Pantry'    },
  { to: '/my-pantry',      icon: '🍳', label: 'Cook from Pantry' },
  { to: '/meal-planner',   icon: '📅', label: 'Meal Planner'     },
  { to: '/shopping-list',  icon: '🛒', label: 'Shopping List'    },
  { to: '/fridge-scanner', icon: '📷', label: 'Fridge Scanner'   },
];

const MORE_ITEMS = [
  { to: '/waste-reduction',      icon: '♻️',  label: 'Waste Reduction'   },
  { to: '/cuisine-converter',    icon: '🌍', label: 'Cuisine Converter'  },
  { to: '/difficulty-rating',    icon: '⭐', label: 'Difficulty Rating'  },
  { to: '/seasonal-suggestions', icon: '🌿', label: 'Seasonal Ideas'     },
  { to: '/ai-chat',              icon: '🤖', label: 'AI Chef Assistant'  },
  { to: '/pricing',              icon: '💎', label: 'Pricing & Plans'    },
];

// ─── Sidebar ────────────────────────────────────────────────────────────────
const Sidebar = ({ user, onLogout }) => {
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();

  const linkClass = (to) => {
    const exact = to === '/';
    const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);
    return isActive ? 'nav-link-active' : 'nav-link';
  };

  return (
    <aside style={{ width: 240, minWidth: 240 }}
      className="h-screen sticky top-0 flex flex-col bg-white border-r border-gray-100 py-6 px-4 overflow-y-auto">

      {/* Logo */}
      <NavLink to="/" className="flex items-center gap-2.5 px-3 mb-8">
        <span className="text-2xl">🍳</span>
        <span className="text-lg font-bold text-gray-900">SmartKitchen</span>
        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md ml-auto">AI</span>
      </NavLink>

      {/* Main nav */}
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map(item => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'} className={linkClass(item.to)}>
            <span className="text-base w-5 text-center">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}

        {/* More section */}
        <div>
          <button
            onClick={() => setMoreOpen(o => !o)}
            className="nav-link w-full justify-between"
          >
            <span className="flex items-center gap-3">
              <span className="text-base w-5 text-center">⚙️</span>
              <span>More tools</span>
            </span>
            <span className="text-xs text-gray-400">{moreOpen ? '▲' : '▼'}</span>
          </button>
          {moreOpen && (
            <div className="ml-4 mt-1 space-y-1">
              {MORE_ITEMS.map(item => (
                <NavLink key={item.to} to={item.to} className={linkClass(item.to)}>
                  <span className="text-sm w-5 text-center">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* User section */}
      {user && (
        <div className="mt-6 pt-5 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
              {(user.name || user.email || 'U')[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user.name || 'User'}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
          <button onClick={onLogout} className="btn-ghost w-full text-red-500 hover:bg-red-50 hover:text-red-600 justify-start">
            <span>↩</span> Sign out
          </button>
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
  <div className="flex min-h-screen bg-gray-50">
    <Sidebar user={user} onLogout={logout} />
    <main className="flex-1 overflow-auto">
      {children}
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
