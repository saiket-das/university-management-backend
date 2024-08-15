import { Request, Response } from 'express';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { AuthServices } from './auth.service';
import config from '../../config';

// Login user
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken, accessToken, needsPasswordChange } =
    await AuthServices.loginUserService(req.body);

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    // Only for paid hosting
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User login successfully!',
    data: { accessToken, needsPasswordChange },
  });
});

// Change password
const changePassword = catchAsync(async (req: Request, res: Response) => {
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
const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshTokenService(refreshToken);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Access token is retrieved successfully!',
    data: result,
  });
});

// Forget password
const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  const userId = req.body.id;
  const result = await AuthServices.forgetPasswordService(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Reset link is generated successfully!',
    data: result,
  });
});

// Reset password
const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization as string;
  const result = await AuthServices.resetPasswordService(req.body, token);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Password is reset successfully!',
    data: result,
  });
});

export const AuthControllers = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
