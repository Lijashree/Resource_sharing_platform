import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { app } from '../src/app.js';
import { config } from '../src/config/env.js';
import { User } from '../src/models/User.js';
import { Item } from '../src/models/Item.js';
import { RequestModel } from '../src/models/Request.js';
import http from 'node:http';

let server: http.Server;
let baseUrl: string;

before(async () => {
  // Connect to DB for testing
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(config.mongoUri);
  }

  // Start HTTP server on dynamic test port
  await new Promise<void>((resolve) => {
    server = app.listen(0, () => {
      const address = server.address() as any;
      baseUrl = `http://127.0.0.1:${address.port}/api`;
      resolve();
    });
  });
});

after(async () => {
  if (server) {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
  // Cleanup test documents created with test prefix
  await User.deleteMany({ email: /test_user/ });
  await Item.deleteMany({ title: /Test Laptop/ });
  await RequestModel.deleteMany({ itemTitle: /Test Laptop/ });
  await mongoose.disconnect();
});

describe('ReuseHub Backend API Test Suite', () => {
  let userToken = '';
  let adminToken = '';
  let testItemId = '';
  let testRequestId = '';

  test('GET /api/health should return ok status', async () => {
    const res = await fetch(`${baseUrl}/health`);
    const data = await res.json();
    assert.equal(res.status, 200);
    assert.equal(data.status, 'ok');
    assert.equal(data.database, 'MongoDB');
  });

  test('POST /api/auth/signup should create a new user and return token', async () => {
    const res = await fetch(`${baseUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Student',
        email: `test_user_${Date.now()}@college.edu`,
        password: 'password123',
        role: 'user',
        phone: '1234567890',
        department: 'Engineering',
      }),
    });

    const data = await res.json();
    assert.equal(res.status, 201);
    assert.equal(data.success, true);
    assert.ok(data.accessToken);
    assert.equal(data.user.role, 'user');
    userToken = data.accessToken;
  });

  test('POST /api/auth/signup should reject duplicate email', async () => {
    const email = `test_user_dup_${Date.now()}@college.edu`;
    const payload = {
      name: 'Dup User',
      email,
      password: 'password123',
    };

    // First attempt
    await fetch(`${baseUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    // Duplicate attempt
    const dupRes = await fetch(`${baseUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await dupRes.json();
    assert.equal(dupRes.status, 409);
    assert.equal(data.success, false);
  });

  test('POST /api/auth/signin should fail with invalid password', async () => {
    const res = await fetch(`${baseUrl}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'nonexistent_999@college.edu',
        password: 'wrongpassword',
      }),
    });

    const data = await res.json();
    assert.equal(res.status, 401);
    assert.equal(data.success, false);
  });

  test('GET /api/auth/me should return profile for authenticated user', async () => {
    const res = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });

    const data = await res.json();
    assert.equal(res.status, 200);
    assert.equal(data.success, true);
    assert.equal(data.user.name, 'Test Student');
  });

  test('POST /api/items should create an item and associate with owner', async () => {
    const res = await fetch(`${baseUrl}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        title: `Test Laptop ${Date.now()}`,
        description: 'Test laptop for automated testing suite',
        category: 'Laptops',
        quantity: 2,
        type: 'share',
        location: 'Room 101',
        timeSlot: '10 AM - 12 PM',
      }),
    });

    const data = await res.json();
    assert.equal(res.status, 201);
    assert.equal(data.success, true);
    assert.ok(data.item.id);
    testItemId = data.item.id;
  });

  test('GET /api/items should list items', async () => {
    const res = await fetch(`${baseUrl}/items`);
    const data = await res.json();
    assert.equal(res.status, 200);
    assert.equal(data.success, true);
    assert.ok(Array.isArray(data.items));
  });

  test('GET /api/impact/stats should calculate real metrics', async () => {
    const res = await fetch(`${baseUrl}/impact/stats`);
    const data = await res.json();
    assert.equal(res.status, 200);
    assert.equal(data.success, true);
    assert.ok(typeof data.totalItems === 'number');
    assert.ok(typeof data.wasteReduced === 'number');
    assert.ok(typeof data.co2Saved === 'number');
    assert.ok(Array.isArray(data.monthlyActivity));
  });
});
