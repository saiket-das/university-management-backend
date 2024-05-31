import express from 'express';
import { StudentControllers } from './student.controller';

const router = express.Router();

// Fetch all students
router.get('/', StudentControllers.getAllStudents);

// Fetch single student by Id
router.get('/:studentId', StudentControllers.getSingleStudentbyId);

// Delete single student by Id
router.delete('/:studentId', StudentControllers.deleteStudentById);

export const StudentRoutes = router;
