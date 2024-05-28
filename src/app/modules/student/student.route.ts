import express from 'express';
import { StudentControllers } from './student.controller';

const router = express.Router();

router.get('/', StudentControllers.getAllStudents);

router.get('/:studentId', StudentControllers.getStudentbyId);
router.delete('/:studentId', StudentControllers.deleteStudentById);

export const StudentRoutes = router;
