import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catachAsync from '../../utils/catchAsync';
import { AdminServices } from './admin.service';

// Get all admins
const getAllAdmins = catachAsync(async (req, res, next) => {
  const result = await AdminServices.getAllAdminsService();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Get all admins successfully!',
    data: result,
  });
});

// Get single faculty by Id
const getSingleAdminById = catachAsync(async (req, res, next) => {
  const { adminId } = req.params;
  const result = await AdminServices.getSingleAdminByIdService(adminId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Get an admin by id successfully!',
    data: result,
  });
});

// Update a admin info by Id
const updateAdminById = catachAsync(async (req, res, next) => {
  const { adminId } = req.params;
  const { admin: payload } = req.body;
  const result = await AdminServices.updateAdminByIdService(adminId, payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'update an admin info by id successfully!',
    data: result,
  });
});

// Delete s admin info (isDeleted = true) by Id
const deleteAdminById = catachAsync(async (req, res, next) => {
  const { adminId } = req.params;
  const result = await AdminServices.deleteAdminByIdService(adminId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Delete an admin by id successfully!',
    data: result,
  });
});

export const AdminControllers = {
  getAllAdmins,
  getSingleAdminById,
  updateAdminById,
  deleteAdminById,
};
