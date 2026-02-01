// Firebase initialization and utilities
const admin = require('firebase-admin');
const serviceAccount = require('../firebase-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const bucket = admin.storage().bucket();

const uploadImageToFirebase = async (file) => {
  try {
    const timestamp = Date.now();
    const filename = `recipes/${timestamp}-${file.originalname}`;

    const blob = bucket.file(filename);

    await new Promise((resolve, reject) => {
      const blobStream = blob.createWriteStream();

      blobStream.on('finish', () => {
        resolve();
      });

      blobStream.on('error', (error) => {
        reject(error);
      });

      blobStream.end(file.buffer);
    });

    return `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${filename}`;
  } catch (error) {
    console.error('Firebase upload error:', error);
    throw error;
  }
};

const deleteImageFromFirebase = async (imageUrl) => {
  try {
    const filename = imageUrl.split('/').pop();
    await bucket.file(filename).delete();
  } catch (error) {
    console.error('Firebase delete error:', error);
  }
};

module.exports = {
  uploadImageToFirebase,
  deleteImageFromFirebase,
};
