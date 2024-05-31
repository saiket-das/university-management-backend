import config from '../../config';
import { AcademicSemesterProps } from '../academicSemester/academicSemester.interface';
import { AcademicSemesterModel } from '../academicSemester/academicSemester.model';
import { StudentProps } from '../student/student.interface';
import { StudentModel } from '../student/student.model';
import { UserProps } from './user.interface';
import { UserModel } from './user.model';
import { generateUserId } from './user.utils';

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

  const admissionSemester = await AcademicSemesterModel.findById(
    payload.admissionSemester,
  );
  // generate a user id (expmple: 2025010000) and set as user id
  userData.id = await generateUserId(
    admissionSemester as AcademicSemesterProps,
  );

  // check if student (email) already exists or not
  const studentExists = await StudentModel.findOne({ email: payload.email });
  if (studentExists) {
    throw new Error(`Student already exists with ${payload.email} email`);
  }

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
