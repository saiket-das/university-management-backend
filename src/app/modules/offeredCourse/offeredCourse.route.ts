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
router.get('/', OfferedCourseControllers.getOfferedCourses);

// Get a offered course by Id

// Update a offered course info by Id
router.patch(
  '/:id',
  validateRequest(OfferedCourseValidations.updateOfferedCourseValidationSchema),
  OfferedCourseControllers.updateOfferedCourse,
);

export const OfferedCourseRoutes = router;
