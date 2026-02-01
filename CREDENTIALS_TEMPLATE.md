# 📋 Firebase Credentials Template

**Copy this format and fill in your values from Firebase Console**

---

## Backend Credentials (From Service Account JSON)

```
FIREBASE_PROJECT_ID=smartkitchen-ai-aed87
FIREBASE_PRIVATE_KEY_ID=paste-your-private_key_id-here
FIREBASE_PRIVATE_KEY=paste-your-private_key-here (include the -----BEGIN PRIVATE KEY----- and -----END PRIVATE KEY----- lines)
FIREBASE_CLIENT_EMAIL=paste-your-client_email-here
FIREBASE_CLIENT_ID=paste-your-client_id-here
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_STORAGE_BUCKET=smartkitchen-ai-aed87.appspot.com
```

---

## Frontend Credentials (From Web Config)

```
REACT_APP_FIREBASE_API_KEY=paste-your-apiKey-here
REACT_APP_FIREBASE_AUTH_DOMAIN=paste-your-authDomain-here
REACT_APP_FIREBASE_PROJECT_ID=smartkitchen-ai-aed87
REACT_APP_FIREBASE_STORAGE_BUCKET=paste-your-storageBucket-here
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=paste-your-messagingSenderId-here
REACT_APP_FIREBASE_APP_ID=paste-your-appId-here
```

---

## ✅ Where to Find These Values

### Service Account JSON (For Backend):
- **File:** Download from Firebase Console → Project Settings → Service Accounts → Generate Private Key
- **private_key_id:** In the JSON file
- **private_key:** In the JSON file (multi-line, keep as is)
- **client_email:** In the JSON file
- **client_id:** In the JSON file

### Web Config (For Frontend):
- **Firebase Console:** Project Settings → General tab → Your apps → Web app
- **apiKey:** From the firebaseConfig object
- **authDomain:** From the firebaseConfig object
- **storageBucket:** From the firebaseConfig object
- **messagingSenderId:** From the firebaseConfig object
- **appId:** From the firebaseConfig object

---

## 🚀 When Ready

1. Fill in the template above with your values
2. Paste it in the chat
3. I'll configure everything!

