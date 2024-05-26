export interface UserName {
  firstName: string;
  lastName: string;
}

export interface Student {
  name: UserName;
  password: string;
  email: string;
  gender: 'male' | 'female' | 'others';
  dateOfBirth: string;
  contactNumber: string;
  bloodGroup?: 'A+' | 'B+' | 'O+' | 'AB+' | 'A-' | 'B-' | 'O-' | 'AB-';
  address: string;
  avatar: string;
  isActive?: 'active' | 'inactive';
  isDeleted?: boolean;
}
