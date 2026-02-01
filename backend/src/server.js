const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const admin = require('firebase-admin');
const { errorHandler } = require('./utils/response');

// Load environment variables
dotenv.config();

const app = express();

// Initialize Firebase Admin SDK
try {
  // Check if firebase key file exists, otherwise use environment variables
  const path = require('path');
  const keyPath = path.join(__dirname, '../firebase-key.json');
  const fs = require('fs');

  if (process.env.FIREBASE_CONFIG || process.env.FUNCTIONS_EMULATOR) {
    // Cloud Functions / Cloud Environment (Use Application Default Credentials)
    admin.initializeApp();
  } else if (fs.existsSync(keyPath)) {
    // Use key file if available (Local Development)
    const serviceAccount = require('../firebase-key.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com`,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
  } else if (process.env.FIREBASE_PRIVATE_KEY) {
    // Use environment variables (CI/CD or Render)
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        clientId: process.env.FIREBASE_CLIENT_ID,
        authUri: process.env.FIREBASE_AUTH_URI,
        tokenUri: process.env.FIREBASE_TOKEN_URI,
      }),
      databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
  }
  console.log('✅ Firebase Admin SDK initialized');
} catch (error) {
  console.warn('⚠️  Firebase Admin SDK not initialized:', error.message);
}

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/pantry', require('./routes/pantry'));
app.use('/api/recipes', require('./routes/recipes'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/meal-plan', require('./routes/mealPlan'));
app.use('/api/preferences', require('./routes/preferences'));
app.use('/api/shopping', require('./routes/shopping'));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 SmartKitchen AI Backend running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  process.exit(0);
});
