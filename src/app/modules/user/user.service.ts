import httpStatus from 'http-status';
import config from '../../config';
import { AcademicSemesterProps } from '../academicSemester/academicSemester.interface';
import { AcademicSemesterModel } from '../academicSemester/academicSemester.model';
import { StudentProps } from '../student/student.interface';
import { StudentModel } from '../student/student.model';
import { UserProps } from './user.interface';
import { UserModel } from './user.model';
import { generateUserId } from './user.utils';
import AppError from '../../errors/AppError';
import mongoose from 'mongoose';

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

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // generate a user id (expmple: 2025010000) and set as user id
    userData.id = await generateUserId(
      admissionSemester as AcademicSemesterProps,
    );

    // create a user  (transaction-1)
    const newUser = await UserModel.create([userData], { session }); // return array

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Fail to create new user!');
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a student  (transaction-2)
    const newStudent = await StudentModel.create([payload, session]);
    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Fail to create new student!');
    }
    await session.commitTransaction();
    await session.endSession();
    return newStudent[0];
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'An error occurred while creating the new user!',
    );
  }

  // throw new AppError(
  //   httpStatus.NOT_FOUND,
  //   'An error occurred while creating the new user!',
  // );
};

export const UserServices = {
  createStudentService,
};
