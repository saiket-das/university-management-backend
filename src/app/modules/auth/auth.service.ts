import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import AppError from '../../errors/AppError';
import { UserModel } from '../user/user.model';
import { LoginUserProps } from './auth.interface';
import config from '../../config';
import { generateToken } from './auth.utils';
import { sendEmail } from '../../utils/sendEmail';

// Login user
const loginUserService = async (payload: LoginUserProps) => {
  const user = await UserModel.isUserExists(payload.id);
  // check is user exists or not
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // check is user already deleted or not
  const isDeleted = user.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This account is deleted!');
  }

  // check is user already deleted or not
  const isBlocked = user.status;
  if (isBlocked === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This account is blocked!');
  }

  // check is give password correct or not
  const plainPassword = payload.password;
  const hashPassword = user.password;
  if (!(await UserModel.isPasswordMatched(plainPassword, hashPassword))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Wrong password!');
  }

  // Access granted: send AccessToken, RefreshToken
  // Create access JWT and refresh JWT
  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };
  // Generate an Access Token
  const accessToken = generateToken(
    jwtPayload,
    config.jwt_access_token as string,
    config.jwt_access_token_expires_in as string,
  );
  // Generate a Refresh Token
  const refreshToken = generateToken(
    jwtPayload,
    config.jwt_refresh_token as string,
    config.jwt_refresh_token_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user.needsPasswordChange,
  };
};

const changePasswordService = async (
  userPayload: JwtPayload,
  oldPassword: string,
  newPassword: string,
) => {
  const user = await UserModel.isUserExists(userPayload.userId);
  // check is user exists or not
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // check is user already deleted or not
  const isDeleted = user.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This account is deleted!');
  }

  // check is user already deleted or not
  const isBlocked = user.status;
  if (isBlocked === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This account is blocked!');
  }

  // check is give password correct or not
  const plainPassword = oldPassword;
  const hashPassword = user.password;
  if (!(await UserModel.isPasswordMatched(plainPassword, hashPassword))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Wrong password!');
  }

  // bcrypt new password
  const hashNewPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await UserModel.findOneAndUpdate(
    { id: user.id, role: user.role },
    {
      password: hashNewPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
    { new: true, runValidators: true },
  );
};

const refreshTokenService = async (refreshToken: string) => {
  // check is Token valid or not
  const decoded = jwt.verify(
    refreshToken,
    config.jwt_refresh_token as string,
  ) as JwtPayload;

  // check is Role is valid or not
  const { userId, iat } = decoded;

  // check is user exists or not
  const user = await UserModel.isUserExists(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // check is user already deleted or not
  const isDeleted = user.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This account is deleted!');
  }

  // check is user already deleted or not
  const isBlocked = user.status;
  if (isBlocked === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This account is blocked!');
  }

  // check is password changed or not
  const passwordChangedAt = user.passwordChangedAt;
  if (
    user.passwordChangedAt &&
    UserModel.isJwtIssuedBeforePasswordChange(
      iat as number,
      passwordChangedAt as Date,
    )
  ) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password changed!');
  }

  // Generate a Access Token
  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };
  const accessToken = generateToken(
    jwtPayload,
    config.jwt_access_token as string,
    config.jwt_access_token_expires_in as string,
  );

  return {
    accessToken,
  };
};

// Forget password
const forgetPasswordService = async (userId: string) => {
  // check is user exists or not
  const user = await UserModel.isUserExists(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // check is user already deleted or not
  const isDeleted = user.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This account is deleted!');
  }

  // check is user already deleted or not
  const isBlocked = user.status;
  if (isBlocked === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This account is blocked!');
  }

  // Generate a Access Token
  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };
  const resetToken = generateToken(
    jwtPayload,
    config.jwt_access_token as string,
    '10m',
  );

  const resetLink = `${config.reset_password_ui_link}?id=${user.id}&toekn=${resetToken}`;
  sendEmail(user.email, resetLink);

  return null;
};

// Reset password
const resetPasswordService = async (
  payload: { id: string; newPassword: string },
  token: string,
) => {
  // check is Token valid or not
  const decoded = jwt.verify(
    token,
    config.jwt_access_token as string,
  ) as JwtPayload;

  const { userId, role } = decoded;

  if (userId != payload.id) {
    throw new AppError(httpStatus.NOT_FOUND, 'User id is not same!');
  }

  // check is user exists or not
  const user = await UserModel.isUserExists(payload.id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // check is user already deleted or not
  const isDeleted = user.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This account is deleted!');
  }

  // check is user already deleted or not
  const isBlocked = user.status;
  if (isBlocked === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This account is blocked!');
  }

  // bcrypt new password
  const hashNewPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await UserModel.findOneAndUpdate(
    { id: userId, role: role },
    {
      password: hashNewPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
    { new: true, runValidators: true },
  );
};

export const AuthServices = {
  loginUserService,
  changePasswordService,
  refreshTokenService,
  forgetPasswordService,
  resetPasswordService,
};
