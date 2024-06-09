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

// Get a course by Id
router.get('/:courseId', CourseControllers.getSingleCourseById);

// Update a course info by Id
router.patch(
  '/:courseId',
  validateRequest(CourseValidations.updateCourseValidationSchema),
  CourseControllers.updateCourseById,
);

// Delete a course by Id
router.delete('/:courseId', CourseControllers.deleteCourseById);

// Assign course to faculties
router.put(
  '/:courseId/assign-course-to-faculties',
  validateRequest(CourseValidations.courseFacultyValidationSchema),
  CourseControllers.assignCourseToFaculties,
);

// Delete faculties from course
router.delete(
  '/:courseId/remove-faculties-from-course',
  validateRequest(CourseValidations.courseFacultyValidationSchema),
  CourseControllers.removeFacultiesFromCourse,
);

export const CourseRoutes = router;
