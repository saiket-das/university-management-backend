import { ObjectId, Types } from 'mongoose';

export interface UserNameProps {
  firstName: string;
  lastName: string;
}

export interface GuardianProps {
  fatherName: string;
  fatherOccupation: string;
  fatherContactNo: string;
  motherName: string;
  motherOccupation: string;
  motherContactNo: string;
}

export interface LocalGuardianProps {
  name: string;
  occupation: string;
  contactNo: string;
  address: string;
}

export interface StudentProps {
  id: string;
  name: UserNameProps;
  email: string;
  gender: 'male' | 'female' | 'others';
  dateOfBirth: Date;
  contactNumber: string;
  emergencyContactNumber: string;
  presentAddress: string;
  permanentAddress: string;
  guardian: GuardianProps;
  localGuardian: LocalGuardianProps;
  bloodGroup?: 'A+' | 'B+' | 'O+' | 'AB+' | 'A-' | 'B-' | 'O-' | 'AB-';
  profileImage: string;
  user: Types.ObjectId;
  admissionSemester: Types.ObjectId;
  academicDepartment: Types.ObjectId;
  academicFaculty: Types.ObjectId;
  isDeleted?: boolean;
}
