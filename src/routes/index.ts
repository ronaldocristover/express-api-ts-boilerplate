import { Router } from 'express';
import userRoutes from './user.route';

const router = Router();

// Register all route modules
router.use('/users', userRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API is running successfully',
    version: process.env.API_VERSION || 'v1',
    endpoints: {
      users: '/users',
      health: '/health (outside API scope)',
    },
  });
});

export default router;
