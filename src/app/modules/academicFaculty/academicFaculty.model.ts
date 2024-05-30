import { model, Schema } from 'mongoose';
import { AcademicFacultyProps } from './academicFaculty.interface';

const academicFacultySchema = new Schema<AcademicFacultyProps>(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const AcademicFacultyModel = model<AcademicFacultyProps>(
  'Academic-Faculty',
  academicFacultySchema,
);
