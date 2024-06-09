import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequestion';
import { OfferedCourseValidations } from './offeredCourse.validation';
import { OfferedCourseControllers } from './offeredCourse.controller';

const router = Router();

// Create a new offered course
router.post(
  '/',
  validateRequest(OfferedCourseValidations.createOfferedCourseValidationSchema),
  OfferedCourseControllers.createOfferedCourse,
);

// Get all offered courses

// Get a offered course by Id

// Update a offered course info by Id

export const OfferedCourseRoutes = router;
