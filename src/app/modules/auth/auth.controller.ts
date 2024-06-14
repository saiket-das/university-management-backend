import { Request, Response } from 'express';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catachAsync from '../../utils/catchAsync';
import { AuthServices } from './auth.service';
import config from '../../config';

// Login user
const loginUser = catachAsync(async (req: Request, res: Response) => {
  const { refreshToken, accessToken, needsPasswordChange } =
    await AuthServices.loginUserService(req.body);

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User login successfully!',
    data: { accessToken, needsPasswordChange },
  });
});

// Change password
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

// Refresh token
const refreshToken = catachAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshTokenService(refreshToken);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Access token is retrieved successfully!',
    data: result,
  });
});

export const AuthControllers = {
  loginUser,
  changePassword,
  refreshToken,
};
