import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { SemesterRegistrationServices } from './semesterRegistration.service';

// Create a new semester resgistration
const createSemesterRegistration = catchAsync(async (req, res, next) => {
  const result =
    await SemesterRegistrationServices.createSemesterRegistrationService(
      req.body,
    );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Created a new semester registration successfully!',
    data: result,
  });
});

// Get all semester registrations
const getAllSemesterRegistrations = catchAsync(async (req, res, next) => {
  const result =
    await SemesterRegistrationServices.getAllSemesterRegistrationsService(
      req.query,
    );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Fetched all semester registrations successfully!',
    data: result,
  });
});

// Get a semester registration by Id
const getSingleSemesterRegistration = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result =
    await SemesterRegistrationServices.getSingleSemesterRegistrationService(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Fetched a semester registration by Id successfully!',
    data: result,
  });
});

// Update a semester registration info by Id
const updateSemesterRegistration = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result =
    await SemesterRegistrationServices.updateSemesterRegistrationService(
      id,
      req.body,
    );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Update a semester registration info by Id successfully!',
    data: result,
  });
});

export const SemesterRegistrationControllers = {
  createSemesterRegistration,
  getAllSemesterRegistrations,
  getSingleSemesterRegistration,
  updateSemesterRegistration,
};
