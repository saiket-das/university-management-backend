import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { UserProps } from './user.interface';
import config from '../../config';

const userSchema = new Schema<UserProps>(
  {
    id: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ['admin', 'faculty', 'student'],
    },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
      default: 'in-progress',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// middlewares

// hashing password
userSchema.pre('save', async function (next) {
  const student = this;
  student.password = await bcrypt.hash(
    student.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

// send user empty password after hasshing
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

export const UserModel = model<UserProps>('User', userSchema);
