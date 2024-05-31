import { model, Schema } from 'mongoose';
import { AcademicSemesterProps } from './academicSemester.interface';
import {
  AcademicSemesterName,
  AcademicSemesterCode,
  Months,
} from './academicSemester.constant';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

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
      type: String,
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

// pre validation before create a semester (can't create same name and year semester twice)
// example -> Autumn 2025 can be only once
academicSemesterSchema.pre('save', async function (next) {
  const isSemesterExists = await AcademicSemesterModel.findOne({
    name: this.name,
    year: this.year,
  });

  if (isSemesterExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `${this.name} ${this.year} semester already exists!`,
    );
  }
  next();
});

export const AcademicSemesterModel = model<AcademicSemesterProps>(
  'Academic-Semester',
  academicSemesterSchema,
);
