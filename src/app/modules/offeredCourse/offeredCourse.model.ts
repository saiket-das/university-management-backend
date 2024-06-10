import { model, Schema } from 'mongoose';
import { OfferedCourseProps } from './offeredCourse.interface';
import { Days } from './offeredCourse.constant';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { AcademicDepartmentModel } from '../academicDepartment/academicDepartment.model';
import { AcademicFacultyModel } from '../academicFaculty/academicFaculty.model';
import { CourseModel } from '../course/course.model';
import { FacultyModel } from '../faculty/faculty.model';
import { handleTimeConflict } from './offeredCourse.utils';

const offeredCourseSchema = new Schema<OfferedCourseProps>(
  {
    semesterRegistration: {
      type: Schema.Types.ObjectId,
      ref: 'Semester-Registration',
      required: true,
    },
    academicSemester: {
      type: Schema.Types.ObjectId,
      ref: 'Academic-Semester',
      required: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'Academic-Faculty',
      required: true,
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'Academic-Department',
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    faculty: {
      type: Schema.Types.ObjectId,
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
  const {
    semesterRegistration,
    academicDepartment,
    academicFaculty,
    course,
    faculty,
    section,
    days,
    startTime,
    endTime,
  } = this;

  // check if academic department exists or not
  const isAcademicDepartmentExists =
    await AcademicDepartmentModel.findById(academicDepartment);
  if (!isAcademicDepartmentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic department not found!');
  }
  // check if academic department exists or not
  const isAcademicFacultyExists =
    await AcademicFacultyModel.findById(academicFaculty);
  if (!isAcademicFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic faculty not found!');
  }
  // check if course exists or not
  const isCourseExists = await CourseModel.findById(course);
  if (!isCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found!');
  }
  // check if faculty(Lecturer) exists or not
  const isFacultyExists = await FacultyModel.findById(faculty);
  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found!');
  }

  // check if the given department belongs to the given academic faculty
  const isDepartmentBelongToAcademicFaculty =
    await AcademicDepartmentModel.findOne({
      _id: academicDepartment,
      academicFaculty: academicFaculty,
    });
  if (!isDepartmentBelongToAcademicFaculty) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `${isAcademicDepartmentExists.name} does not belongs to ${isAcademicFacultyExists.name}!`,
    );
  }

  // check if the same offered course same section in same registered semester exists
  const isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection =
    await OfferedCourseModel.findOne({
      semesterRegistration,
      course,
      section,
    });
  if (isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Offered course with section ${section} already exist. Choose a different section`,
    );
  }

  // get the schedules of the given faculty for the give days
  const assignedSchedules = await OfferedCourseModel.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days  startTime endTime');

  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  // check is given faculty has time conflict within given days & time & exisiting days & time
  if (handleTimeConflict(assignedSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      `This faculty not available this time. Choose another time or day`,
    );
  }

  next();
});

export const OfferedCourseModel = model<OfferedCourseProps>(
  'Offered-Course',
  offeredCourseSchema,
);
