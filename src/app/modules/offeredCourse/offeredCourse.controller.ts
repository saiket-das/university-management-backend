import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { OfferedCourseServices } from './offeredCourse.service';

// Create a new offered course
const createOfferedCourse = catchAsync(async (req, res, next) => {
  const result = await OfferedCourseServices.createOfferedCourseService(
    req.body,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Created a new offered course successfully!',
    data: result,
  });
});

// Get all courses
const getAllOfferedCourses = catchAsync(async (req, res, next) => {
  const result = await OfferedCourseServices.getAllOfferedCoursesService(
    req.query,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Fetched al offered courses successfully!',
    data: result,
  });
});

// Get all offered courses of a specific student
const getMyOfferedCourses = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await OfferedCourseServices.getMyOfferedCoursesService(
    userId,
    req.query,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'OfferedCourses retrieved successfully !',
    meta: result.meta,
    data: result.result,
  });
});

// Update a offered course info by Id
const updateOfferedCourse = catchAsync(async (req, res, next) => {
  const result = await OfferedCourseServices.updateOfferedCourseService(
    req.params.id,
    req.body,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Update a existing offered course info by id successfully!',
    data: result,
  });
});

export const OfferedCourseControllers = {
  createOfferedCourse,
  getAllOfferedCourses,
  getMyOfferedCourses,
  updateOfferedCourse,
};
