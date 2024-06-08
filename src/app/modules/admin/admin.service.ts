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
const getSingleAdminByIdService = async (adminId: string) => {
  const result = await AdminModel.findById(adminId).populate(
    'managementDepartment',
  );
  return result;
};

// Update a faculty info by Id
const updateAdminByIdService = async (
  adminId: string,
  payload: Partial<AdminProps>,
) => {
  // Check is admin exists or not
  const isAdminExists = await AdminModel.findById(adminId);
  if (!isAdminExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Admin not found'!);
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

  // update admin info
  const result = await AdminModel.findByIdAndUpdate(
    adminId,
    modifyUpdatedData,
    { new: true, runValidators: true },
  );
  return result;
};

// Delete s faculty info (isDeleted = true) by Id
const deleteAdminByIdService = async (adminId: string) => {
  // Check is admin exists or not
  const isAdminExists = await AdminModel.findById(adminId);
  if (!isAdminExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found'!);
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // update admin isDeleted property = true  (transaction-1)
    const deletedAdmin = await AdminModel.findByIdAndUpdate(
      adminId,
      { $set: { isDeleted: true } },
      { new: true, session },
    );
    if (!deletedAdmin) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Fail to delete admin!');
    }

    // update user isDeleted property = true  (transaction-1)
    const userId = deletedAdmin.user;
    const deletedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: { isDeleted: true } },
      { new: true, session },
    );
    if (!deletedUser) {
      if (!deletedAdmin) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Fail to delete user as admin!',
        );
      }
    }
    await session.commitTransaction();
    await session.endSession();
    return deletedAdmin;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'An error occurred while deleting the user as admin!',
    );
  }
};

export const AdminServices = {
  getAllAdminsService,
  getSingleAdminByIdService,
  updateAdminByIdService,
  deleteAdminByIdService,
};
