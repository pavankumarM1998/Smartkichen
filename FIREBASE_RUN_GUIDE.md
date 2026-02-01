# SmartKitchen AI - Firebase Setup & Run Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Firebase account (free tier available)
- npm or yarn package manager

## 📋 Step-by-Step Setup

### 1. Get Firebase Credentials (5 minutes)

Follow this guide: [FIREBASE_COMPLETE_SETUP.md](FIREBASE_COMPLETE_SETUP.md)

**Quick version:**
1. Create Firebase project
2. Enable Email/Password auth
3. Create Firestore database
4. Download service account JSON
5. Copy web app config

### 2. Configure Environment Variables

**Backend (`backend/.env`)**

Option A - Using firebase-key.json file:
```bash
# Just place the downloaded firebase-key.json file in the backend/ folder
# The server will auto-detect it
```

Option B - Using environment variables:
```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=your-service-account@iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
```

**Frontend (`frontend/.env`)**
```bash
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

### 3. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 4. Run the Servers

**Terminal 1 - Backend**
```bash
cd backend
npm start
```
Expected output:
```
✅ Firebase Admin SDK initialized
🚀 SmartKitchen AI Backend running on port 5000
```

**Terminal 2 - Frontend**
```bash
cd frontend
npm start
```
Expected output:
```
Compiled successfully!
Local: http://localhost:3000
```

### 5. Test the App

1. Open http://localhost:3000 in browser
2. Click "Sign up"
3. Create account with email/password
4. Should see Firestore creating user document
5. Logged in user should see "Home" page
6. Navigate through all 13 pages

## ✨ Features Included

### 21 Complete Features with Full Stack Implementation

#### Core Features
- ✅ User Authentication (Firebase)
- ✅ Pantry Management
- ✅ Recipe Management
- ✅ Meal Planning
- ✅ Shopping Lists
- ✅ User Preferences

#### AI-Powered Features
- ✅ Recipe Generation (ChatGPT)
- ✅ Ingredient Substitutions
- ✅ Nutrition Estimation
- ✅ AI Recommendations
- ✅ Image Recognition
- ✅ Health Mode

#### Advanced Features
- ✅ Waste Reduction Tips
- ✅ Cuisine Converter
- ✅ Difficulty Rating
- ✅ Seasonal Suggestions
- ✅ AI Chat Assistant
- ✅ Monetization Dashboard

#### UI/UX
- ✅ Voice Guidance
- ✅ Responsive Design
- ✅ Real-time Updates

## 🎯 Project Structure

```
SmartKitchen AI/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Business logic
│   │   ├── routes/          # API endpoints
│   │   ├── middleware/      # Auth, uploads
│   │   ├── services/        # OpenAI, Firebase
│   │   ├── utils/           # JWT, Firebase, Response
│   │   └── server.js        # Express server
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/           # 13 main pages
│   │   ├── components/      # Reusable components
│   │   ├── hooks/           # useAuth, useVoiceGuide
│   │   ├── services/        # API integration
│   │   ├── utils/           # Helpers, Firebase
│   │   └── App.jsx          # Main app
│   ├── public/
│   │   └── index.html
│   └── package.json
│
├── FIREBASE_COMPLETE_SETUP.md
├── FIREBASE_INTEGRATION_SUMMARY.md
└── README.md
```

## 🔐 Authentication Flow

### Sign Up
```
1. User enters email, password, name
2. Firebase Client SDK creates user
3. Backend creates Firestore user document
4. Backend creates default preferences
5. Frontend stores ID token in localStorage
6. User redirected to home
```

### Login
```
1. User enters email, password
2. Firebase authenticates
3. ID token retrieved
4. Frontend stores token
5. User session persists
```

### Session Persistence
```
1. User refreshes page
2. Firebase checks session
3. onAuthStateChanged fires
4. User auto-logged in
5. No token needed from localStorage
```

## 🛠️ API Endpoints

### Authentication
```
POST   /api/auth/register     - Create new user
POST   /api/auth/login        - Login user
GET    /api/auth/me           - Get current user
PUT    /api/auth/profile      - Update profile
POST   /api/auth/change-password - Change password
DELETE /api/auth/delete-account - Delete account
```

### Pantry Management
```
GET    /api/pantry            - List items
POST   /api/pantry            - Add item
PUT    /api/pantry/:id        - Update item
DELETE /api/pantry/:id        - Delete item
```

### Similar endpoints for:
- `/api/recipes` - Recipe management
- `/api/ai` - AI features
- `/api/meal-plan` - Meal planning
- `/api/preferences` - User settings
- `/api/shopping` - Shopping lists

## 🗄️ Firestore Collections

```
users/{userId}
  ├─ id
  ├─ email
  ├─ name
  ├─ profilePicture (optional)
  ├─ bio (optional)
  ├─ createdAt
  └─ updatedAt

preferences/{userId}
  ├─ dietaryRestrictions (array)
  ├─ allergies (array)
  ├─ cuisinePreferences (array)
  ├─ difficultyLevel
  ├─ servingSize
  ├─ createdAt
  └─ updatedAt

pantry/{userId}/items/{itemId}
  ├─ name
  ├─ quantity
  ├─ unit
  └─ expiryDate

recipes/{userId}/saved/{recipeId}
  ├─ title
  ├─ description
  ├─ difficulty
  ├─ prepTime
  └─ cookTime
```

## 🧪 Testing Endpoints

### Register New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Current User
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Firebase Not Initializing
```
Check:
1. ✅ firebase-key.json exists in backend/ folder, OR
2. ✅ Firebase env variables are set in backend/.env
3. ✅ No typos in variable names
4. ✅ Private key has correct line breaks
```

### "Cannot find module 'firebase-admin'"
```bash
cd backend
npm install firebase-admin
```

### Login/Register Not Working
```
Check:
1. ✅ Frontend has REACT_APP_FIREBASE_* env vars
2. ✅ Backend has FIREBASE_* env vars or firebase-key.json
3. ✅ Firestore Database is created in Firebase Console
4. ✅ Authentication Email/Password is enabled
5. ✅ Check browser DevTools Console for errors
```

## 📚 Documentation Files

- [FIREBASE_COMPLETE_SETUP.md](FIREBASE_COMPLETE_SETUP.md) - Step-by-step Firebase setup
- [FIREBASE_INTEGRATION_SUMMARY.md](FIREBASE_INTEGRATION_SUMMARY.md) - Integration overview
- [COMPLETION_CHECKLIST.md](COMPLETION_CHECKLIST.md) - Full feature checklist
- [SETUP.md](SETUP.md) - Initial setup guide

## 🎓 Useful Commands

```bash
# Start backend
cd backend && npm start

# Start frontend
cd frontend && npm start

# Install new dependency (backend)
cd backend && npm install package-name

# Install new dependency (frontend)
cd frontend && npm install package-name

# Check if ports are in use
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# View backend logs
npm run dev --prefix backend

# View frontend logs
npm start --prefix frontend
```

## 🚀 Deployment

### Deploy to Firebase Hosting (Frontend)
```bash
cd frontend
npm run build
firebase deploy --only hosting
```

### Deploy to Cloud Run (Backend)
```bash
cd backend
gcloud run deploy smartkitchen-backend
```

## 📞 Support

If you encounter issues:

1. Check error messages in terminal
2. Check browser console (DevTools)
3. Check Firestore Console for data
4. Check Firebase Authentication for users
5. Enable debug logging in firebase.js

---

**Status:** ✅ All 21 features ready to use with Firebase authentication and Firestore database!
