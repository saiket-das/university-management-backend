import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { FacultyModel } from './faculty.model';
import { UserModel } from '../user/user.model';
import { FacultyProps } from './faculty.interface';

// Get all faculties
const getAllFacultiesService = async () => {
  const result = await FacultyModel.find().populate(
    'academicDepartment academicFaculty',
  );
  return result;
};

// Get single faculty by Id
const getSingleFacultyByIdService = async (facultyId: string) => {
  const result = await FacultyModel.findById(facultyId).populate(
    'academicDepartment academicFaculty',
  );
  return result;
};

// Update a faculty info by Id
const updateFacultyByIdService = async (
  facultyId: string,
  payload: Partial<FacultyProps>,
) => {
  // Check is faculty exists or not
  const isFacultyExists = await FacultyModel.findById(facultyId);
  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found'!);
  }

  const { name, ...remainingData } = payload;
  const modifyUpdatedData: Record<string, unknown> = {
    ...remainingData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifyUpdatedData[`name.${key}`] = value;
    }
  }

  // update faculty info
  const result = await FacultyModel.findByIdAndUpdate(
    facultyId,
    modifyUpdatedData,
    { new: true, runValidators: true },
  );
  return result;
};

// Delete s faculty info (isDeleted = true) by Id
const deleteFacultyByIdService = async (facultyId: string) => {
  // Check is faculty exists or not
  const isFacultyExists = await FacultyModel.findById(facultyId);
  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found'!);
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // update faculty isDeleted property = true  (transaction-1)
    const deletedFaculty = await FacultyModel.findByIdAndUpdate(
      facultyId,
      { $set: { isDeleted: true } },
      { new: true, session },
    );
    if (!deletedFaculty) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Fail to delete faculty!');
    }

    // update user isDeleted property = true  (transaction-1)
    const userId = deletedFaculty.user;
    const deletedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: { isDeleted: true } },
      { new: true, session },
    );
    if (!deletedUser) {
      if (!deletedFaculty) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Fail to delete user as faculty!',
        );
      }
    }
    await session.commitTransaction();
    await session.endSession();
    return deletedFaculty;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'An error occurred while deleting the user as faculty!',
    );
  }
};

export const FacultyServices = {
  getAllFacultiesService,
  getSingleFacultyByIdService,
  updateFacultyByIdService,
  deleteFacultyByIdService,
};
