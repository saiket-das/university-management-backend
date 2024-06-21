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

// Create a new admin
const createAdmin = catachAsync(async (req, res, next) => {
  const { password, admin: payload } = req.body;
  const result = await UserServices.createAdminService(password, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Admin created successfully!',
    data: result,
  });
});

// Get me
const getMe = catachAsync(async (req, res) => {
  const token = req.headers.authorization as string;
  const user = req.user;
  const result = await UserServices.getMeService(user);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Get me successfully!',
    data: result,
  });
});

// Change status
const changeStatus = catachAsync(async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  const result = await UserServices.changeStatusService(id, status);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User status is updated successfully!',
    data: result,
  });
});

export const UserControllers = {
  createStudent,
  createFaculty,
  createAdmin,
  getMe,
  changeStatus,
};
