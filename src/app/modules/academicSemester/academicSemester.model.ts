import { model, Schema } from 'mongoose';
import {
  AcademicSemesterProps,
  MonthsProps,
} from './academicSemester.interface';

const months: MonthsProps[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const academicSemesterSchema = new Schema<AcademicSemesterProps>(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    year: {
      type: Date,
      required: true,
    },
    startMonth: {
      type: String,
      enum: months,
    },
    endMonth: {
      type: String,
      enum: months,
    },
  },
  {
    timestamps: true,
  },
);

export const academicSemesterModel = model<AcademicSemesterProps>(
  'AcademicSemester',
  academicSemesterSchema,
);
