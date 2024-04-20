const request = require('supertest');
const authRoutes = require('../Routers/authRouter');
const express = require('express');
const bodyParser = require('body-parser'); // Import body-parser
const app = express();
const User = require('../Models/User');

// Use body-parser middleware to parse JSON bodies
app.use(bodyParser.json());

// Attach the authRoutes to the app
app.use('/auth', authRoutes);

// Valid and invalid tokens for testing
const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYwLCJ1c2VyVHlwZSI6ImNsaWVudCIsImxvY2F0aW9uIjoiTmFmdGEiLCJpYXQiOjE3MTIyMjI3OTZ9.7oaqpnS97p2gYSCbQgSZCGPq9D7TcJtyvx0jnPGG45A';
const invalidToken = 'invalid.token';

describe('Auth Controller Tests-Get All', () => {
  let createdUserId;

  // Test for GET /auth/users endpoint with valid token
  it('should get all users with valid token', async () => {
    const response = await request(app)
      .get('/auth/users')
      .set('Authorization', `${validToken}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  afterEach(async () => {
    if (createdUserId) {
      // If the user was created during testing, delete it
      await User.destroy({ where: { id: createdUserId } });
      createdUserId = null;
    }
  });

  // Add more tests for other auth routes here
});


describe('Auth Controller Tests-Get Clients', () => {
    let createdUserId;
  
    // Test for GET /auth/users endpoint with valid token
    it('should get all Client users with valid token', async () => {
      const response = await request(app)
        .get('/auth/users/clients')
        .set('Authorization', `${validToken}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  
    afterEach(async () => {
      if (createdUserId) {
        // If the user was created during testing, delete it
        await User.destroy({ where: { id: createdUserId } });
        createdUserId = null;
      }
    });
  
    // Add more tests for other auth routes here
  });

  describe('Auth Controller Tests-Get Tech', () => {
    let createdUserId;
  
    // Test for GET /auth/users endpoint with valid token
    it('should get all Tech users with valid token', async () => {
      const response = await request(app)
        .get('/auth/users/technicians')
        .set('Authorization', `${validToken}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  
    afterEach(async () => {
      if (createdUserId) {
        // If the user was created during testing, delete it
        await User.destroy({ where: { id: createdUserId } });
        createdUserId = null;
      }
    });
  
    // Add more tests for other auth routes here
  });

  describe('Auth Controller Tests-Get Chief', () => {
    let createdUserId;
  
    // Test for GET /auth/users endpoint with valid token
    it('should get all Chief users with valid token', async () => {
      const response = await request(app)
        .get('/auth/users/chief')
        .set('Authorization', `${validToken}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  
    afterEach(async () => {
      if (createdUserId) {
        // If the user was created during testing, delete it
        await User.destroy({ where: { id: createdUserId } });
        createdUserId = null;
      }
    });
  
    // Add more tests for other auth routes here
  });

describe('Auth Controller Tests - Signup', () => {
  let createdUserId;

  // Test for POST /auth/signup endpoint
  it('should signup a new user', async () => {
    const response = await request(app)
    .post('/auth/signup')
    .send({
      username: "testuser",
      email: 'testuser@example.com',
      password: 'password123',
      location: 'test location',
      userType: 'client',
      tel: '88888888',
      cin: '88888888'
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'User signed up successfully');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('username', 'testuser');
    expect(response.body.user).toHaveProperty('email', 'testuser@example.com');
    createdUserId = response.body.user.id; // Save the created user's ID for cleanup
  });

  afterEach(async () => {
    if (createdUserId) {
      // If the user was created during testing, delete it
      await User.destroy({ where: { id: createdUserId } });
      createdUserId = null;
    }
  });

  // Add more tests for other signup scenarios here
});

describe('Auth Controller Tests - Login', () => {
  let createdUserId;

  // Test for POST /auth/login endpoint
  it('should login with correct credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'louay@gmail.com',
        password: '12345678'
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  afterEach(async () => {
    if (createdUserId) {
      // If the user was created during testing, delete it
      await User.destroy({ where: { id: createdUserId } });
      createdUserId = null;
    }
  });

  // Add more tests for other login scenarios here
});
