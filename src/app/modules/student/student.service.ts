import mongoose from 'mongoose';
import { StudentModel } from './student.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { UserModel } from '../user/user.model';

// Get all students
const getAllStudentsService = async () => {
  const result = await StudentModel.find()
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};

// Get single student by Id
const getSingleStudentByIdService = async (studentId: string) => {
  const result = await StudentModel.findById(studentId)
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};

// Delete s student info by Id
const deleteStudentByIdService = async (studentId: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // update user isDeleted property = true  (transaction-1)
    const deletedStudent = await StudentModel.findOneAndUpdate(
      { id: studentId },
      { $set: { isDeleted: true } },
      { new: true, session },
    );
    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Fail to delete student!');
    }

    const deletedUser = await UserModel.findOneAndUpdate(
      { id: studentId },
      { $set: { isDeleted: true } },
      { new: true, session },
    );
    if (!deletedUser) {
      if (!deletedStudent) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Fail to delete user!');
      }
    }
    await session.commitTransaction();
    await session.endSession();
    return deletedStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'An error occurred while creating the new user!',
    );
  }
};

export const StudentService = {
  getAllStudentsService,
  getSingleStudentByIdService,
  deleteStudentByIdService,
};
