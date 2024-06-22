import { Request, Response } from 'express';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { AcademicDepartmentServices } from './academicDepartment.service';
import catchAsync from '../../utils/catchAsync';

// Create a academic department
const createAcademicDepartment = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await AcademicDepartmentServices.createAcademicDepartmentService(
        req.body,
      );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Create a academic department successfully!',
      data: result,
    });
  },
);

// Fetch all academic departments
const getAllAcademicDepartments = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await AcademicDepartmentServices.getAllAcademicDepartmentsService();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Fetch all academic departments successfully!',
      data: result,
    });
  },
);

// Fetch single academic department by Id
const getSingleAcademicDepartmentById = catchAsync(
  async (req: Request, res: Response) => {
    const { departmentId } = req.params;
    const result =
      await AcademicDepartmentServices.getSingleAcademicDepartmentByIdService(
        departmentId,
      );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Fetch single academic department by Id successfully!',
      data: result,
    });
  },
);

// Update single academic department's info by Id
const updateAcademicDepartmentById = catchAsync(
  async (req: Request, res: Response) => {
    const { departmentId } = req.params;
    const result =
      await AcademicDepartmentServices.updateAcademicDepartmentByIdService(
        departmentId,
        req.body,
      );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Update academic department's info by Id successfully!",
      data: result,
    });
  },
);

export const AcademicDepartmentControllers = {
  createAcademicDepartment,
  getAllAcademicDepartments,
  getSingleAcademicDepartmentById,
  updateAcademicDepartmentById,
};
