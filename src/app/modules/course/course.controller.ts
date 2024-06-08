import httpStatus from 'http-status';
import catachAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CourseServices } from './course.service';

const createCourse = catachAsync(async (req, res, next) => {
  const { course: payload } = req.body;
  const result = await CourseServices.createCourseService(payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Create a new course successfully!',
    data: result,
  });
});

const getAllCourses = catachAsync(async (req, res, next) => {
  const result = await CourseServices.getAllCoursesService();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Get all courses successfully!',
    data: result,
  });
});

const getSingleCourseById = catachAsync(async (req, res, next) => {
  const { courseId } = req.params;
  const result = await CourseServices.getSingleCourseByIdService(courseId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Get a course by Id successfully!',
    data: result,
  });
});

const deleteCourseById = catachAsync(async (req, res, next) => {
  const { courseId } = req.params;
  const result = await CourseServices.deleteCourseByIdService(courseId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Delete a course by Id successfully!',
    data: result,
  });
});

export const CourseControllers = {
  createCourse,
  getAllCourses,
  getSingleCourseById,
  deleteCourseById,
};
