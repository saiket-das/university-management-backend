import { Request, Response } from 'express';
import { AcademicFacultyServices } from './academicFaculty.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

// Create a academic faculty
const createAcademicFaculty = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AcademicFacultyServices.createAcademicFacultyService(
      req.body,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Create a academic faculty successfully!',
      data: result,
    });
  },
);

// Fetch all academic faculties
const getAllAcademicFaculties = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await AcademicFacultyServices.getAllAcademicFacultiesService();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Fetch all academic faculties successfully!',
      data: result,
    });
  },
);

// Fetch single academic faculty by Id
const getSingleAcademicFacultyById = catchAsync(
  async (req: Request, res: Response) => {
    const { facultyId } = req.params;
    const result =
      await AcademicFacultyServices.getSingleAcademicFacultyByIdService(
        facultyId,
      );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Fetch single academic faculty by Id successfully!',
      data: result,
    });
  },
);

// Update single academic faculty's info by Id
const updateAcademicFacultyById = catchAsync(
  async (req: Request, res: Response) => {
    const { facultyId } = req.params;
    const result =
      await AcademicFacultyServices.updateAcademicFacultyByIdService(
        facultyId,
        req.body,
      );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Update academic faculty's info by Id successfully!",
      data: result,
    });
  },
);

export const AcademicFacultyControllers = {
  createAcademicFaculty,
  getAllAcademicFaculties,
  getSingleAcademicFacultyById,
  updateAcademicFacultyById,
};
