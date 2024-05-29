import express from 'express';
import validateRequest from '../../middlewares/validateRequestion';
import { UserControllers } from './user.controller';

import { UserValidations } from './user.validation';

const router = express.Router();

router.post(
  '/create-student',
  validateRequest(UserValidations.userValidationSchema),
  UserControllers.createStudent,
);

export const UserRoutes = router;
