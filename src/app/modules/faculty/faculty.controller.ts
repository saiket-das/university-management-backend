import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catachAsync from '../../utils/catchAsync';
import { FacultyService } from './faculty.service';

// Get all faculties
const getAllFaculties = catachAsync(async (req, res, next) => {
  const result = await FacultyService.getAllFacultiesService();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Get all faculties successfully!',
    data: result,
  });
});

// Get single faculty by Id
const getSingleFacultyById = catachAsync(async (req, res, next) => {
  const { facultyId } = req.params;
  const result = await FacultyService.getSingleFacultyByIdService(facultyId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Get a faculty by id successfully!',
    data: result,
  });
});

// Update a faculty info by Id
const updateFacultyById = catachAsync(async (req, res, next) => {
  const { facultyId } = req.params;
  const { student: payload } = req.body;
  const result = await FacultyService.updateFacultyByIdService(
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
const deleteFacultyById = catachAsync(async (req, res, next) => {
  const { facultyId } = req.params;
  const result = await FacultyService.deleteFacultyByIdService(facultyId);
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
