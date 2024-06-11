import { NextFunction, Request, Response } from 'express';

import catachAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { UserRoleProps } from '../modules/user/user.constant';

interface CustomRequest extends Request {
  user: JwtPayload;
}

// Validate JWT
const auth = (...requireRoles: UserRoleProps[]) => {
  return catachAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const token = req.headers.authorization;

      // check is token is sent from client
      if (!token) {
        throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized!');
      }

      // check is Token valid or not
      jwt.verify(
        token,
        config.jwt_access_token as string,
        function (err, decoded) {
          if (err) {
            throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized!');
          }
          const role = (decoded as JwtPayload).role;
          if (requireRoles && !requireRoles.includes(role)) {
            throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized!');
          }
          req.user = decoded as JwtPayload;
          next();
        },
      );
    },
  );
};

export default auth;
