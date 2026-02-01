// Debug script for Meal Planner
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Mock Express Request/Response
const req = {
    userId: 'test-user-id', // Using a dummy ID or a known existing one if possible
    body: {
        weekStartDate: new Date().toISOString().split('T')[0], // Today 'YYYY-MM-DD'
        servings: 4
    }
};

const res = {
    status: function (code) {
        this.statusCode = code;
        return this;
    },
    json: function (data) {
        console.log('---------------------------------------------------');
        console.log('RESPONSE STATUS:', this.statusCode);
        console.log('RESPONSE DATA:', JSON.stringify(data, null, 2));
        console.log('---------------------------------------------------');
        return this;
    }
};

const next = (error) => {
    console.error('---------------------------------------------------');
    console.error('CAUGHT ERROR:', error);
    if (error.response) {
        console.error('API Response Data:', error.response.data);
    }
    console.error('---------------------------------------------------');
};

// Import Controller
// We need to verify if we can authorize with Firebase without a service account
// If using admin SDK with default creds, it might fail if GOOGLE_APPLICATION_CREDENTIALS not set
// However, server.js initializes it. We might need to initialize firebase here too.

const admin = require('firebase-admin');
const fs = require('fs');

// Initialize Firebase (copied from server.js logic)
try {
    const keyPath = path.join(__dirname, 'firebase-key.json');
    if (fs.existsSync(keyPath)) {
        const serviceAccount = require(keyPath);
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                databaseURL: process.env.FIREBASE_DATABASE_URL || `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com`
            });
        }
        console.log('Firebase initialized with key file');
    } else {
        // Mock DB for AI part testing? No, we need DB for preferences.
        // If no key file, we rely on existing auth or mock it.
        // Let's assume standard initialization works or try to bypass if it fails early.
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.applicationDefault(), // or some other method
                databaseURL: process.env.FIREBASE_DATABASE_URL
            });
        }
        console.log('Firebase initialized with env/default');
    }
} catch (error) {
    console.error('Firebase Init Error:', error.message);
}

// Now verify we have necessary paths in realtimeDbService
// We can't easily patch the require cache from here for the service unless we use proxyquire.
// But we edited the file in previous step, so it should be good.

const mealPlanController = require('./src/controllers/mealPlanController');

console.log('Starting Meal Plan Generation Debug...');
console.log('Request Body:', req.body);

(async () => {
    try {
        await mealPlanController.generateMealPlan(req, res, next);
    } catch (e) {
        console.error('Unhandled script error:', e);
    }
})();
