import { model, Schema } from 'mongoose';
import { AcademicDepartmentProps } from './academicDepartment.interface';

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

export const AcademicDepartmentModel = model<AcademicDepartmentProps>(
  'Academic-Department',
  academicDepartmentSchema,
);
