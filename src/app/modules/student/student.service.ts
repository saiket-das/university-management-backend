import mongoose from 'mongoose';
import { StudentModel } from './student.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { UserModel } from '../user/user.model';
import { StudentProps } from './student.interface';
import QueryBuilder from '../../builder/QueryBuilder';
import { studentSearchableFields } from './student.constant';

// Get all students
const getAllStudentsService = async (query: Record<string, unknown>) => {
  const studentQuery = new QueryBuilder(StudentModel.find(), query)
    .search(studentSearchableFields)
    .filter()
    .sort()
    .pagination()
    .fields();

  const result = await studentQuery.modelQuery;
  return result;
};

// Get single student by Id
const getSingleStudentByIdService = async (studentId: string) => {
  const result = await StudentModel.findOne({ id: studentId })
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};

// Update a student info by Id
const updateStudentByIdService = async (
  studentId: string,
  payload: Partial<StudentProps>,
) => {
  // handle non-primitive field here
  /*
    // from frontend
    name: {
      firstName: "Saiket"
    }
    // convert to this
    name.firstName = "Saiket"
  */
  const { name, guardian, localGuardian, ...remainingData } = payload;

  const modifyUpdatedData: Record<string, unknown> = {
    ...remainingData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifyUpdatedData[`name.${key}`] = value;
    }
  }

  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifyUpdatedData[`guardian.${key}`] = value;
    }
  }

  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifyUpdatedData[`localGuardian.${key}`] = value;
    }
  }

  // update student info
  const result = await StudentModel.findOneAndUpdate(
    { id: studentId },
    modifyUpdatedData,
    { new: true, runValidators: true },
  );
  return result;
};

// Delete s student info (isDeleted = true) by Id
const deleteStudentByIdService = async (studentId: string) => {
  const isStudentExists = await StudentModel.findOne({ id: studentId });
  if (!isStudentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student not found'!);
  }

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
  updateStudentByIdService,
  deleteStudentByIdService,
};
