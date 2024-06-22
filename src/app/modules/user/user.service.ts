import mongoose from 'mongoose';
import httpStatus from 'http-status';
import config from '../../config';
import { AcademicSemesterProps } from '../academicSemester/academicSemester.interface';
import { AcademicSemesterModel } from '../academicSemester/academicSemester.model';
import { StudentProps } from '../student/student.interface';
import { StudentModel } from '../student/student.model';
import { UserProps } from './user.interface';
import { UserModel } from './user.model';
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from './user.utils';
import AppError from '../../errors/AppError';
import { FacultyModel } from '../faculty/faculty.model';
import { FacultyProps } from '../faculty/faculty.interface';
import { AdminProps } from '../admin/admin.interface';
import { AdminModel } from '../admin/admin.model';
import { USER_ROLE } from './user.constant';
import { JwtPayload } from 'jsonwebtoken';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import { AcademicDepartmentModel } from '../academicDepartment/academicDepartment.model';

// Create a new student
const createStudentService = async (
  file: any,
  password: string,
  payload: StudentProps,
) => {
  // create a user object
  const userData: Partial<UserProps> = {};
  userData.password = password || (config.default_password as string); // if password is not given, use default password
  userData.role = 'student'; // set student role
  userData.email = payload.email;

  // check is admission semester exists or not
  const admissionSemester = await AcademicSemesterModel.findById(
    payload.admissionSemester,
  );
  if (!admissionSemester) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic semester not found');
  }

  // check is academic department exists or not
  const academicDepartment = await AcademicDepartmentModel.findById(
    payload.academicDepartment,
  );
  if (!academicDepartment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic department not found');
  }
  // convert string to ObjectId
  const academicFacultyObjectId = new mongoose.Types.ObjectId(
    academicDepartment?.academicFaculty,
  );
  payload.academicFaculty = academicFacultyObjectId;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // generate a user id (expmple: 2025010000) and set as user id
    userData.id = await generateStudentId(
      admissionSemester as AcademicSemesterProps,
    );

    // create a user  (transaction-1)
    const newUser = await UserModel.create([userData], { session }); // return array

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Fail to create new user!');
    }

    // send image to cloudinary
    if (file) {
      const path = file?.path;
      const imageName = `${userData.id}-${payload.name.firstName}`;
      const { secure_url } = await sendImageToCloudinary(path, imageName);
      payload.profileImage = secure_url as string;
    }

    // set id , _id as user into student, proile image
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a student  (transaction-2)
    const newStudent = await StudentModel.create([payload], { session });
    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Fail to create new student!');
    }
    await session.commitTransaction();
    await session.endSession();
    return newStudent[0];
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, error);
  }
};

// Create a new faculty
const createFacultyService = async (
  file: any,
  password: string,
  payload: FacultyProps,
) => {
  // create a user object
  const userData: Partial<UserProps> = {};
  userData.password = password || (config.default_password as string); // if password is not given, use default password
  userData.role = 'faculty'; // set faculty role
  userData.email = payload.email;

  // check is academic department exists or not
  const academicDepartment = await AcademicDepartmentModel.findById(
    payload.academicDepartment,
  );
  if (!academicDepartment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic department not found');
  }
  // convert string to ObjectId
  const academicFacultyObjectId = new mongoose.Types.ObjectId(
    academicDepartment?.academicFaculty,
  );
  payload.academicFaculty = academicFacultyObjectId;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // generate a user id (expmple: F-0001) and set as user id
    userData.id = await generateFacultyId();

    // create a user  (transaction-1)
    const newUser = await UserModel.create([userData], { session }); // return array

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Fail to create a new user!');
    }

    // send image to cloudinary
    if (file) {
      const path = file?.path;
      const imageName = `${userData.id}-${payload.name.firstName}`;
      const { secure_url } = await sendImageToCloudinary(path, imageName);
      payload.profileImage = secure_url as string;
    }

    // set id , _id as user into faculty,
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a faculty  (transaction-2)
    const newFaculty = await FacultyModel.create([payload], { session });
    if (!newFaculty.length) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Fail to create a new faculty!',
      );
    }
    await session.commitTransaction();
    await session.endSession();
    return newFaculty[0];
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, error);
  }
};

// Create a new faculty
const createAdminService = async (
  file: any,
  password: string,
  payload: AdminProps,
) => {
  // create a user object
  const userData: Partial<UserProps> = {};
  userData.password = password || (config.default_password as string); // if password is not given, use default password
  userData.role = 'admin'; // set admin role
  userData.email = payload.email;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // generate a user id (expmple: A-0001) and set as user id
    userData.id = await generateAdminId();

    // create a user  (transaction-1)
    const newUser = await UserModel.create([userData], { session }); // return array

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Fail to create a new user!');
    }

    // send image to cloudinary
    if (file) {
      const path = file?.path;
      const imageName = `${userData.id}-${payload.name.firstName}`;
      const { secure_url } = await sendImageToCloudinary(path, imageName);
      payload.profileImage = secure_url as string;
    }

    // set id , _id as user into admin, proile image
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a new admin  (transaction-2)
    const newAdmin = await AdminModel.create([payload], { session });

    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Fail to create a new admin!');
    }
    await session.commitTransaction();
    await session.endSession();
    return newAdmin[0];
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, error);
  }
};

// Get me
const getMeService = async (user: JwtPayload) => {
  const { userId, role } = user;
  let result;
  if (role === USER_ROLE.admin) {
    result = await AdminModel.findOne({ id: userId });
  } else if (role === USER_ROLE.faculty) {
    result = await FacultyModel.findOne({ id: userId });
  } else if (role === USER_ROLE.student) {
    result = await StudentModel.findOne({ id: userId });
  }
  return result;
};

// Change status
const changeStatusService = async (userId: string, status: string) => {
  const result = await UserModel.findByIdAndUpdate(
    userId,
    { status: status },
    {
      new: true,
    },
  );
  return result;
};

export const UserServices = {
  createStudentService,
  createFacultyService,
  createAdminService,
  getMeService,
  changeStatusService,
};
