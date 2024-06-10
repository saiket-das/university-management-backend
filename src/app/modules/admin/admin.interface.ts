import { Types } from 'mongoose';

export interface UserNameProps {
  firstName: string;
  lastName: string;
}

export interface AdminProps {
  id: string;

  name: UserNameProps;
  email: string;
  gender: 'male' | 'female' | 'others';
  dateOfBirth: Date;
  contactNumber: string;
  emergencyContactNumber: string;
  presentAddress: string;
  permanentAddress: string;
  bloodGroup?: 'A+' | 'B+' | 'O+' | 'AB+' | 'A-' | 'B-' | 'O-' | 'AB-';
  profileImage: string;
  user: Types.ObjectId;
  managementDepartment: Types.ObjectId;
  isDeleted?: boolean;
}
