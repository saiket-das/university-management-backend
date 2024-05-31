import { StudentService } from './student.service';
import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catachAsync from '../../utils/catchAsync';

// Get all students
const getAllStudents = catachAsync(async (req, res, next) => {
  const result = await StudentService.getAllStudentsService();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Get all students successfully!',
    data: result,
  });
});

// Get student by Id
const getSingleStudentbyId = catachAsync(async (req, res, next) => {
  const { studentId } = req.params;
  const result = await StudentService.getSingleStudentByIdService(studentId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Get a student by id successfully!',
    data: result,
  });
});

// Delete student by Id
const deleteStudentById = catachAsync(async (req, res, next) => {
  const { studentId } = req.params;
  const result = await StudentService.deleteStudentByIdService(studentId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Delete a student by id successfully!',
    data: result,
  });
});

export const StudentControllers = {
  getAllStudents,
  getSingleStudentbyId,
  deleteStudentById,
};
