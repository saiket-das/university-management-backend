import mongoose from 'mongoose';
import { StudentModel } from './student.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { UserModel } from '../user/user.model';
import { StudentProps } from './student.interface';
import QueryBuilder from '../../builder/QueryBuilder';
import { StudentSearchableFields } from './student.constant';

// Get all students
const getAllStudentsService = async (query: Record<string, unknown>) => {
  const studentQuery = new QueryBuilder(
    StudentModel.find()
      .populate('user')
      .populate('admissionSemester')
      .populate('academicDepartment academicFaculty'),
    query,
  )
    .search(StudentSearchableFields)
    .filter()
    .sort()
    .pagination()
    .fields();

  const result = await studentQuery.modelQuery;
  const meta = await studentQuery.countTotal();
  return {
    meta,
    result,
  };
};

// Get single student by Id
const getSingleStudentByIdService = async (studentId: string) => {
  const result = await StudentModel.findById(studentId)
    .populate('admissionSemester')
    .populate('academicDepartment academicFaculty');

  return result;
};

// Update a student info by Id
const updateStudentByIdService = async (
  studentId: string,
  payload: Partial<StudentProps>,
) => {
  // Check is student exists or not
  const isStudentExists = await StudentModel.findById(studentId);
  if (!isStudentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student not found'!);
  }

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
  const result = await StudentModel.findByIdAndUpdate(
    studentId,
    modifyUpdatedData,
    { new: true, runValidators: true },
  );
  return result;
};

// Delete s student info (isDeleted = true) by Id
const deleteStudentByIdService = async (studentId: string) => {
  // Check is student exists or not
  const isStudentExists = await StudentModel.findById(studentId);
  if (!isStudentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student not found'!);
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // update student isDeleted property = true  (transaction-1)
    const deletedStudent = await StudentModel.findByIdAndUpdate(
      studentId,
      { $set: { isDeleted: true } },
      { new: true, session },
    );
    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Fail to delete student!');
    }

    // update user isDeleted property = true  (transaction-1)
    const userId = deletedStudent.user;
    const deletedUser = await UserModel.findOneAndUpdate(
      userId,
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
      'An error occurred while deleting the user as student!',
    );
  }
};

export const StudentService = {
  getAllStudentsService,
  getSingleStudentByIdService,
  updateStudentByIdService,
  deleteStudentByIdService,
};
