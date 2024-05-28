import { NextFunction, Request, Response } from 'express';
import { StudentService } from './student.service';
import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';

// Get all students
const getAllStudents = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await StudentService.getAllStudentsFromDB();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Get all students successfully!',
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

// Get student by Id
const getStudentbyId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { studentId } = req.params;
    const result = await StudentService.getStudentByIdFromDB(studentId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Get a student by id successfully!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Delete student by Id
const deleteStudentById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { studentId } = req.params;
    const result = await StudentService.deleteStudentById(studentId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Delete a student by id successfully!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const StudentControllers = {
  getAllStudents,
  getStudentbyId,
  deleteStudentById,
};
