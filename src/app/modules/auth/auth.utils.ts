import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';

export const generateToken = (
  jwtPayload: { userId: string; role: string },
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret as string, { expiresIn });
};
