import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catachAsync from '../../utils/catchAsync';

// Create a new student
const createStudent = catachAsync(async (req, res, next) => {
  const { password, student: studentData } = req.body;
  const result = await UserServices.createStudentService(password, studentData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Student create successfully!',
    data: result,
  });
});

export const UserControllers = {
  createStudent,
};
