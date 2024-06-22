import { Schema, model } from 'mongoose';
import {
  GuardianProps,
  LocalGuardianProps,
  StudentProps,
  UserNameProps,
} from './student.interface';

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

const guardianSchema = new Schema<GuardianProps>(
  {
    fatherName: {
      type: String,
      required: true,
    },
    fatherOccupation: {
      type: String,
      required: true,
    },
    fatherContactNo: {
      type: String,
      required: true,
    },
    motherName: {
      type: String,
      required: true,
    },
    motherOccupation: {
      type: String,
      required: true,
    },
    motherContactNo: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const localGuradianSchema = new Schema<LocalGuardianProps>(
  {
    name: {
      type: String,
      required: true,
    },
    occupation: {
      type: String,
      required: true,
    },
    contactNo: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const studentSchema = new Schema<StudentProps>(
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
    guardian: guardianSchema,
    localGuardian: localGuradianSchema,
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
    admissionSemester: {
      type: Schema.Types.ObjectId,
      required: [true, 'Academic semester is reuqired'],
      ref: 'Academic-Semester',
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      required: [true, 'Academic department is reuqired'],
      ref: 'Academic-Department',
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'Academic-Faculty',
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
studentSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

studentSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

studentSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

// virtual
// studentSchema.virtual('fullName').get(function () {
//   return this.name.firstName + ' ' + this.name.lastName;
// });

export const StudentModel = model<StudentProps>('Student', studentSchema);
