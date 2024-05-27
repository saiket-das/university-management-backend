import { Request, Response } from 'express';
import { StudentPorps } from './student.interface';
import { StudentService } from './student.service';
import StudentValidationSchemaZod from './student.validation';

// Create a new student
const createStudent = async (req: Request, res: Response) => {
  try {
    const student: StudentPorps = req.body;
    const zodParseData = StudentValidationSchemaZod.parse(student);

    const result = await StudentService.createStudentIntoDB(zodParseData);

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

// Get all students
const getAllStudents = async (req: Request, res: Response) => {
  try {
    const result = await StudentService.getAllStudentsFromDB();

    return res.status(200).json({
      success: true,
      message: 'Get all students successfully ',
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: true,
      message: error.message,
    });
  }
};

// Get student by Id
const getStudentbyId = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const result = await StudentService.getStudentByIdFromDB(studentId);

    res.status(200).json({
      success: true,
      message: 'Get a student by id successfully ',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: true,
      message: error,
    });
  }
};

// Delete student by Id
const deleteStudentById = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const result = await StudentService.deleteStudentById(studentId);

    res.status(200).json({
      success: true,
      message: 'Delete a student by id successfully ',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: true,
      message: error,
    });
  }
};

export const StudentControllers = {
  createStudent,
  getAllStudents,
  getStudentbyId,
  deleteStudentById,
};
