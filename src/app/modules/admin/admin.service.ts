import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

import { UserModel } from '../user/user.model';
import { AdminModel } from './admin.model';
import { AdminProps } from './admin.interface';

// Get all faculties
const getAllAdminsService = async () => {
  const result = await AdminModel.find().populate('managementDepartment');
  return result;
};

// Get single faculty by Id
const getSingleAdminByIdService = async (facultyId: string) => {
  const result = await AdminModel.findOne({ id: facultyId }).populate(
    'managementDepartment',
  );
  return result;
};

// Update a faculty info by Id
const updateAdminByIdService = async (
  facultyId: string,
  payload: Partial<AdminProps>,
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
  const result = await AdminModel.findOneAndUpdate(
    { id: facultyId },
    modifyUpdatedData,
    { new: true, runValidators: true },
  );
  return result;
};

// Delete s faculty info (isDeleted = true) by Id
const deleteAdminByIdService = async (adminId: string) => {
  const isStudentExists = await AdminModel.findOne({ id: adminId });
  if (!isStudentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found'!);
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // update user isDeleted property = true  (transaction-1)
    const deletedStudent = await AdminModel.findOneAndUpdate(
      { id: adminId },
      { $set: { isDeleted: true } },
      { new: true, session },
    );
    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Fail to delete faculty!');
    }

    const deletedUser = await UserModel.findOneAndUpdate(
      { id: adminId },
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
      'An error occurred while deleting the user as faculty!',
    );
  }
};

export const AdminServices = {
  getAllAdminsService,
  getSingleAdminByIdService,
  updateAdminByIdService,
  deleteAdminByIdService,
};
