import { Model } from 'mongoose';
import { UserRoleProps } from './user.constant';

export interface UserProps {
  id: string;
  password: string;
  needsPasswordChange: boolean;
  role: UserRoleProps;
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
}

export interface StaticUserModel extends Model<UserProps> {
  isUserExists(id: string): Promise<UserProps>; // is user exists
  isPasswordMatched(
    plainPassword: string,
    hashPassword: string,
  ): Promise<Boolean>;
}
