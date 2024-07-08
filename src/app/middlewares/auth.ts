import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { UserRoleProps } from '../modules/user/user.constant';
import { UserModel } from '../modules/user/user.model';

// Validate JWT
const auth = (...requireRoles: UserRoleProps[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // check is token is sent from client
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    // check is Token valid or not
    let decoded;
    try {
      decoded = jwt.verify(
        token,
        config.jwt_access_token as string,
      ) as JwtPayload;
    } catch (error) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    // check is Role is valid or not
    const { userId, role, iat } = decoded;
    if (requireRoles && !requireRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    const user = await UserModel.isUserExists(userId);
    // check is user exists or not
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User is not found!');
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
      throw new AppError(httpStatus.FORBIDDEN, 'Password has been changed!');
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
