import { model, Schema } from 'mongoose';
import { FacultyProps, UserNameProps } from './faculty.interface';
import { AcademicFacultyModel } from '../academicFaculty/academicFaculty.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { AcademicDepartmentModel } from '../academicDepartment/academicDepartment.model';
import { AcademicFacultyProps } from '../academicFaculty/academicFaculty.interface';
import { AcademicDepartmentProps } from '../academicDepartment/academicDepartment.interface';

const usernameSchema = new Schema<UserNameProps>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const facultySchema = new Schema<FacultyProps>(
  {
    id: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
    },
    name: {
      type: usernameSchema,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'others'],
      },
      maxlength: 20,
      required: true,
    },
    dateOfBirth: { type: Date, required: true },
    contactNumber: { type: String, required: true },
    emergencyContactNumber: { type: String, required: true },
    presentAddress: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-'],
      required: true,
    },
    profileImage: { type: String, default: '' },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User is required'],
      unique: true,
      ref: 'User',
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'Academic-Faculty',
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      required: [true, 'Academic department is reuqired'],
      ref: 'Academic-Department',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    timestamps: true,
  },
);

// filter out deleted data
facultySchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// pre validation before create a faculty (check email unique or not and academic faculty & department exists or not )
facultySchema.pre('save', async function (next) {
  const facultyInfo = this;

  // check email already exists or not
  const isEmailExists = await FacultyModel.findOne({
    email: facultyInfo.email,
  });
  if (isEmailExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `${facultyInfo.email} email already exists!`,
    );
  }

  // check is academic faculty id valid or not
  const isAcademicFacultyExists = await AcademicFacultyModel.findById(
    facultyInfo.academicFaculty,
  );
  if (!isAcademicFacultyExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Academic faculty does not exists!',
    );
  }

  // check is academic department id valid or not
  const isAcademicDepartmentExists = await AcademicDepartmentModel.findById(
    facultyInfo.academicDepartment,
  );
  if (!isAcademicDepartmentExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Academic department does not exists!',
    );
  }
  next();
});

export const FacultyModel = model<FacultyProps>('Faculty', facultySchema);
