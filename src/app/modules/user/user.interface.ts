export interface UserProps {
  id: string;
  password: string;
  needsPasswordChange: string;
  role: 'admin' | 'faculty' | 'student';
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
}
