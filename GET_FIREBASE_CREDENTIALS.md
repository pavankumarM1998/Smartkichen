# 🔧 Get Your Firebase Credentials

## Your Firebase Project
**Project ID:** `smartkitchen-ai-aed87`  
**URL:** https://console.firebase.google.com/u/0/project/smartkitchen-ai-aed87/overview

---

## ✅ Step 1: Get Service Account Key (For Backend)

1. Open Firebase Console → Click ⚙️ (Project Settings) at top right
2. Go to **Service Accounts** tab
3. Click **Generate New Private Key** button
4. A JSON file will download → **Save it carefully!**
5. **Copy the contents** of the JSON file
6. You need these values:
   - `project_id`
   - `private_key_id`
   - `private_key`
   - `client_email`
   - `client_id`
   - `auth_uri`
   - `token_uri`

---

## ✅ Step 2: Get Web App Config (For Frontend)

1. In Firebase Console → Click ⚙️ (Project Settings)
2. Go to **General** tab
3. Scroll to **Your apps** section
4. If no web app exists:
   - Click **Add app** → **Web** icon (</>)
   - Name it: `smartkitchen-web`
   - Click **Create app**
5. Copy the **firebaseConfig** object:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "smartkitchen-ai-aed87.firebaseapp.com",
  projectId: "smartkitchen-ai-aed87",
  storageBucket: "smartkitchen-ai-aed87.appspot.com",
  messagingSenderId: "...",
  appId: "1:...:web:...",
};
```

You need:
- `apiKey`
- `authDomain`
- `projectId`
- `storageBucket`
- `messagingSenderId`
- `appId`

---

## ✅ Step 3: Enable Authentication

1. In Firebase Console → **Authentication** (left sidebar)
2. Click **Get started**
3. Find **Email/Password** → Click it
4. Toggle **Enable** → Click **Save**

---

## ✅ Step 4: Create Firestore Database

1. In Firebase Console → **Firestore Database** (left sidebar)
2. Click **Create database**
3. Select **Production mode**
4. Choose region: `us-central1` (or your preference)
5. Click **Create**

---

## 📋 Share Your Credentials

Once you have the above, please provide:

### Backend (Service Account):
```
FIREBASE_PROJECT_ID=smartkitchen-ai-aed87
FIREBASE_PRIVATE_KEY_ID=<from JSON>
FIREBASE_PRIVATE_KEY=<from JSON>
FIREBASE_CLIENT_EMAIL=<from JSON>
FIREBASE_CLIENT_ID=<from JSON>
FIREBASE_AUTH_URI=<from JSON>
FIREBASE_TOKEN_URI=<from JSON>
FIREBASE_STORAGE_BUCKET=smartkitchen-ai-aed87.appspot.com
```

### Frontend (Web Config):
```
REACT_APP_FIREBASE_API_KEY=<from config>
REACT_APP_FIREBASE_AUTH_DOMAIN=<from config>
REACT_APP_FIREBASE_PROJECT_ID=smartkitchen-ai-aed87
REACT_APP_FIREBASE_STORAGE_BUCKET=<from config>
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=<from config>
REACT_APP_FIREBASE_APP_ID=<from config>
```

---

## 🔒 Security Tips

⚠️ **NEVER share these publicly:**
- Private key
- API key
- Service account credentials

✅ **ALWAYS keep in .env files** (not in git)
✅ **ALWAYS regenerate if accidentally exposed**

---

## ✨ Ready to Continue?

Once you've gathered the credentials above, paste them here and I'll:
1. ✅ Update your .env files
2. ✅ Set up Firestore security rules
3. ✅ Test the connection
4. ✅ Get everything running!

