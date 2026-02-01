# SmartKitchen AI - Complete Setup Guide

## 📋 Table of Contents
1. [Project Overview](#overview)
2. [System Requirements](#requirements)
3. [Database Setup](#database)
4. [Backend Setup](#backend)
5. [Frontend Setup](#frontend)
6. [Environment Configuration](#environment)
7. [Running the Application](#running)
8. [Features Overview](#features)
9. [API Documentation](#api)
10. [Troubleshooting](#troubleshooting)

---

## Project Overview {#overview}

**SmartKitchen AI** is a full-stack AI-powered recipe generation application with 21 features including:
- ✅ AI Recipe Generation from ingredients
- ✅ Pantry & Ingredient Management
- ✅ Weekly Meal Planning
- ✅ Shopping List Management
- ✅ Fridge Scanner (Image Recognition)
- ✅ Voice-Guided Cooking
- ✅ Health Mode Adjustments (Keto, Diabetic, HighProtein, WeightLoss)
- ✅ Nutrition Estimation
- ✅ Ingredient Substitution Engine
- ✅ Waste Reduction Suggestions
- ✅ Cuisine Conversion
- ✅ Taste Personalization
- ✅ Quantity Scaling (1-10 servings)
- ✅ Cost Estimation
- ✅ Expiry Tracking
- ✅ Seasonal Suggestions
- ✅ Allergy-Safe Mode
- ✅ Difficulty Rating
- ✅ AI Chat Assistant
- ✅ User Taste Profiles & Preferences
- ✅ Affiliate Links & Ads Placeholders

**Tech Stack:**
- Frontend: React 18+ with Tailwind CSS
- Backend: Node.js + Express
- Database: PostgreSQL (via Supabase) + Prisma ORM
- AI: OpenAI API (GPT-3.5-turbo/GPT-4)
- Storage: Firebase Storage
- Voice: Web Speech API (Browser Native)
- Auth: JWT + Firebase

---

## System Requirements {#requirements}

### Minimum Requirements
- Node.js 20.x or higher
- npm 9.x or yarn
- Git
- A modern web browser (Chrome, Firefox, Safari, Edge)

### Required API Keys & Accounts
1. **OpenAI API Key** - For recipe generation and AI features
   - Sign up at: https://platform.openai.com
   - Min balance: $5 (for testing)

2. **Firebase Project** - For image storage and authentication
   - Create project at: https://console.firebase.google.com
   - Enable Storage and Authentication

3. **Supabase Account** - For PostgreSQL database
   - Sign up at: https://supabase.com
   - Create a new project

---

## Database Setup {#database}

### 1. Create Supabase Project

```bash
# Go to https://supabase.com and create a new project
# Note your PROJECT_URL and ANON_KEY
```

### 2. Get Database Connection String

```bash
# In Supabase dashboard:
# Settings > Database > Connection Strings > URI
# Copy the PostgreSQL connection string
```

### 3. Generate Prisma Client

```bash
cd backend

# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Push schema to database
npm run prisma:push

# (Optional) Open Prisma Studio
npm run prisma:studio
```

### Database Schema

The database includes 10 tables:
- **User** - User accounts & profiles
- **Ingredient** - Master ingredient list with nutritional info
- **PantryItem** - User's pantry inventory
- **Recipe** - Generated/saved recipes
- **RecipeIngredient** - Recipe ingredients with substitutes
- **RecipeStep** - Step-by-step cooking instructions
- **NutritionInfo** - Nutrition data per recipe
- **UserTasteProfile** - User preferences & allergies
- **ShoppingList** - Shopping list management
- **ShoppingListItem** - Individual shopping items
- **ExpiryTracker** - Ingredient expiry monitoring
- **MealPlan** - Weekly meal plans
- **MealPlanItem** - Individual meal plan entries
- **Preferences** - User settings & health modes

---

## Backend Setup {#backend}

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create .env File

```bash
cp .env.example .env
```

### 4. Configure .env

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://user:password@db.xxxxx.supabase.co:5432/postgres"

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# OpenAI API
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_MODEL=gpt-3.5-turbo

# Firebase Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY=your-firebase-private-key
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
FIREBASE_STORAGE_BUCKET=your-firebase-bucket.appspot.com

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Image Processing
MAX_IMAGE_SIZE=5242880
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/webp

# AI Configuration
AI_TEMPERATURE=0.7
AI_MAX_TOKENS=2000
AI_MODEL_TIMEOUT=30000
```

### 5. Get Firebase Service Account Key

```bash
# In Firebase Console:
# Project Settings > Service Accounts > Generate New Private Key
# Save as: backend/firebase-key.json
```

### 6. Start Backend Server

```bash
# Development with auto-reload
npm run dev

# OR production
npm start
```

**Backend will run on:** http://localhost:5000

---

## Frontend Setup {#frontend}

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create .env.local File

```bash
# Create .env.local in frontend directory
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Start Frontend Development Server

```bash
npm start
```

**Frontend will run on:** http://localhost:3000

---

## Environment Configuration {#environment}

### Backend Environment Variables

**Required:**
- `DATABASE_URL` - PostgreSQL connection string
- `OPENAI_API_KEY` - OpenAI API key
- `JWT_SECRET` - Secret for JWT token generation
- `FIREBASE_PROJECT_ID` - Firebase project ID
- `FIREBASE_PRIVATE_KEY` - Firebase service account private key
- `FIREBASE_CLIENT_EMAIL` - Firebase service account email
- `FIREBASE_STORAGE_BUCKET` - Firebase storage bucket name

**Optional:**
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `OPENAI_MODEL` - Model version (default: gpt-3.5-turbo)
- `AI_TEMPERATURE` - AI response temperature (0-1)
- `AI_MAX_TOKENS` - Max tokens per request

### Frontend Environment Variables

**Optional:**
- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:5000/api)

---

## Running the Application {#running}

### Method 1: Separate Terminals (Recommended for Development)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### Method 2: Docker (Optional)

```bash
# Build Docker images
docker-compose build

# Run both services
docker-compose up
```

### Method 3: Production Build

**Backend:**
```bash
cd backend
npm install --production
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm install -g serve
serve -s build -l 3000
```

---

## Features Overview {#features}

### 1. **Recipe Generation** 🤖
- Input ingredients → AI generates recipes
- Supports health modes (Keto, Diabetic, etc.)
- Customizable servings (1-10)

### 2. **Pantry Management** 📦
- Track ingredients & quantities
- Monitor expiry dates
- Storage location tracking
- Cost tracking per ingredient

### 3. **Meal Planning** 📅
- Generate weekly meal plans
- Respects dietary preferences
- Auto-generate shopping lists
- Cost estimation per week

### 4. **Shopping Lists** 🛒
- Create multiple shopping lists
- Mark items as purchased
- Cost estimation
- Link to recipes

### 5. **Fridge Scanner** 📱
- Upload fridge/pantry images
- AI detects ingredients
- Auto-adds to pantry
- Freshness assessment

### 6. **Voice Guidance** 🔊
- Step-by-step voice instructions
- Browser Web Speech API
- Pause/resume controls
- Multiple language support

### 7. **Health Modes** 💪
- Keto Diet
- Diabetic-Friendly
- High Protein
- Weight Loss
- Balanced (Normal)

### 8. **Nutritional Info** 🥗
- Per-serving calculations
- Macro breakdown (Carbs, Protein, Fat)
- Allergen warnings
- Dietary restrictions

### 9. **Substitution Engine** 🔄
- Suggests ingredient alternatives
- Quality ranking
- Ratio adjustments
- Maintains dish integrity

### 10. **Waste Reduction** ♻️
- Leftover recipes
- Storage guidelines
- Byproduct usage suggestions
- Sustainability tips

### 11. **Cuisine Converter** 🌍
- Convert recipes between cuisines
- Spice adjustments
- Cooking method adaptations
- Flavor profile changes

### 12. **Taste Personalization** 👅
- Spice level preference (1-5)
- Cuisine preferences
- Disliked ingredients
- Dietary restrictions

### 13. **Quantity Scaling** 📊
- Scale recipes 1-10 servings
- Automatic ingredient adjustment
- Nutrition recalculation
- Time adjustments

### 14. **Cost Estimation** 💰
- Per-recipe cost
- Weekly meal plan costs
- Ingredient pricing
- Affiliate links (placeholder)

### 15. **Expiry Tracking** ⏰
- Automatic alerts (3 days before)
- Freshness status
- Usage recommendations
- Waste prevention

### 16. **Seasonal Suggestions** 🍂
- Seasonal ingredient recommendations
- Availability tracking
- Optimal pricing periods
- Freshness optimization

### 17. **Allergy-Safe Mode** 🚨
- Define allergens
- Auto-detect in recipes
- Substitute suggestions
- Warning system

### 18. **Difficulty Rating** ⭐
- Easy / Medium / Hard classification
- Required skills assessment
- Experience level recommendation
- Time complexity

### 19. **AI Chat Assistant** 💬
- Ask cooking questions
- Recipe modifications
- Cooking tips
- Emergency substitutes

### 20. **User Profiles** 👤
- Taste preferences
- Dietary restrictions
- Allergen information
- Cooking experience level

### 21. **Ad/Affiliate Integration** 🎯
- Affiliate link placeholders
- Ad integration points
- Monetization-ready structure

---

## API Documentation {#api}

### Authentication Endpoints

**Register:**
```
POST /api/auth/register
Body: { email, password, name }
Response: { token, user }
```

**Login:**
```
POST /api/auth/login
Body: { email, password }
Response: { token, user }
```

**Get Current User:**
```
GET /api/auth/me
Headers: Authorization: Bearer {token}
Response: { user with profile }
```

### Recipe Endpoints

**Generate Recipe:**
```
POST /api/recipes/generate
Body: { ingredients[], healthMode, servings }
Response: { recipe with steps, nutrition, cost }
```

**Get Substitutes:**
```
POST /api/recipes/substitutes
Body: { missingIngredient, availableIngredients[], dishType }
Response: { substitutes with quality scores }
```

**Scale Recipe:**
```
POST /api/recipes/{id}/scale
Body: { newServings }
Response: { scaled recipe with adjusted nutrition }
```

**Convert Cuisine:**
```
POST /api/recipes/convert-cuisine
Body: { recipeId, targetCuisine }
Response: { converted recipe }
```

### Pantry Endpoints

**Get Pantry Items:**
```
GET /api/pantry
Response: { pantryItems[] }
```

**Add Item:**
```
POST /api/pantry/add
Body: { ingredientId, quantity, unit, expiryDate, storageLocation, cost }
Response: { pantryItem }
```

**Delete Item:**
```
DELETE /api/pantry/{id}
Response: { success }
```

### Meal Plan Endpoints

**Generate Meal Plan:**
```
POST /api/meal-plan/generate
Body: { weekStartDate, servings }
Response: { mealPlan with daily meals }
```

**Get Weekly Plan:**
```
GET /api/meal-plan/weekly/{weekStartDate}
Response: { mealPlan }
```

### AI Endpoints

**Scan Fridge:**
```
POST /api/ai/scan-fridge (multipart/form-data)
Body: { image, autoAdd? }
Response: { detectedItems[], warnings[] }
```

**Rate Difficulty:**
```
POST /api/ai/rate-difficulty
Body: { recipeTitle, ingredients[], steps[] }
Response: { difficulty, score, reasoning }
```

**Health Mode Adjustment:**
```
POST /api/ai/health-mode
Body: { recipe, healthMode }
Response: { adaptedRecipe, replacements[] }
```

### Shopping List Endpoints

**Get Shopping Lists:**
```
GET /api/shopping
Response: { shoppingLists[] }
```

**Create List:**
```
POST /api/shopping
Body: { name }
Response: { shoppingList }
```

---

## Troubleshooting {#troubleshooting}

### Backend Issues

**Port 5000 Already in Use:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID {PID} /F

# Mac/Linux
lsof -i :5000
kill -9 {PID}
```

**Database Connection Error:**
- Verify `DATABASE_URL` in .env
- Check Supabase project is active
- Ensure IP whitelist allows your connection

**OpenAI API Error:**
- Verify API key is correct
- Check account has credits/quota
- Test with simpler prompts first

### Frontend Issues

**API Connection Refused:**
- Ensure backend is running on port 5000
- Check REACT_APP_API_URL is correct
- Verify CORS settings in backend

**CORS Errors:**
- Check `FRONTEND_URL` in backend .env matches frontend URL
- Clear browser cache
- Restart both servers

**Voice Not Working:**
- Check browser supports Web Speech API
- Enable microphone permissions
- Test in supported browser (Chrome, Firefox)

### Common Solutions

1. **Clear Cache & Reinstall:**
```bash
# Backend
cd backend && rm -rf node_modules && npm install

# Frontend
cd frontend && rm -rf node_modules && npm install
```

2. **Reset Database:**
```bash
cd backend
npm run prisma:push -- --force-reset
```

3. **Check Logs:**
```bash
# Backend logs show detailed errors
# Frontend dev tools (F12) for client errors
```

---

## Deployment Guide

### Deploy Backend to Heroku/Railway

```bash
cd backend
heroku create your-app-name
git push heroku main
```

### Deploy Frontend to Vercel/Netlify

```bash
cd frontend
vercel deploy
```

---

## Support & Contributions

For issues, questions, or contributions:
- Create an issue on GitHub
- Email: support@smartkitchen.ai
- Join our community Discord

---

**Last Updated:** January 2026
**Version:** 1.0.0
