import express from 'express';
import { StudentControllers } from './student.controller';
import validateRequest from '../../middlewares/validateRequestion';
import { StudentValidations } from './student.validation';

const router = express.Router();

// Fetch all students
router.get('/', StudentControllers.getAllStudents);

// Fetch single student by Id
router.get('/:studentId', StudentControllers.getSingleStudentbyId);

// Update single student info by Id
router.patch(
  '/:studentId',
  validateRequest(StudentValidations.updateStudentValidationSchema),
  StudentControllers.updateStudentById,
);

// Delete single student by Id
router.delete('/:studentId', StudentControllers.deleteStudentById);

export const StudentRoutes = router;
