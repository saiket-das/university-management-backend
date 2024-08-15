import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AcademicSemesterServices } from './academicSemester.service';

// Create a new academic semester
const createAcademicSemester = catchAsync(async (req, res, next) => {
  const result = await AcademicSemesterServices.createAcademicSemesterService(
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Academic semester is created successfully!',
    data: result,
  });
});

// Get all academic semesters
const fetchAllAcademicSemester = catchAsync(async (req, res, next) => {
  const result = await AcademicSemesterServices.fetchAllAcademicSemesterService(
    req.query,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: result.meta,
    data: result.result,
    message: 'Fetch all academic semesters successfully!',
  });
});

// Get a single academic semester by id
const fetchSingleAcademicSemesterById = catchAsync(async (req, res, next) => {
  const result =
    await AcademicSemesterServices.fetchSingleAcademicSemesterByIdService(
      req.params.semesterId,
    );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Fetch a academic semester by Id successfully!',
    data: result,
  });
});

// Update a academic semester's info
const updateAcademicSemesterById = catchAsync(async (req, res, next) => {
  const result =
    await AcademicSemesterServices.updateAcademicSemesterByIdService(
      req.params.semesterId,
      req.body,
    );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Update a academic semester's info by Id successfully!",
    data: result,
  });
});

export const AcademicSemesterControllers = {
  createAcademicSemester,
  fetchSingleAcademicSemesterById,
  fetchAllAcademicSemester,
  updateAcademicSemesterById,
};
