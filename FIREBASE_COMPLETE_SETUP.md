# Firebase Integration Complete Setup

## ✅ What's Been Implemented

### Frontend (React)
- ✅ Firebase Client SDK integrated
- ✅ `useAuth` hook updated to use Firebase Auth
- ✅ firebaseAuth utility with register, login, logout methods
- ✅ Auto-reconnect on page refresh via `onAuthStateChanged`
- ✅ Token persistence in localStorage
- ✅ Environment variables configured

### Backend (Express)
- ✅ Firebase Admin SDK initialized in server.js
- ✅ `authControllerFirebase.js` with Firebase methods
- ✅ Firestore database integration ready
- ✅ Auth routes configured to use Firebase
- ✅ Optional features: updateProfile, changePassword, deleteAccount
- ✅ Environment variables configured

## 🔧 How to Complete Firebase Setup

### Option 1: Quick Setup (Recommended for Testing)

#### 1. Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Name: `smartkitchen-ai`
4. Accept terms → Create project

#### 2. Enable Authentication
1. Click "Authentication" (left sidebar)
2. Click "Get started"
3. Click "Email/Password"
4. Toggle "Enable" → Save

#### 3. Create Firestore Database
1. Click "Firestore Database" (left sidebar)
2. Click "Create database"
3. Select "Production mode"
4. Choose region (default is fine)
5. Create

#### 4. Get Backend Credentials
1. Click ⚙️ (Project Settings) → top right
2. Click "Service Accounts" tab
3. Click "Generate New Private Key"
4. Save the downloaded JSON file

**Option A: Using JSON File (Recommended)**
- Place the JSON file in: `backend/firebase-key.json`
- Server will auto-detect it

**Option B: Using Environment Variables**
- Open the JSON file
- Copy these values to `backend/.env`:
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=the-key-id
FIREBASE_PRIVATE_KEY=the-full-private-key (keep line breaks as \n)
FIREBASE_CLIENT_EMAIL=the-service-account-email
FIREBASE_CLIENT_ID=the-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
```

#### 5. Get Frontend Credentials
1. In Project Settings, click "General" tab
2. Under "Your apps", look for a Web app
3. If none exists, click "Add app" → "Web"
4. Copy the firebaseConfig object

Update `frontend/.env`:
```
REACT_APP_FIREBASE_API_KEY=copy-from-config
REACT_APP_FIREBASE_AUTH_DOMAIN=copy-from-config
REACT_APP_FIREBASE_PROJECT_ID=copy-from-config
REACT_APP_FIREBASE_STORAGE_BUCKET=copy-from-config
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=copy-from-config
REACT_APP_FIREBASE_APP_ID=copy-from-config
```

#### 6. Set Firestore Security Rules
1. In Firestore Database, click "Rules" tab
2. Replace with:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Preferences collection
    match /preferences/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Pantry collection
    match /pantry/{userId}/items/{itemId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Recipes collection
    match /recipes/{userId}/saved/{recipeId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Meal plans collection
    match /mealPlans/{userId}/plans/{planId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Shopping lists collection
    match /shoppingLists/{userId}/lists/{listId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```
3. Click "Publish"

#### 7. Restart Servers
```bash
# Backend
cd backend
npm start

# Frontend (in another terminal)
cd frontend
npm start
```

#### 8. Test the App
1. Open http://localhost:3000
2. Click "Sign up" on login page
3. Enter email, password, and name
4. You should be logged in!

## 🗄️ Database Structure

The app auto-creates this Firestore structure:

```
users/{userId}
  - id: string
  - email: string
  - name: string
  - createdAt: timestamp
  - updatedAt: timestamp
  - profilePicture?: string
  - bio?: string

preferences/{userId}
  - userId: string
  - dietaryRestrictions: array
  - allergies: array
  - cuisinePreferences: array
  - difficultyLevel: string (easy|medium|hard)
  - servingSize: number
  - createdAt: timestamp
  - updatedAt: timestamp

pantry/{userId}/items/{itemId}
  - itemId: string
  - name: string
  - quantity: number
  - unit: string
  - expiryDate: timestamp

recipes/{userId}/saved/{recipeId}
  - recipeId: string
  - title: string
  - description: string
  - difficulty: string
  - prepTime: number
  - cookTime: number

mealPlans/{userId}/plans/{planId}
  - planId: string
  - date: date
  - meals: array

shoppingLists/{userId}/lists/{listId}
  - listId: string
  - items: array
  - createdAt: timestamp
```

## 🐛 Troubleshooting

### "Firebase configuration not found"
- Ensure all `REACT_APP_FIREBASE_*` variables are in `frontend/.env`
- Restart frontend dev server after updating .env

### "Firebase Admin SDK not initialized"
- Place `firebase-key.json` in `backend/` folder, OR
- Add all Firebase env variables to `backend/.env`
- Restart backend server

### "Permission denied" errors
- Check Firestore security rules are published
- Ensure user is authenticated before making requests

### "User created but can't login"
- Check Firebase Authentication shows the user
- Verify email/password are correct
- Clear browser localStorage and try again

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security)
- [Firebase Auth Best Practices](https://firebase.google.com/docs/auth/best-practices)

## 🎯 Next Steps

After Firebase setup:

1. ✅ Authentication fully functional
2. ✅ User data persisted in Firestore
3. ✅ Auto-login on page refresh
4. ✅ All 21 features working with Firebase backend

All frontend pages are ready to save/retrieve data from Firestore!

---

**Need help?** Check the terminal for detailed error messages. Enable verbose Firebase logging in `firebase.js` if needed.
