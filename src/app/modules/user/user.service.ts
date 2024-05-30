import config from '../../config';
import { AcademicSemesterProps } from '../academicSemester/academicSemester.interface';
import { academicSemesterModel } from '../academicSemester/academicSemester.model';
import { StudentProps } from '../student/student.interface';
import { StudentModel } from '../student/student.model';
import { UserProps } from './user.interface';
import { UserModel } from './user.model';
import { generateStudentId } from './user.utils';

// Create a new student
const createStudentService = async (
  password: string,
  payload: StudentProps,
) => {
  // create a user object
  const userData: Partial<UserProps> = {};
  // if password is not given, use default password
  userData.password = password || (config.default_password as string);
  // set student role
  userData.role = 'student';

  const admissionSemester = await academicSemesterModel.findById(
    payload.admissionSemester,
  );
  // generate a user id (expmple: 2025010000) and set as user id
  userData.id = await generateStudentId(
    admissionSemester as AcademicSemesterProps,
  );
  console.log(userData.id);

  // create a user
  const newUser = await UserModel.create(userData);

  // create a student
  if (Object.keys(newUser).length) {
    // set id , _id as user
    payload.id = newUser.id;
    payload.user = newUser._id; //reference _id
    const newStudent = await StudentModel.create(payload);
    return newStudent;
  }

  throw new Error('An error occurred while creating the new user!');
};

export const UserServices = {
  createStudentService,
};
