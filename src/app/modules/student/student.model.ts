import bcrypt from 'bcrypt';
import validator from 'validator';
import { Schema, model } from 'mongoose';
import { Student, UserNameProps } from './student.interface';
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

const studentSchema = new Schema<Student>(
  {
    name: {
      type: usernameSchema,
      required: true,
    },
    password: {
      type: String,
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
    dateOfBirth: { type: String },
    contactNumber: { type: String },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-'],
      required: true,
    },
    address: { type: String },
    profileImage: { type: String },
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

// hashing password
studentSchema.pre('save', async function (next) {
  const student = this;
  student.password = await bcrypt.hash(
    student.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

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

studentSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

// virtual
studentSchema.virtual('fullName').get(function () {
  return this.name.firstName + ' ' + this.name.lastName;
});

export const StudentModel = model<Student>('Student', studentSchema);
