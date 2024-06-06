import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { FacultyModel } from './faculty.model';
import { UserModel } from '../user/user.model';
import { FacultyProps } from './faculty.interface';

// Get all faculties
const getAllFacultiesService = async () => {
  const result = await FacultyModel.find();
  return result;
};

// Get single faculty by Id
const getSingleFacultyByIdService = async (facultyId: string) => {
  const result = await FacultyModel.findOne({ id: facultyId })
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};

// Update a faculty info by Id
const updateFacultyByIdService = async (
  facultyId: string,
  payload: Partial<FacultyProps>,
) => {
  const { name, ...remainingData } = payload;

  const modifyUpdatedData: Record<string, unknown> = {
    ...remainingData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifyUpdatedData[`name.${key}`] = value;
    }
  }

  // update student info
  const result = await FacultyModel.findOneAndUpdate(
    { id: facultyId },
    modifyUpdatedData,
    { new: true, runValidators: true },
  );
  return result;
};

// Delete s faculty info (isDeleted = true) by Id
const deleteFacultyByIdService = async (studentId: string) => {
  const isStudentExists = await FacultyModel.findOne({ id: studentId });
  if (!isStudentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found'!);
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // update user isDeleted property = true  (transaction-1)
    const deletedStudent = await FacultyModel.findOneAndUpdate(
      { id: studentId },
      { $set: { isDeleted: true } },
      { new: true, session },
    );
    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Fail to delete faculty!');
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
      'An error occurred while deleting the new user!',
    );
  }
};

export const FacultyService = {
  getAllFacultiesService,
  getSingleFacultyByIdService,
  updateFacultyByIdService,
  deleteFacultyByIdService,
};
