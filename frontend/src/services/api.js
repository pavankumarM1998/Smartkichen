import axios from 'axios';

import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Sign out from Firebase to trigger app-wide logout
      // This will update the useAuth hook and redirect via ProtectedRoute
      signOut(auth).catch((err) => console.error('Error signing out on 401:', err));
    }
    return Promise.reject(error);
  }
);

export default api;
