import { Schema, model } from 'mongoose';
import {
  GuardianProps,
  LocalGuardianProps,
  StudentPorps,
  UserNameProps,
} from './student.interface';
import config from '../../config';

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

const guardianSchema = new Schema<GuardianProps>({
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
});

const localGuradianSchema = new Schema<LocalGuardianProps>({
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
});

const studentSchema = new Schema<StudentPorps>(
  {
    id: {
      type: String,
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
    dateOfBirth: { type: String, required: true },
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
    profileImage: { type: String, required: true },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

// middlewares

// // hashing password
// studentSchema.pre('save', async function (next) {
//   const student = this;
//   student.password = await bcrypt.hash(
//     student.password,
//     Number(config.bcrypt_salt_rounds),
//   );
//   next();
// });
// studentSchema.post('save', function (doc, next) {
//   doc.password = '';
//   next();
// });

// filter out deleted data
studentSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
studentSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
// [ {$match: { idDeleted: { $ne: true} } }, { '$match': { _id: new ObjectId('6652826feb23496541b9602a') } } ]
studentSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

// virtual
studentSchema.virtual('fullName').get(function () {
  return this.name.firstName + ' ' + this.name.lastName;
});

export const StudentModel = model<StudentPorps>('Student', studentSchema);
