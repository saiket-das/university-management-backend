import { Types } from 'mongoose';

export interface UserNameProps {
  firstName: string;
  lastName: string;
}

export interface FacultyProps {
  id: string;
  password: string;
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
  academicDepartment: Types.ObjectId;
  academicFaculty: Types.ObjectId;
  isDeleted?: boolean;
}
