import httpStatus from 'http-status';
import catachAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AcademicSemesterServices } from './academicSemester.service';

// Create a new academic semester
const createAcademicSemester = catachAsync(async (req, res, next) => {
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
const fetchAllAcademicSemester = catachAsync(async (req, res, next) => {
  const result =
    await AcademicSemesterServices.fetchAllAcademicSemesterService();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Fetch all academic semesters successfully!',
    data: result,
  });
});

// Get a single academic semester by id
const fetchSingleAcademicSemesterById = catachAsync(async (req, res, next) => {
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
const updateAcademicSemesterById = catachAsync(async (req, res, next) => {
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
