import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import AppError from '../../errors/AppError';
import { UserModel } from '../user/user.model';
import { LoginUserProps } from './auth.interface';

// Login user
const loginUserService = async (payload: LoginUserProps) => {
  // check is user exists or not
  const isUserExists = await UserModel.findOne({ id: payload.id });
  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // check is user already deleted or not
  const isDeleted = isUserExists.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This account is deleted!');
  }

  // check is user already deleted or not
  const isBlocked = isUserExists.status;
  if (isBlocked === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This account is blocked!');
  }

  // check is give password correct or not
  const plainPassword = payload.password;
  const hashPassword = isUserExists.password;
  const isPasswordMatched = await bcrypt.compare(plainPassword, hashPassword);
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, 'Wrong password!');
  }

  // Access granted: send AccessToken, RefreshToken
  // return result;
};

export const AuthServices = {
  loginUserService,
};
