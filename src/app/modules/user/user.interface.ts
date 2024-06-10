import { Model } from 'mongoose';

export interface UserProps {
  id: string;
  password: string;
  needsPasswordChange: boolean;
  role: 'admin' | 'faculty' | 'student';
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
