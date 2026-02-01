const admin = require('firebase-admin');

// Get Firestore instance from initialized Firebase Admin
const db = admin.firestore();

// Collections
const collections = {
    users: 'users',
    ingredients: 'ingredients',
    pantryItems: 'pantryItems',
    recipes: 'recipes',
    mealPlans: 'mealPlans',
    preferences: 'preferences',
    shoppingLists: 'shoppingLists',
};

// Helper function to get a document by ID
const getDocById = async (collection, docId) => {
    const doc = await db.collection(collection).doc(docId).get();
    if (!doc.exists) {
        return null;
    }
    return { id: doc.id, ...doc.data() };
};

// Helper function to get all documents in a collection with a filter
const getDocs = async (collection, filters = {}) => {
    let query = db.collection(collection);

    // Apply filters
    Object.entries(filters).forEach(([field, value]) => {
        query = query.where(field, '==', value);
    });

    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Helper function to create a document
const createDoc = async (collection, data) => {
    const docRef = await db.collection(collection).add({
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
};

// Helper function to update a document
const updateDoc = async (collection, docId, data) => {
    await db.collection(collection).doc(docId).update({
        ...data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return getDocById(collection, docId);
};

// Helper function to delete a document
const deleteDoc = async (collection, docId) => {
    await db.collection(collection).doc(docId).delete();
    return true;
};

// Helper function to search documents by field
const searchDocs = async (collection, field, searchTerm, limit = 10) => {
    const snapshot = await db.collection(collection)
        .where(field, '>=', searchTerm.toLowerCase())
        .where(field, '<=', searchTerm.toLowerCase() + '\uf8ff')
        .limit(limit)
        .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

module.exports = {
    db,
    collections,
    getDocById,
    getDocs,
    createDoc,
    updateDoc,
    deleteDoc,
    searchDocs,
};
