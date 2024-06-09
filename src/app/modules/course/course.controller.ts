import httpStatus from 'http-status';
import catachAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CourseServices } from './course.service';

// Create a new course
const createCourse = catachAsync(async (req, res, next) => {
  const { course: payload } = req.body;
  const result = await CourseServices.createCourseService(payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Created a new course successfully!',
    data: result,
  });
});

// Get all courses
const getAllCourses = catachAsync(async (req, res, next) => {
  const result = await CourseServices.getAllCoursesService(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Fetched all courses successfully!',
    data: result,
  });
});

// Get a course by Id
const getSingleCourseById = catachAsync(async (req, res, next) => {
  const { courseId } = req.params;
  const result = await CourseServices.getSingleCourseByIdService(courseId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Fetched a course by Id successfully!',
    data: result,
  });
});

// Update a course info by Id
const updateCourseById = catachAsync(async (req, res, next) => {
  const { courseId } = req.params;
  const { course: payload } = req.body;
  const result = await CourseServices.updateCourseByIdService(
    courseId,
    payload,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Updated a course info by Id successfully!',
    data: result,
  });
});

// Delete a course by Id
const deleteCourseById = catachAsync(async (req, res, next) => {
  const { courseId } = req.params;
  const result = await CourseServices.deleteCourseByIdService(courseId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Deleted a course by Id successfully!',
    data: result,
  });
});

// Assign course to faculties
const assignCourseToFaculties = catachAsync(async (req, res, next) => {
  const { courseId } = req.params;
  const payload = req.body;
  const result = await CourseServices.assignCourseToFacultiesService(
    courseId,
    payload,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Assigned a course to multiple faculties successfully!',
    data: result,
  });
});

// Delete faculties from course
const removeFacultiesFromCourse = catachAsync(async (req, res, next) => {
  const { courseId } = req.params;
  const payload = req.body;
  const result = await CourseServices.removeFacultiesFromCourseService(
    courseId,
    payload,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Removed one or multiple faculties from course successfully!',
    data: result,
  });
});

export const CourseControllers = {
  createCourse,
  getAllCourses,
  getSingleCourseById,
  updateCourseById,
  deleteCourseById,
  assignCourseToFaculties,
  removeFacultiesFromCourse,
};
