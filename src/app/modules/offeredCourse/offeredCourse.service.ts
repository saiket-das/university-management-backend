import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { SemesterRegistrationModel } from '../semesterResgistration/semesterRegistration.model';
import { OfferedCourseProps } from './offeredCourse.interface';
import { OfferedCourseModel } from './offeredCourse.model';
import { AcademicDepartmentModel } from '../academicDepartment/academicDepartment.model';
import { AcademicFacultyModel } from '../academicFaculty/academicFaculty.model';
import { CourseModel } from '../course/course.model';
import { FacultyModel } from '../faculty/faculty.model';

// Create a new semester resgistration
const createOfferedCourseService = async (payload: OfferedCourseProps) => {
  const { semesterRegistration } = payload;

  // check if semester registration exists or not
  const isSemesterExists =
    await SemesterRegistrationModel.findById(semesterRegistration);
  if (!isSemesterExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Semester not found!');
  }

  payload.academicSemester = isSemesterExists.academicSemester;

  const result = await OfferedCourseModel.create(payload);
  return result;
};

export const OfferedCourseServices = {
  createOfferedCourseService,
};
