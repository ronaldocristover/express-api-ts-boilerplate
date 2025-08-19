import { Router } from 'express';
import { UserController } from '@/controllers/user.controller';
import { validateZod } from '@/middlewares/validation';
import { apiLimiter, strictLimiter } from '@/middlewares/rateLimiter';
import {
  createUserSchema,
  updateUserSchema,
  userIdSchema,
  paginationSchema,
} from '@/validators/userValidators';

const router = Router();
const userController = new UserController();

router.get('/', apiLimiter, validateZod(paginationSchema), userController.getAllUsers);

router.get('/:id', apiLimiter, validateZod(userIdSchema), userController.getUserById);

router.post('/', strictLimiter, validateZod(createUserSchema), userController.createUser);

router.put('/:id', apiLimiter, validateZod(updateUserSchema), userController.updateUser);

router.delete('/:id', strictLimiter, validateZod(userIdSchema), userController.deleteUser);

export default router;
