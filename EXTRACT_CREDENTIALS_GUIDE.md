# 📖 Detailed Guide: Extract Firebase Credentials

## Project: smartkitchen-ai-aed87

---

## 🔐 Part 1: Get Service Account Key (Backend Credentials)

### Steps:

1. **Open Firebase Console**
   - URL: https://console.firebase.google.com/u/0/project/smartkitchen-ai-aed87/overview
   - You should see your project dashboard

2. **Go to Project Settings**
   - Click the ⚙️ **gear icon** in the top-right corner
   - Select **Project Settings** from dropdown

3. **Navigate to Service Accounts Tab**
   - Click the **Service Accounts** tab (top navigation)
   - You should see options for different SDKs

4. **Generate Private Key**
   - Click the blue **"Generate New Private Key"** button
   - A dialog will appear asking to confirm
   - Click **Generate Key**
   - **A JSON file will automatically download** (save it!)

5. **Open the Downloaded JSON File**
   - Open with Notepad or text editor
   - It will look like:
   ```json
   {
     "type": "service_account",
     "project_id": "smartkitchen-ai-aed87",
     "private_key_id": "your-key-id",
     "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n",
     "client_email": "firebase-adminsdk-xxxxx@smartkitchen-ai-aed87.iam.gserviceaccount.com",
     "client_id": "123456789",
     "auth_uri": "https://accounts.google.com/o/oauth2/auth",
     "token_uri": "https://oauth2.googleapis.com/token",
     ...
   }
   ```

6. **Copy All Values**
   - You'll need these for `backend/.env`:
   - `project_id`
   - `private_key_id`
   - `private_key` (the entire multi-line key with `\n`)
   - `client_email`
   - `client_id`
   - `auth_uri`
   - `token_uri`

---

## 🌐 Part 2: Get Web App Config (Frontend Credentials)

### Steps:

1. **Still in Firebase Console**
   - URL: https://console.firebase.google.com/u/0/project/smartkitchen-ai-aed87/overview

2. **Go to Project Settings**
   - Click ⚙️ gear icon → **Project Settings**

3. **Go to General Tab**
   - Click the **General** tab (if not already there)

4. **Find Your Apps**
   - Scroll down to **"Your apps"** section
   - You might see a web app already, or need to add one

5. **If No Web App Exists:**
   - Click **"Add app"** button
   - Click the **Web** icon (`</>`)
   - Enter app name: `smartkitchen-web`
   - Check **"Also set up Firebase Hosting"** (optional)
   - Click **"Register app"**
   - Copy the config shown

6. **Get the Config Object**
   - You'll see code like:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyDx1D-qW5GZqCL_...",
     authDomain: "smartkitchen-ai-aed87.firebaseapp.com",
     projectId: "smartkitchen-ai-aed87",
     storageBucket: "smartkitchen-ai-aed87.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123def456",
   };
   ```

7. **Copy All Values**
   - You'll need these for `frontend/.env`:
   - `apiKey`
   - `authDomain`
   - `projectId` (already known: `smartkitchen-ai-aed87`)
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

---

## 🔑 Part 3: Enable Features

### Enable Authentication

1. **In Firebase Console**
   - Left sidebar → **Authentication**
   - Click **"Get started"** (if not set up)

2. **Enable Email/Password**
   - Find **"Email/Password"** provider
   - Click on it
   - Toggle **"Enable"**
   - Click **"Save"**

### Create Firestore Database

1. **In Firebase Console**
   - Left sidebar → **Firestore Database**
   - Click **"Create database"**

2. **Configure Database**
   - Select: **"Production mode"**
   - Location: `us-central1` (or your preferred region)
   - Click **"Create"**

---

## ✅ Summary of Credentials Needed

### For Backend `.env`:

```env
FIREBASE_PROJECT_ID=smartkitchen-ai-aed87
FIREBASE_PRIVATE_KEY_ID=<copy from service account JSON>
FIREBASE_PRIVATE_KEY=<copy from service account JSON - the entire key>
FIREBASE_CLIENT_EMAIL=<copy from service account JSON>
FIREBASE_CLIENT_ID=<copy from service account JSON>
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_STORAGE_BUCKET=smartkitchen-ai-aed87.appspot.com
```

### For Frontend `.env`:

```env
REACT_APP_FIREBASE_API_KEY=<copy from web config>
REACT_APP_FIREBASE_AUTH_DOMAIN=smartkitchen-ai-aed87.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=smartkitchen-ai-aed87
REACT_APP_FIREBASE_STORAGE_BUCKET=smartkitchen-ai-aed87.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=<copy from web config>
REACT_APP_FIREBASE_APP_ID=<copy from web config>
```

---

## 📋 Checklist

After collecting credentials:
- [ ] Have service account JSON downloaded
- [ ] Have all service account values
- [ ] Have web app config
- [ ] Have all web config values
- [ ] Email/Password authentication enabled
- [ ] Firestore database created
- [ ] Ready to share credentials

---

## 🔒 Important Notes

⚠️ **NEVER commit .env files to git!**
⚠️ **NEVER share credentials publicly!**
✅ **Keep .env files locally only**
✅ **Regenerate keys if accidentally exposed**

---

## 🚀 Next Steps

Once you have all the credentials:

1. **Share them with me** (in this chat)
2. **I'll update your .env files**
3. **I'll set up security rules**
4. **I'll test the connection**
5. **You'll run the servers and be ready to go!**

---

**Ready? Let me know when you have the credentials!** 👍
