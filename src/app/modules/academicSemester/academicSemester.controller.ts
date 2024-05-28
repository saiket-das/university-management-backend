import httpStatus from 'http-status';
import catachAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AcademicSemesterServices } from './academicSemester.service';

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

export const AcademicSemesterControllers = {
  createAcademicSemester,
};
