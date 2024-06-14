import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequestion';
import { CourseValidations } from './course.validation';
import { CourseControllers } from './course.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

// Create a new course
router.post(
  '/',
  auth('admin'),
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseControllers.createCourse,
);

// Get all courses
router.get(
  '/',
  auth('admin', 'faculty', 'student'),
  CourseControllers.getAllCourses,
);

// Get a course by Id
router.get(
  '/:courseId',
  auth('admin', 'faculty', 'student'),
  CourseControllers.getSingleCourseById,
);

// Update a course info by Id
router.patch(
  '/:courseId',
  auth('admin'),
  validateRequest(CourseValidations.updateCourseValidationSchema),
  CourseControllers.updateCourseById,
);

// Delete a course by Id
router.delete('/:courseId', auth('admin'), CourseControllers.deleteCourseById);

// Assign course to faculties
router.put(
  '/:courseId/assign-course-to-faculties',
  auth('admin'),
  validateRequest(CourseValidations.courseFacultyValidationSchema),
  CourseControllers.assignCourseToFaculties,
);

// Delete faculties from course
router.delete(
  '/:courseId/remove-faculties-from-course',
  auth('admin'),
  validateRequest(CourseValidations.courseFacultyValidationSchema),
  CourseControllers.removeFacultiesFromCourse,
);

export const CourseRoutes = router;
