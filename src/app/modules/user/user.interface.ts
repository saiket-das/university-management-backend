import { Model } from 'mongoose';
import { UserRoleProps } from './user.constant';

export interface UserProps {
  id: string;
  email: string;
  password: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
  role: UserRoleProps;
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
}

export interface StaticUserModel extends Model<UserProps> {
  // is user exists
  isUserExists(id: string): Promise<UserProps>;

  // given password & Database password match
  isPasswordMatched(
    plainPassword: string,
    hashPassword: string,
  ): Promise<Boolean>;

  // is JWT issued before password changed
  isJwtIssuedBeforePasswordChange(
    jwtIssueTimestamp: number,
    passwordChangedTimestamp: Date,
  ): boolean;
}
