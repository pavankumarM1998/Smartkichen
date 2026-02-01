const admin = require('firebase-admin');

// Get Realtime Database instance
const db = admin.database();

// Database paths
const paths = {
    users: 'users',
    ingredients: 'ingredients',
    pantryItems: 'pantryItems',
    recipes: 'recipes',
    mealPlans: 'mealPlans',
    mealPlanItems: 'mealPlanItems',
    preferences: 'preferences',
    shoppingLists: 'shoppingLists',
};

// Helper function to generate unique ID
const generateId = () => {
    return db.ref().push().key;
};

// Helper function to get a document by ID
const getDocById = async (path, docId) => {
    const snapshot = await db.ref(`${path}/${docId}`).once('value');
    if (!snapshot.exists()) {
        return null;
    }
    return { id: docId, ...snapshot.val() };
};

// Helper function to get all documents with a filter
const getDocs = async (path, filters = {}) => {
    let ref = db.ref(path);

    // Apply single filter if provided
    if (Object.keys(filters).length > 0) {
        const [field, value] = Object.entries(filters)[0];
        ref = ref.orderByChild(field).equalTo(value);
    }

    const snapshot = await ref.once('value');
    const data = [];

    snapshot.forEach((childSnapshot) => {
        data.push({
            id: childSnapshot.key,
            ...childSnapshot.val(),
        });
    });

    return data;
};

// Helper function to create a document
const createDoc = async (path, data) => {
    const id = generateId();
    const timestamp = Date.now();

    await db.ref(`${path}/${id}`).set({
        ...data,
        createdAt: timestamp,
        updatedAt: timestamp,
    });

    return { id, ...data, createdAt: timestamp, updatedAt: timestamp };
};

// Helper function to update a document
const updateDoc = async (path, docId, data) => {
    const timestamp = Date.now();

    await db.ref(`${path}/${docId}`).update({
        ...data,
        updatedAt: timestamp,
    });

    return getDocById(path, docId);
};

// Helper function to delete a document
const deleteDoc = async (path, docId) => {
    await db.ref(`${path}/${docId}`).remove();
    return true;
};

// Helper function to search documents by field
const searchDocs = async (path, field, searchTerm, limit = 10) => {
    const snapshot = await db.ref(path).once('value');
    const results = [];

    snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        if (data[field] && data[field].toLowerCase().includes(searchTerm.toLowerCase())) {
            results.push({
                id: childSnapshot.key,
                ...data,
            });
        }
    });

    return results.slice(0, limit);
};

module.exports = {
    db,
    paths,
    generateId,
    getDocById,
    getDocs,
    createDoc,
    updateDoc,
    deleteDoc,
    searchDocs,
};
