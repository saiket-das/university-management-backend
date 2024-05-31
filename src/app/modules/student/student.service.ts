import mongoose, { ObjectId } from 'mongoose';
import { StudentModel } from './student.model';

// Get all students
const getAllStudentsService = async () => {
  const result = await StudentModel.find()
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};

// Get student by Id
const getSingleStudentByIdService = async (studentId: string) => {
  const result = await StudentModel.findById(studentId)
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};

// Get student by Id
const deleteStudentByIdService = async (studentId: string) => {
  const result = await StudentModel.updateOne(
    { _id: studentId },
    { $set: { isDeleted: true } },
  );
  return result;
};

export const StudentService = {
  getAllStudentsService,
  getSingleStudentByIdService,
  deleteStudentByIdService,
};
