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

export const OfferedCourseControllers = {
  createOfferedCourse,
};
