import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { StaticUserModel, UserProps } from './user.interface';
import config from '../../config';
import { UserStatus } from './user.constant';

const userSchema = new Schema<UserProps, StaticUserModel>(
  {
    id: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: ['superAdmin', 'admin', 'faculty', 'student'],
    },
    status: {
      type: String,
      enum: UserStatus,
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
  return await UserModel.findOne({ id }).select('+password');
};

// method to check is user exists or not
userSchema.statics.isPasswordMatched = async function (
  plainPassword: string,
  hashPassword,
) {
  return await bcrypt.compare(plainPassword, hashPassword);
};

// is JWT issued before password changed
userSchema.statics.isJwtIssuedBeforePasswordChange = function (
  jwtIssueTimestamp: number,
  passwordChangedTimestamp: Date,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssueTimestamp;
};

export const UserModel = model<UserProps, StaticUserModel>('User', userSchema);
