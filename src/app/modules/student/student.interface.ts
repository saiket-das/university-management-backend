export interface UserNameProps {
  firstName: string;
  lastName: string;
}

export interface GuardianProps {
  fatherName: string;
  motherName: string;
}

export interface LocalGuardianProps {
  name: string;
  relation: string;
}

export interface Student {
  name: UserNameProps;
  password: string;
  email: string;
  gender: 'male' | 'female' | 'others';
  dateOfBirth: string;
  contactNumber: string;
  emergencyContactNumber: string;
  presentAddress: string;
  permanentAddress: string;
  guardian: GuardianProps;
  localGuardian: LocalGuardianProps;
  bloodGroup?: 'A+' | 'B+' | 'O+' | 'AB+' | 'A-' | 'B-' | 'O-' | 'AB-';
  address: string;
  profileImage: string;
  isDeleted?: boolean;
}
