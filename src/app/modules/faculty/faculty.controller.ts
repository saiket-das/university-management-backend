import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { FacultyServices } from './faculty.service';

// Get all faculties
const getAllFaculties = catchAsync(async (req, res, next) => {
  const result = await FacultyServices.getAllFacultiesService();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Get all faculties successfully!',
    data: result,
  });
});

// Get single faculty by Id
const getSingleFacultyById = catchAsync(async (req, res, next) => {
  const { facultyId } = req.params;
  const result = await FacultyServices.getSingleFacultyByIdService(facultyId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Get a faculty by id successfully!',
    data: result,
  });
});

// Update a faculty info by Id
const updateFacultyById = catchAsync(async (req, res, next) => {
  const { facultyId } = req.params;
  const { faculty: payload } = req.body;
  const result = await FacultyServices.updateFacultyByIdService(
    facultyId,
    payload,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Delete a faculty by id successfully!',
    data: result,
  });
});

// Delete s student info (isDeleted = true) by Id
const deleteFacultyById = catchAsync(async (req, res, next) => {
  const { facultyId } = req.params;
  const result = await FacultyServices.deleteFacultyByIdService(facultyId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Delete a faculty by id successfully!',
    data: result,
  });
});

export const FacultyControllers = {
  getAllFaculties,
  getSingleFacultyById,
  updateFacultyById,
  deleteFacultyById,
};
