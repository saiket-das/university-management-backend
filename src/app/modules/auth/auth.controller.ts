import { Request, Response } from 'express';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catachAsync from '../../utils/catchAsync';
import { AuthServices } from './auth.service';

// Login user
const loginUser = catachAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.loginUserService(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User login successfully!',
    data: result,
  });
});

// Login user
const changePassword = catachAsync(async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  const result = await AuthServices.changePasswordService(
    req.user,
    oldPassword,
    newPassword,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Password changed successfully!',
    data: result,
  });
});

export const AuthControllers = {
  loginUser,
  changePassword,
};
