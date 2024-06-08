import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequestion';
import { CourseValidations } from './course.validation';
import { CourseControllers } from './course.controller';

const router = Router();

// Create a new course
router.post(
  '/',
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseControllers.createCourse,
);

// Get all courses
router.get('/', CourseControllers.getAllCourses);

export const CourseRoutes = router;
