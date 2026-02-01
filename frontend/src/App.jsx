import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useAuth } from './hooks/useAuth';
import './i18n';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RecipeResultsPage from './pages/RecipeResultsPage';
import PantryPage from './pages/PantryPage';
import MyPantryPage from './pages/MyPantryPage';
import MealPlannerPage from './pages/MealPlannerPage';
import ShoppingListPage from './pages/ShoppingListPage';
import FridgeScannerPage from './pages/FridgeScannerPage';
import WasteReductionPage from './pages/WasteReductionPage';
import CuisineConverterPage from './pages/CuisineConverterPage';
import DifficultyRatingPage from './pages/DifficultyRatingPage';
import SeasonalSuggestionsPage from './pages/SeasonalSuggestionsPage';
import AIChatPage from './pages/AIChatPage';
import MonetizationPage from './pages/MonetizationPage';

// Navigation Component
const Navigation = ({ user, onLogout }) => {
  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-green-600 cursor-pointer">
          🍳 SmartKitchen
        </Link>

        <div className="flex gap-6">
          <Link to="/" className="text-gray-700 hover:text-green-600 font-medium">
            Home
          </Link>
          <Link to="/pantry" className="text-gray-700 hover:text-green-600 font-medium">
            Manage Pantry
          </Link>
          <Link to="/my-pantry" className="text-gray-700 hover:text-green-600 font-medium">
            Cook from Pantry
          </Link>
          <Link to="/meal-planner" className="text-gray-700 hover:text-green-600 font-medium">
            Planner
          </Link>
          <Link to="/shopping-list" className="text-gray-700 hover:text-green-600 font-medium">
            Shopping
          </Link>
          <Link to="/fridge-scanner" className="text-gray-700 hover:text-green-600 font-medium">
            Scanner
          </Link>
          <div className="relative group">
            <button className="text-gray-700 hover:text-green-600 font-medium">
              More ▼
            </button>
            <div className="absolute left-0 mt-0 w-48 bg-white shadow-lg rounded-lg hidden group-hover:block z-50">
              <Link to="/waste-reduction" className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600">
                Waste Reduction
              </Link>
              <Link to="/cuisine-converter" className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600">
                Cuisine Converter
              </Link>
              <Link to="/difficulty-rating" className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600">
                Difficulty Rating
              </Link>
              <Link to="/seasonal-suggestions" className="block px-4 py-2 text-gray-700 hover:text-green-600">
                Seasonal Ideas
              </Link>
              <Link to="/ai-chat" className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600">
                AI Chef Assistant
              </Link>
              <Link to="/pricing" className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 border-t">
                Pricing & Plans
              </Link>
            </div>
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <span className="text-gray-700">{user.name}</span>
            <button
              onClick={onLogout}
              className="btn-outline px-3 py-1 text-sm"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

// Protected Route
const ProtectedRoute = ({ children, isAuthenticated }) => {
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const { user, isAuthenticated, logout } = useAuth();
  const [showNav, setShowNav] = useState(true);

  return (
    <Router>
      <Toaster position="top-right" />

      {showNav && isAuthenticated && (
        <Navigation user={user} onLogout={logout} />
      )}

      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recipe-results"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RecipeResultsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pantry"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <PantryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-pantry"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MyPantryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/meal-planner"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MealPlannerPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/shopping-list"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ShoppingListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/fridge-scanner"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <FridgeScannerPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/waste-reduction"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <WasteReductionPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cuisine-converter"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <CuisineConverterPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/difficulty-rating"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <DifficultyRatingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seasonal-suggestions"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <SeasonalSuggestionsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai-chat"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AIChatPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pricing"
          element={<MonetizationPage />}
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
