import httpStatus from 'http-status';
import catachAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { OfferedCourseServices } from './offeredCourse.service';

// Create a new offered course
const createOfferedCourse = catachAsync(async (req, res, next) => {
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

// Create a new offered course
const getOfferedCourses = catachAsync(async (req, res, next) => {
  const result = await OfferedCourseServices.getOfferedCoursesService(
    req.query,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Fetched al offered courses successfully!',
    data: result,
  });
});

// Update a offered course info by Id
const updateOfferedCourse = catachAsync(async (req, res, next) => {
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
  updateOfferedCourse,
  getOfferedCourses,
};
