import express from 'express';
import validateRequest from '../../middlewares/validateRequestion';
import { UserControllers } from './user.controller';
import { createStudentValidationSchema } from '../student/student.validation';

const router = express.Router();

router.post(
  '/create-student',
  validateRequest(createStudentValidationSchema),
  UserControllers.createStudent,
);

export const UserRoutes = router;
