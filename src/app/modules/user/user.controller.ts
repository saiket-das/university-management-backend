import { NextFunction, Request, Response } from 'express';

import { UserServices } from './user.service';
import { StudentProps } from '../student/student.interface';
import { StudentValidation } from '../student/student.validation';

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

    res.status(200).json({
      success: true,
      message: 'Student is created successfully ',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const UserControllers = {
  createStudent,
};
