import { Request, Response } from 'express';

import { UserServices } from './user.service';
import { StudentProps } from '../student/student.interface';

// Create a new student
const createStudent = async (req: Request, res: Response) => {
  try {
    const { password, student: studentData } = req.body;
    // const zodParseData = UserValidation.userSchemaValidation.parse(studentData);

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
    res.status(500).json({
      success: true,
      message: error,
    });
  }
};

export const UserControllers = {
  createStudent,
};
