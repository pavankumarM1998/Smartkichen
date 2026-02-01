# ⚡ Quick Credential Extraction Checklist

## Your Firebase Project
**Project ID:** `smartkitchen-ai-aed87`  
**Console:** https://console.firebase.google.com/u/0/project/smartkitchen-ai-aed87

---

## ✅ Quick Steps (Copy-Paste Format)

### Step 1: Get Service Account Key
1. Go to Firebase Console
2. Click ⚙️ (top-right) → **Project Settings**
3. Click **Service Accounts** tab
4. Click blue **"Generate New Private Key"** button
5. A JSON file downloads → **Open it with Notepad**
6. Copy the JSON content

### Step 2: Get Web Config
1. Still in Firebase Console
2. Click ⚙️ → **Project Settings**
3. Click **General** tab
4. Scroll to **"Your apps"** 
5. If no web app:
   - Click **"Add app"** → **Web** icon (`</>`)
   - Name: `smartkitchen-web`
   - Click **"Register app"**
6. Copy the `firebaseConfig` object

### Step 3: Enable Features
1. **Authentication:** Left sidebar → **Authentication** → **Get started** → Enable **Email/Password**
2. **Firestore:** Left sidebar → **Firestore Database** → **Create database** → **Production mode** → Create

---

## 📝 What to Provide Me

When you're ready, share these values:

### From Service Account JSON:
```
project_id: [your-value]
private_key_id: [your-value]
private_key: [your-full-private-key-with-begin-end]
client_email: [your-value]
client_id: [your-value]
```

### From Web Config:
```
apiKey: [your-value]
authDomain: [your-value]
storageBucket: [your-value]
messagingSenderId: [your-value]
appId: [your-value]
```

---

## 🚀 Then I Will:
1. ✅ Update `backend/.env`
2. ✅ Update `frontend/.env`
3. ✅ Set up Firestore security rules
4. ✅ Test everything works
5. ✅ Get you running!

---

**Just copy and paste your values in the chat! 👍**
