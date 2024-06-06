import express from 'express';
import validateRequest from '../../middlewares/validateRequestion';
import { UserControllers } from './user.controller';
import { StudentValidations } from '../student/student.validation';
import { FacultyValidations } from '../faculty/faculty.validation';

const router = express.Router();

// Create an user as a student & create a student
router.post(
  '/create-student',
  validateRequest(StudentValidations.createStudentValidationSchema),
  UserControllers.createStudent,
);

// Create an user as a student & create a student
router.post(
  '/create-faculty',
  validateRequest(FacultyValidations.createFacultyValidationSchema),
  UserControllers.createFaculty,
);

export const UserRoutes = router;
