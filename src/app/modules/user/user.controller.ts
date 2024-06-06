import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catachAsync from '../../utils/catchAsync';

// Create a new student
const createStudent = catachAsync(async (req, res, next) => {
  const { password, student: payload } = req.body;
  const result = await UserServices.createStudentService(password, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Student created successfully!',
    data: result,
  });
});

// Create a new faculty
const createFaculty = catachAsync(async (req, res, next) => {
  const { password, faculty: payload } = req.body;
  const result = await UserServices.createFacultyService(password, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Faculty created successfully!',
    data: result,
  });
});

export const UserControllers = {
  createStudent,
  createFaculty,
};
