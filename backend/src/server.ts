import { app } from './app.js';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import { seedData } from './scripts/seed.js';

const startServer = async () => {
  try {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Automatically seed initial sample users & items if DB is fresh
    await seedData(false);

    // 3. Start listening for incoming HTTP connections
    const server = app.listen(config.port, () => {
      console.log(`🚀 ReuseHub Backend Server running on http://localhost:${config.port}`);
      console.log(`📌 Health check at: http://localhost:${config.port}/api/health`);
      console.log(`🌱 Environment: ${config.nodeEnv}`);
    });

    const shutdown = () => {
      console.log('Shutting down server gracefully...');
      server.close(() => {
        console.log('Server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error: any) {
    console.error('Fatal: Failed to start backend server:', error.message);
    process.exit(1);
  }
};

startServer();
