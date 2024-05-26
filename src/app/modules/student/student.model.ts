import bcrypt from 'bcrypt';
import validator from 'validator';
import { Schema, model } from 'mongoose';
import { Student, UserName } from './student.interface';
import config from '../../config';

const usernameSchema = new Schema<UserName>({
  firstName: {
    type: String,
    trim: true,
    required: [true, 'Firstname is required'],
    validate: {
      validator: (value: string) => {
        validator.isAlpha(value);
      },
      message: '{VALUE} is not valid',
    },
  },
  lastName: {
    type: String,
    required: [true, 'Lastname is required'],
    validate: {
      validator: (value: string) => validator.isAlpha(value),
      message: '{VALUE} is not valid',
    },
  },
});

const studentSchema = new Schema<Student>(
  {
    name: {
      type: usernameSchema,
      required: [true, 'Name is required'],
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
      maxlength: [20, "Can't be more than 20 characters"],
      required: true,
    },
    dateOfBirth: { type: String },
    contactNumber: { type: String },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-'],
      required: [true, 'Blood group is required'],
    },
    address: { type: String },
    isActive: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    avatar: { type: String },
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
