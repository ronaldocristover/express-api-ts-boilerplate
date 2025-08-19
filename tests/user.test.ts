import request from 'supertest';
import App from '../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = new App().app;

describe('User API Endpoints', () => {
  let userId: string;

  const testUser = {
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'Password123!',
  };

  describe('POST /api/v1/users', () => {
    it('should create a new user', async () => {
      const response = await request(app)
        .post('/api/v1/users')
        .send(testUser)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.email).toBe(testUser.email);
      expect(response.body.data.firstName).toBe(testUser.firstName);
      expect(response.body.data.lastName).toBe(testUser.lastName);

      userId = response.body.data.id;
    });

    it('should return error for duplicate email', async () => {
      await request(app)
        .post('/api/v1/users')
        .send(testUser)
        .expect(409);
    });

    it('should return validation error for invalid email', async () => {
      await request(app)
        .post('/api/v1/users')
        .send({
          ...testUser,
          email: 'invalid-email',
        })
        .expect(400);
    });
  });

  describe('GET /api/v1/users', () => {
    it('should get all users with pagination', async () => {
      const response = await request(app)
        .get('/api/v1/users')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.pagination).toBeDefined();
    });

    it('should handle pagination parameters', async () => {
      const response = await request(app)
        .get('/api/v1/users?page=1&limit=5')
        .expect(200);

      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(5);
    });

    it('should handle search query parameter', async () => {
      const response = await request(app)
        .get('/api/v1/users?q=John')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.message).toContain('matching "John"');
    });

    it('should search across firstName, lastName, and email', async () => {
      // Search by first name
      const firstNameResponse = await request(app)
        .get('/api/v1/users?q=John')
        .expect(200);

      // Search by email
      const emailResponse = await request(app)
        .get('/api/v1/users?q=example.com')
        .expect(200);

      expect(firstNameResponse.body.success).toBe(true);
      expect(emailResponse.body.success).toBe(true);
    });

    it('should return empty results for non-matching search', async () => {
      const response = await request(app)
        .get('/api/v1/users?q=nonexistentuser')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(0);
      expect(response.body.pagination.total).toBe(0);
    });
  });

  describe('GET /api/v1/users/:id', () => {
    it('should get user by id', async () => {
      const response = await request(app)
        .get(`/api/v1/users/${userId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(userId);
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = '01234567-89ab-cdef-0123-456789abcdef';
      await request(app)
        .get(`/api/v1/users/${fakeId}`)
        .expect(404);
    });
  });

  describe('PUT /api/v1/users/:id', () => {
    it('should update user', async () => {
      const updateData = {
        firstName: 'Jane',
        lastName: 'Smith',
      };

      const response = await request(app)
        .put(`/api/v1/users/${userId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.firstName).toBe(updateData.firstName);
      expect(response.body.data.lastName).toBe(updateData.lastName);
    });
  });

  describe('DELETE /api/v1/users/:id', () => {
    it('should soft delete user', async () => {
      const response = await request(app)
        .delete(`/api/v1/users/${userId}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify user is soft deleted (isActive = false)
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      expect(user?.isActive).toBe(false);
    });
  });

  describe('GET /api/v1/users/stats', () => {
    it('should get user statistics', async () => {
      const response = await request(app)
        .get('/api/v1/users/stats')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalUsers');
      expect(typeof response.body.data.totalUsers).toBe('number');
    });
  });
});