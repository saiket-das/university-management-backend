import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CourseServices } from './course.service';

// Create a new course
const createCourse = catchAsync(async (req, res, next) => {
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
const getAllCourses = catchAsync(async (req, res, next) => {
  const result = await CourseServices.getAllCoursesService(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Fetched all courses successfully!',
    meta: result.meta,
    data: result.result,
  });
});

// Get a course by Id
const getSingleCourseById = catchAsync(async (req, res, next) => {
  const { courseId } = req.params;
  const result = await CourseServices.getSingleCourseByIdService(courseId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Fetched a course by Id successfully!',
    data: result,
  });
});

// Get assigned faculties with course
const getFacultiesWithCourse = catchAsync(async (req, res, next) => {
  const { courseId } = req.params;
  const result = await CourseServices.getFacultiesWithCourseService(courseId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Faculties retrieved with course succesfully',
    data: result,
  });
});

// Update a course info by Id
const updateCourseById = catchAsync(async (req, res, next) => {
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
const deleteCourseById = catchAsync(async (req, res, next) => {
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
const assignCourseToFaculties = catchAsync(async (req, res, next) => {
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
const removeFacultiesFromCourse = catchAsync(async (req, res, next) => {
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
  getFacultiesWithCourse,
  updateCourseById,
  deleteCourseById,
  assignCourseToFaculties,
  removeFacultiesFromCourse,
};
