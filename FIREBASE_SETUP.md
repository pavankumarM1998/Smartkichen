# Firebase Setup Guide for SmartKitchen AI

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `smartkitchen-ai`
4. Accept terms and create project
5. Wait for project to be created

## Step 2: Set Up Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Enable **Email/Password** sign-in method
4. Enable **Google** sign-in (optional)

## Step 3: Create Firestore Database

1. Go to **Firestore Database**
2. Click "Create database"
3. Choose **Production mode**
4. Select location (e.g., `us-central1`)
5. Create database

## Step 4: Get Backend Credentials (Service Account)

1. Go to **Project Settings** (⚙️ icon)
2. Click **Service Accounts** tab
3. Click **Generate New Private Key**
4. A JSON file will download
5. Copy contents to `backend/firebase-key.json`

## Step 5: Get Frontend Credentials (Web App Config)

1. In **Project Settings**, click **General** tab
2. Under "Your apps", click **Web icon** (</> )
3. If no app exists, register a new app
4. Copy the config object
5. Update `frontend/.env`

## Step 6: Update Environment Variables

**Backend (.env):**
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=from-json-key
FIREBASE_PRIVATE_KEY=from-json-key
FIREBASE_CLIENT_EMAIL=from-json-key
FIREBASE_CLIENT_ID=from-json-key
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
```

**Frontend (.env):**
```
REACT_APP_FIREBASE_API_KEY=from-web-config
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=from-web-config
REACT_APP_FIREBASE_APP_ID=from-web-config
```

## Firestore Security Rules

Go to **Firestore > Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Pantry items
    match /users/{userId}/pantry/{itemId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Recipes
    match /users/{userId}/recipes/{recipeId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Meal plans
    match /users/{userId}/mealPlans/{planId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Shopping lists
    match /users/{userId}/shoppingLists/{listId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

## Next Steps

Share your Firebase credentials, or I can guide you through getting them!
