import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

// Create a new student
const createStudent = catchAsync(async (req, res, next) => {
  const { password, student: payload } = req.body;
  const result = await UserServices.createStudentService(
    req.file,
    password,
    payload,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Student created successfully!',
    data: result,
  });
});

// Create a new faculty
const createFaculty = catchAsync(async (req, res, next) => {
  const { password, faculty: payload } = req.body;

  const result = await UserServices.createFacultyService(
    req.file,
    password,
    payload,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Faculty created successfully!',
    data: result,
  });
});

// Create a new admin
const createAdmin = catchAsync(async (req, res, next) => {
  const { password, admin: payload } = req.body;
  const result = await UserServices.createAdminService(
    req.file,
    password,
    payload,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Admin created successfully!',
    data: result,
  });
});

// Get me
const getMe = catchAsync(async (req, res) => {
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
const changeStatus = catchAsync(async (req, res) => {
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
