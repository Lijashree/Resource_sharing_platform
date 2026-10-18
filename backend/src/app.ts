import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import impactRoutes from './routes/impactRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

export const app = express();

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin) return callback(null, true);
      // In development, allow localhost on any port
      if (
        origin === config.clientUrl ||
        /^http:\/\/localhost:\d+$/.test(origin) ||
        /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)
      ) {
        return callback(null, true);
      }
      callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsers - up to 20MB for image data URLs
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Health Check Endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'ReuseHub API',
    timestamp: new Date().toISOString(),
    database: 'MongoDB',
    version: '1.0.0',
  });
});

// Application API Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/impact', impactRoutes);
app.use('/api/admin', adminRoutes);

// 404 Route Handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found.',
  });
});

// Global Centralized Error Handler
app.use(errorHandler);
