import express from 'express';
import { StudentControllers } from './student.controller';
import validateRequest from '../../middlewares/validateRequestion';
import { StudentValidations } from './student.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

// Fetch all students
router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
  StudentControllers.getAllStudents,
);

// Fetch single student by Id
router.get(
  '/:studentId',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
  StudentControllers.getSingleStudentbyId,
);

// Update single student info by Id
router.patch(
  '/:studentId',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.student),
  validateRequest(StudentValidations.updateStudentValidationSchema),
  StudentControllers.updateStudentById,
);

// Delete single student by Id
router.delete(
  '/:studentId',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  StudentControllers.deleteStudentById,
);

export const StudentRoutes = router;
