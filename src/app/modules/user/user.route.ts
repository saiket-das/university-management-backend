import express from 'express';
import validateRequest from '../../middlewares/validateRequestion';
import { UserControllers } from './user.controller';
import { UserValidations } from './user.validation';
import { StudentValidations } from '../student/student.validation';

const router = express.Router();

// Create an user as a student & create a student
router.post(
  '/create-student',
  validateRequest(StudentValidations.createStudentValidationSchema),
  UserControllers.createStudent,
);

export const UserRoutes = router;
