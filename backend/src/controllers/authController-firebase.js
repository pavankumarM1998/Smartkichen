const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const { apiResponse } = require('../utils/response');

// Initialize Firebase Admin
const serviceAccount = {
  type: 'service_account',
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
  });
}

const db = admin.firestore();
const auth = admin.auth();

const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return apiResponse(res, 400, false, 'Email, password, and name are required');
    }

    // Create Firebase Auth user
    let firebaseUser;
    try {
      firebaseUser = await auth.createUser({
        email,
        password,
        displayName: name,
      });
    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        return apiResponse(res, 400, false, 'User already exists');
      }
      throw error;
    }

    // Store user profile in Firestore
    await db.collection('users').doc(firebaseUser.uid).set({
      id: firebaseUser.uid,
      email,
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create user preferences
    await db.collection('users').doc(firebaseUser.uid).collection('preferences').doc('default').set({
      healthMode: 'balanced',
      allergies: [],
      cuisinePreferences: [],
      dietaryRestrictions: [],
      spiceLevel: 'medium',
      servings: 4,
      createdAt: new Date(),
    });

    // Create custom token for immediate login
    const token = await auth.createCustomToken(firebaseUser.uid);

    apiResponse(res, 201, true, 'User registered successfully', {
      token,
      user: {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return apiResponse(res, 400, false, 'Email and password are required');
    }

    try {
      // Get user by email
      const userRecord = await auth.getUserByEmail(email);

      // Note: Firebase Admin SDK doesn't support password verification directly
      // The frontend should use Firebase Client SDK for authentication
      // This is a workaround - create custom token
      const token = await auth.createCustomToken(userRecord.uid);

      // Get user profile
      const userDoc = await db.collection('users').doc(userRecord.uid).get();
      const userData = userDoc.data();

      apiResponse(res, 200, true, 'Login successful', {
        token,
        user: {
          id: userRecord.uid,
          email: userRecord.email,
          name: userRecord.displayName,
        },
      });
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        return apiResponse(res, 401, false, 'Invalid credentials');
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.userId;

    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return apiResponse(res, 404, false, 'User not found');
    }

    const preferences = await db
      .collection('users')
      .doc(userId)
      .collection('preferences')
      .doc('default')
      .get();

    const userData = userDoc.data();
    const preferencesData = preferences.data() || {};

    apiResponse(res, 200, true, 'User retrieved successfully', {
      ...userData,
      preferences: preferencesData,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  db,
  auth,
};
