const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const { apiResponse } = require('../utils/response');

// Mock in-memory database for testing
let mockUsers = [
  {
    id: '1',
    email: 'test@test.com',
    password: '$2a$10$YIjlrDxPP5e0i8.D5bXUeOfXL8mPNvVmVn4AqLdXEjVNI.K0aOYLK', // hashed 'password123'
    name: 'Test User',
    createdAt: new Date(),
  }
];

const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return apiResponse(res, 400, false, 'Email, password, and name are required');
    }

    // Check if user exists
    const existingUser = mockUsers.find(u => u.email === email);

    if (existingUser) {
      return apiResponse(res, 400, false, 'User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = {
      id: String(mockUsers.length + 1),
      email,
      password: hashedPassword,
      name,
      createdAt: new Date(),
    };

    mockUsers.push(user);

    const token = generateToken(user.id);

    apiResponse(res, 201, true, 'User registered successfully', {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
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

    // Find user
    const user = mockUsers.find(u => u.email === email);

    if (!user) {
      return apiResponse(res, 401, false, 'Invalid credentials');
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return apiResponse(res, 401, false, 'Invalid credentials');
    }

    const token = generateToken(user.id);

    apiResponse(res, 200, true, 'Login successful', {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = mockUsers.find(u => u.id === req.userId);

    if (!user) {
      return apiResponse(res, 404, false, 'User not found');
    }

    apiResponse(res, 200, true, 'User retrieved successfully', user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
};
