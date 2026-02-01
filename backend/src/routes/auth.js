const express = require('express');
const router = express.Router();

// Try to use Firebase auth controller if Firebase is configured, otherwise use mock
let authController;

try {
  // Check if Firebase is configured
  if (process.env.FIREBASE_PROJECT_ID) {
    authController = require('../controllers/authControllerFirebase');
  } else {
    authController = require('../controllers/authController');
  }
} catch (error) {
  // Fallback to default auth controller
  authController = require('../controllers/authController');
}

const authMiddleware = require('../middleware/auth');

// Register
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Get current user
router.get('/me', authMiddleware, authController.getCurrentUser);

// Update profile (Firebase auth controller only)
if (authController.updateProfile) {
  router.put('/profile', authMiddleware, authController.updateProfile);
}

// Change password (Firebase auth controller only)
if (authController.changePassword) {
  router.post('/change-password', authMiddleware, authController.changePassword);
}

// Delete account (Firebase auth controller only)
if (authController.deleteAccount) {
  router.delete('/delete-account', authMiddleware, authController.deleteAccount);
}

module.exports = router;
