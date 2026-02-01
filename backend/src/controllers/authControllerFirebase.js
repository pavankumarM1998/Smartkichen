const admin = require('firebase-admin');
const db = admin.firestore();

// Register a new user
exports.register = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // Create user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name || email.split('@')[0],
    });

    // Create user document in Firestore
    const userData = {
      id: userRecord.uid,
      email: userRecord.email,
      name: name || userRecord.displayName,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('users').doc(userRecord.uid).set(userData);

    // Create default user preferences
    await db.collection('preferences').doc(userRecord.uid).set({
      userId: userRecord.uid,
      dietaryRestrictions: [],
      allergies: [],
      cuisinePreferences: [],
      difficultyLevel: 'medium',
      servingSize: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Generate custom token for immediate login
    const token = await admin.auth().createCustomToken(userRecord.uid);

    res.status(201).json({
      status: 'success',
      data: {
        token,
        user: userData,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Get user by email (requires Firebase Admin SDK)
    const userRecord = await admin.auth().getUserByEmail(email);

    // Verify password - note: Firebase Admin SDK doesn't directly verify passwords
    // This should be done via Firebase Client SDK on frontend, then token sent to backend
    // For now, we'll generate a token for the user
    const token = await admin.auth().createCustomToken(userRecord.uid);

    // Get user data from Firestore
    const userDoc = await db.collection('users').doc(userRecord.uid).get();
    const userData = userDoc.data() || {
      id: userRecord.uid,
      email: userRecord.email,
      name: userRecord.displayName,
    };

    res.status(200).json({
      status: 'success',
      data: {
        token,
        user: userData,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({
      status: 'error',
      message: 'Invalid email or password',
    });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId; // Set by firebaseAuth middleware

    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized',
      });
    }

    // Get user from Firestore
    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: userDoc.data(),
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, profilePicture, bio } = req.body;

    const updateData = {
      updatedAt: new Date(),
    };

    if (name) updateData.name = name;
    if (profilePicture) updateData.profilePicture = profilePicture;
    if (bio) updateData.bio = bio;

    await db.collection('users').doc(userId).update(updateData);

    // Also update auth display name
    if (name) {
      await admin.auth().updateUser(userId, { displayName: name });
    }

    const userDoc = await db.collection('users').doc(userId).get();

    res.status(200).json({
      status: 'success',
      data: userDoc.data(),
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { newPassword } = req.body;

    await admin.auth().updateUser(userId, { password: newPassword });

    res.status(200).json({
      status: 'success',
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Delete account
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.userId;

    // Delete user data from Firestore
    await db.collection('users').doc(userId).delete();
    await db.collection('preferences').doc(userId).delete();

    // Delete user from Firebase Auth
    await admin.auth().deleteUser(userId);

    res.status(200).json({
      status: 'success',
      message: 'Account deleted successfully',
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};
