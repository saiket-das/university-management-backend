import { model, Schema } from 'mongoose';
import { OfferedCourseProps } from './offeredCourse.interface';
import { Days } from './offeredCourse.constant';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { AcademicDepartmentModel } from '../academicDepartment/academicDepartment.model';
import { AcademicFacultyModel } from '../academicFaculty/academicFaculty.model';
import { CourseModel } from '../course/course.model';
import { FacultyModel } from '../faculty/faculty.model';

const offeredCourseSchema = new Schema<OfferedCourseProps>(
  {
    semesterRegistration: {
      type: Schema.Types.ObjectId,
      unique: true,
      ref: 'Semester-Registration',
      required: true,
    },
    academicSemester: {
      type: Schema.Types.ObjectId,
      unique: true,
      ref: 'Academic-Semester',
      required: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      unique: true,
      ref: 'Academic-Faculty',
      required: true,
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      unique: true,
      ref: 'Academic-Department',
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      unique: true,
      ref: 'Course',
      required: true,
    },
    faculty: {
      type: Schema.Types.ObjectId,
      unique: true,
      ref: 'Faculty',
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    days: [
      {
        type: String,
        enum: Days,
      },
    ],
    maxCapacity: {
      type: Number,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Save pre validation
offeredCourseSchema.pre('save', async function (next) {
  const { academicDepartment, academicFaculty, course, faculty } = this;

  // check if academic department exists or not
  const isAcademicDepartment =
    await AcademicDepartmentModel.findById(academicDepartment);
  if (!isAcademicDepartment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic department not found!');
  }

  // check if academic department exists or not
  const isAcademicFaculty =
    await AcademicFacultyModel.findById(academicFaculty);
  if (!isAcademicFaculty) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic faculty not found!');
  }

  // check if course exists or not
  const isCourse = await CourseModel.findById(course);
  if (!isCourse) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found!');
  }

  // check if faculty(Lecturer) exists or not
  const isFaculty = await FacultyModel.findById(faculty);
  if (!isFaculty) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found!');
  }

  next();
});

export const OfferedCourseModel = model<OfferedCourseProps>(
  'Offered-Course',
  offeredCourseSchema,
);
