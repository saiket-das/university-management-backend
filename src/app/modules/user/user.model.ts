import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { StaticUserModel, UserProps } from './user.interface';
import config from '../../config';

const userSchema = new Schema<UserProps, StaticUserModel>(
  {
    id: {
      type: String,
      unique: true,
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

// Middlewares
// Hashing password
userSchema.pre('save', async function (next) {
  const student = this;
  student.password = await bcrypt.hash(
    student.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

// Send user empty password after hasshing
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

// ---- Static methods
// method to check is user exists or not
userSchema.statics.isUserExists = async function (id: string) {
  return await UserModel.findOne({ id });
};

// method to check is user exists or not
userSchema.statics.isPasswordMatched = async function (
  plainPassword: string,
  hashPassword,
) {
  return await bcrypt.compare(plainPassword, hashPassword);
};

export const UserModel = model<UserProps, StaticUserModel>('User', userSchema);
