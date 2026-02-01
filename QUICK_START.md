# Quick Start Commands

## 🚀 Get Up and Running in 3 Steps

### Prerequisites Check
```bash
node --version    # Should be v18 or higher
npm --version     # Should be v9 or higher
```

---

## 📋 Step 1: Get Firebase Credentials

**Time: ~5-10 minutes**

1. Go to https://console.firebase.google.com/
2. Click "Add project" → Name it `smartkitchen-ai`
3. Go to **Authentication** → Enable **Email/Password**
4. Go to **Firestore Database** → Create in Production mode
5. Go to **Project Settings** (⚙️) → **Service Accounts** → **Generate Private Key** → Save JSON
6. In **Project Settings** → **General** → Copy web app config

---

## 🔧 Step 2: Configure Environment

### Option A: Using Service Account JSON File (Easiest)

```bash
# Copy the downloaded JSON file to backend folder
# On Windows:
copy "C:\Users\Downloads\smartkitchen-ai-xxxxx.json" "backend\firebase-key.json"

# On Mac/Linux:
cp ~/Downloads/smartkitchen-ai-xxxxx.json backend/firebase-key.json
```

### Option B: Using Environment Variables

Edit `backend/.env` and add:
```bash
FIREBASE_PROJECT_ID=your-project-id-here
FIREBASE_PRIVATE_KEY_ID=xxxxx
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@smartkitchen-ai.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=123456789
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_STORAGE_BUCKET=smartkitchen-ai.appspot.com
```

### Update Frontend .env

Edit `frontend/.env` and add:
```bash
REACT_APP_FIREBASE_API_KEY=AIzaSy...
REACT_APP_FIREBASE_AUTH_DOMAIN=smartkitchen-ai.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=smartkitchen-ai
REACT_APP_FIREBASE_STORAGE_BUCKET=smartkitchen-ai.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123
```

---

## ▶️ Step 3: Run the Servers

### Terminal 1 - Backend Server
```bash
cd backend
npm install           # Only needed first time
npm start
```

Expected output:
```
✅ Firebase Admin SDK initialized
🚀 SmartKitchen AI Backend running on port 5000
```

### Terminal 2 - Frontend Server (Open NEW terminal)
```bash
cd frontend
npm install           # Only needed first time
npm start
```

Expected output:
```
Compiled successfully!
Local: http://localhost:3000
```

---

## ✅ Test the Application

1. Open http://localhost:3000 in browser
2. Click **"Sign up"** button
3. Enter:
   - Email: `test@example.com`
   - Password: `Test123!`
   - Name: `Test User`
4. Click **"Sign up"**
5. Should see **Home Page** with all features

---

## 🎮 What You Can Do Now

✅ **Sign up** - Create new account
✅ **Login** - Login with email/password
✅ **Browse pages** - All 13 pages work
✅ **Try features** - All 21 features available
✅ **Refresh page** - Auto-login works!

---

## 🧪 Quick Tests

### Test 1: Sign Up
```
1. Click Sign up
2. Fill form
3. Click Sign up button
4. Should redirect to home
5. Check Firebase Console → Authentication → See new user
6. Check Firestore → Collection "users" → See user doc
```

### Test 2: Login
```
1. Click Logout
2. Click Login
3. Enter same email/password
4. Click Login button
5. Should redirect to home
6. User should be logged in
```

### Test 3: Auto-login
```
1. Login normally
2. Refresh page (Ctrl+R or Cmd+R)
3. Should NOT see login page
4. Should still be logged in
5. User data should load automatically
```

---

## 🆘 Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill the process
taskkill /PID <PID> /F

# Try again
npm start
```

### Frontend won't start
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <PID> /F

# Clear npm cache and reinstall
npm cache clean --force
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### Firebase errors
```
Check:
✅ firebase-key.json exists in backend/ folder
✅ OR Firebase env variables are set in backend/.env
✅ Frontend has REACT_APP_FIREBASE_* in frontend/.env
✅ Both servers restarted after changing .env
```

### Module not found errors
```bash
# Reinstall dependencies
cd backend && rm -rf node_modules && npm install
cd frontend && rm -rf node_modules && npm install
```

---

## 📂 Project Structure
```
SmartKitchen AI/
├── backend/
│   ├── firebase-key.json          ← Place downloaded JSON here
│   ├── .env                       ← OR add Firebase env vars here
│   ├── src/
│   │   ├── server.js
│   │   ├── controllers/
│   │   │   └── authControllerFirebase.js (NEW)
│   │   ├── middleware/
│   │   │   ├── auth.js (UPDATED)
│   │   │   └── firebaseAuth.js (NEW)
│   │   └── utils/
│   │       └── firebase.js
│   └── package.json
│
├── frontend/
│   ├── .env                       ← Add Firebase web config here
│   ├── src/
│   │   ├── hooks/
│   │   │   └── useAuth.js (UPDATED)
│   │   ├── utils/
│   │   │   └── firebase.js (NEW)
│   │   ├── pages/
│   │   │   └── (all 13 pages ready)
│   │   └── App.jsx
│   └── package.json
│
├── FIREBASE_COMPLETE_SETUP.md     ← Detailed setup guide
├── FIREBASE_STATUS.md              ← Status & next steps
├── FIREBASE_RUN_GUIDE.md           ← Full run guide
└── FIREBASE_INTEGRATION_SUMMARY.md ← Technical details
```

---

## 🎯 What's Next

After everything is working:

1. ✅ All 21 features work with Firebase
2. ✅ All user data persists
3. ✅ Ready for deployment
4. Optional: Set up custom domain
5. Optional: Configure payment (for monetization features)

---

## 📚 Full Documentation

- **Setup Details:** [FIREBASE_COMPLETE_SETUP.md](FIREBASE_COMPLETE_SETUP.md)
- **Architecture:** [FIREBASE_INTEGRATION_SUMMARY.md](FIREBASE_INTEGRATION_SUMMARY.md)
- **Full Guide:** [FIREBASE_RUN_GUIDE.md](FIREBASE_RUN_GUIDE.md)
- **Status:** [FIREBASE_STATUS.md](FIREBASE_STATUS.md)
- **All Features:** [COMPLETION_CHECKLIST.md](COMPLETION_CHECKLIST.md)

---

## ⏱️ Timeline

| Step | Action | Time |
|------|--------|------|
| 1 | Create Firebase project | 5 min |
| 2 | Download credentials | 2 min |
| 3 | Configure .env files | 3 min |
| 4 | Install dependencies | 3 min |
| 5 | Run backend server | 1 min |
| 6 | Run frontend server | 1 min |
| 7 | Test signup/login | 2 min |
| **TOTAL** | | **~20 min** |

---

**🚀 Ready to start? Follow the 3 steps above!**
