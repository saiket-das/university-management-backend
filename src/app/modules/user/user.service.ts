import config from '../../config';
import { StudentProps } from '../student/student.interface';
import { StudentModel } from '../student/student.model';
import { UserProps } from './user.interface';
import { UserModel } from './user.model';

// Create a new student
const createStudentService = async (
  password: string,
  studentData: StudentProps,
) => {
  // create a user object
  const userData: Partial<UserProps> = {};
  // if password is not given, use default password
  userData.password = password || (config.default_password as string);
  // set student role
  userData.role = 'student';
  // set user id
  userData.id = '203010001';

  // create a user
  const newUser = await UserModel.create(userData);

  // create a student
  if (Object.keys(newUser).length) {
    // set id , _id as user
    studentData.id = newUser.id;
    studentData.user = newUser._id; //reference _id
    const newStudent = await StudentModel.create(studentData);
    return newStudent;
  }
};

export const UserServices = {
  createStudentService,
};
