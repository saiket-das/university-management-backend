import express from 'express';
import validateRequest from '../../middlewares/validateRequestion';
import { UserControllers } from './user.controller';
import { StudentValidations } from '../student/student.validation';
import { FacultyValidations } from '../faculty/faculty.validation';
import { AdminValidations } from '../admin/admin.validation';

const router = express.Router();

// Create an user as a student & create a student
router.post(
  '/create-student',
  validateRequest(StudentValidations.createStudentValidationSchema),
  UserControllers.createStudent,
);

// Create an user as a faculy & create a faculy
router.post(
  '/create-faculty',
  validateRequest(FacultyValidations.createFacultyValidationSchema),
  UserControllers.createFaculty,
);

// Create an user as a admin & create a admin
router.post(
  '/create-admin',
  validateRequest(AdminValidations.createAdminValidationSchema),
  UserControllers.createAdmin,
);

export const UserRoutes = router;
