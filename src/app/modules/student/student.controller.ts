import { StudentService } from './student.service';
import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catachAsync from '../../utils/catchAsync';

// Get all students
const getAllStudents = catachAsync(async (req, res, next) => {
  const result = await StudentService.getAllStudentsService(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Get all students successfully!',
    data: result,
  });
});

// Get single student by Id
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

// Update a student info by Id
const updateStudentById = catachAsync(async (req, res, next) => {
  const { studentId } = req.params;
  const { student: payload } = req.body;
  const result = await StudentService.updateStudentByIdService(
    studentId,
    payload,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Delete a student by id successfully!',
    data: result,
  });
});

// Delete s student info (isDeleted = true) by Id
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
  updateStudentById,
  deleteStudentById,
};
