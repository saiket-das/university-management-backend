import { NextFunction, Request, Response } from 'express';

import { UserServices } from './user.service';
import { StudentProps } from '../student/student.interface';
import { StudentValidation } from '../student/student.validation';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

// Create a new student
const createStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { password, student: studentData } = req.body;
    // const studentParseData =
    // StudentValidation.studentSchemaValidation.parse(studentData);

    const result = await UserServices.createStudentService(
      password,
      studentData,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Student create successfully!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const UserControllers = {
  createStudent,
};
