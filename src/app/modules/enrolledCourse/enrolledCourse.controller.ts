import httpStatus from 'http-status';
import catachAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { EnrolledCourseServices } from './enrolledCourse.service';

// Create an enrolled course
const createEnrolledCourse = catachAsync(async (req, res, next) => {
  const userId = req.user.userId;
  const result = await EnrolledCourseServices.createEnrolledCourseService(
    userId,
    req.body,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Created a new course successfully!',
    data: result,
  });
});

// Create an enrolled course's info
const updateEnrolledCourseMarks = catachAsync(async (req, res, next) => {
  const { course: payload } = req.body;
  const result =
    await EnrolledCourseServices.updateEnrolledCourseMarksService(payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Created a new course successfully!',
    data: result,
  });
});

export const EnrolledCourseControllers = {
  createEnrolledCourse,
  updateEnrolledCourseMarks,
};
