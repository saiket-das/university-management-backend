import { model, Schema } from 'mongoose';
import { OfferedCourseProps } from './offeredCourse.interface';
import { Days } from './offeredCourse.constant';

const offeredCourseSchema = new Schema<OfferedCourseProps>(
  {
    academicSemester: {
      type: Schema.Types.ObjectId,
      unique: true,
      ref: 'Academic-Semester',
      required: true,
    },
    semesterRegistration: {
      type: Schema.Types.ObjectId,
      unique: true,
      ref: 'Semester-Registration',
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
    days: {
      type: String,
      enum: Days,
    },
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

export const OfferedCourseModel = model<OfferedCourseProps>(
  'Offered-Course',
  offeredCourseSchema,
);
