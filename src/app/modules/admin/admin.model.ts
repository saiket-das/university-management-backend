import { model, Schema } from 'mongoose';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { AcademicDepartmentModel } from '../academicDepartment/academicDepartment.model';
import { AdminProps, UserNameProps } from './admin.interface';

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

const adminSchema = new Schema<AdminProps>(
  {
    id: {
      type: String,
      unique: true,
      required: true,
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
      unique: true,
      ref: 'User',
    },
    managementDepartment: {
      type: Schema.Types.ObjectId,
      required: [true, 'Management department is reuqired'],
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
adminSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// pre validation before create a faculty (check email unique or not and academic faculty & department exists or not )
adminSchema.pre('save', async function (doc, next) {
  const facultyInfo = this;

  // check email already exists or not
  const isEmailExists = await AdminModel.findOne({
    email: facultyInfo.email,
  });
  if (isEmailExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `${facultyInfo.email} email already exists!`,
    );
  }

  // check is academic department id valid or not
  const isAcademicDepartmentExists = await AcademicDepartmentModel.findById(
    facultyInfo.managementDepartment,
  );
  if (!isAcademicDepartmentExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Academic department does not exists!',
    );
  }
});

export const AdminModel = model<AdminProps>('Admin', adminSchema);
