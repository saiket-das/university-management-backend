import { model, Schema } from 'mongoose';
import { AcademicDepartmentProps } from './academicDepartment.interface';
import { AcademicFacultyModel } from '../academicFaculty/academicFaculty.model';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';

const academicDepartmentSchema = new Schema<AcademicDepartmentProps>(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    academicFaculty: {
      type: String,
      required: true,
      ref: 'Academic-Faculty',
    },
  },
  {
    timestamps: true,
  },
);

// Middlewares
// Check if academic department (name) and reference academic faculty exists or not
academicDepartmentSchema.pre('save', async function (next) {
  const academicDepartment = this;
  // check if academic department (name) exists or not
  const isAcademicDepartmentExists = await AcademicDepartmentModel.findOne({
    name: academicDepartment.name,
  });
  if (isAcademicDepartmentExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `${academicDepartment.name} already exists`,
    );
  }

  // check if reference academic faculty exists or not
  const isAcademicFacultyExists = await AcademicFacultyModel.findById(
    academicDepartment.academicFaculty,
  );
  if (!isAcademicFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic faculty not found!');
  }
  next();
});

// Check if academic department exists or not before updating
academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery(); // {_id: '665822af08051........'}
  // check if academic department exists or not
  const isAcademicDepartmentExists =
    await AcademicDepartmentModel.findOne(query);
  if (!isAcademicDepartmentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic department not found!');
  }
  next();
});

export const AcademicDepartmentModel = model<AcademicDepartmentProps>(
  'Academic-Department',
  academicDepartmentSchema,
);
