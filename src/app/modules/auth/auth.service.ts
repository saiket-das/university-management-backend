import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import AppError from '../../errors/AppError';
import { UserModel } from '../user/user.model';
import { LoginUserProps } from './auth.interface';
import config from '../../config';
import { generateToken } from './auth.utils';
import { StringExpression } from 'mongoose';

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

  // Generate a Access Token
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

export const AuthServices = {
  loginUserService,
  changePasswordService,
};
