import { model, Schema } from 'mongoose';
import {
  AcademicSemesterCodeProps,
  AcademicSemesterNameProps,
  AcademicSemesterProps,
  MonthsProps,
} from './academicSemester.interface';
import {
  AcademicSemesterName,
  AcademicSemesterCode,
  Months,
} from './academicSemester.constant';

const academicSemesterSchema = new Schema<AcademicSemesterProps>(
  {
    name: {
      type: String,
      enum: AcademicSemesterName,
      required: true,
    },
    code: {
      type: String,
      enum: AcademicSemesterCode,
      required: true,
    },
    year: {
      type: Date,
      required: true,
    },
    startMonth: {
      type: String,
      enum: Months,
      required: true,
    },
    endMonth: {
      type: String,
      enum: Months,
      required: true,
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
