import { model, Schema } from 'mongoose';
import { FacultyProps, UserNameProps } from './faculty.interface';

const usernameSchema = new Schema<UserNameProps>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
});

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
    profileImage: { type: String, required: true },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User is required'],
      unique: true,
      ref: 'User',
    },
    admissionFaculty: {
      type: Schema.Types.ObjectId,
      required: [true, 'Academic faculty is reuqired'],
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

export const FacultyModel = model<FacultyProps>('Faculty', facultySchema);
