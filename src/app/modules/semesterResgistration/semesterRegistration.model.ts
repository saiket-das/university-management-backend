import { model, Schema } from 'mongoose';
import { SemesterRegistrationProps } from './semesterRegistration.interface';
import {
  RegistrationStatus,
  SemesterRegistartionStatus,
} from './semesterRegistration.constant';
import { AcademicSemesterModel } from '../academicSemester/academicSemester.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const semesterRegistrationSchema = new Schema<SemesterRegistrationProps>(
  {
    academicSemester: {
      type: Schema.Types.ObjectId,
      unique: true,
      ref: 'Academic-Semester',
      required: true,
    },
    status: {
      type: String,
      enum: SemesterRegistartionStatus,
      default: RegistrationStatus.UPCOMING,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    minCredit: {
      type: Number,
      default: 6,
    },
    maxCredit: {
      type: Number,
      default: 12,
    },
  },
  {
    timestamps: true,
  },
);

// Save pre validation before create a nw semester registration
semesterRegistrationSchema.pre('save', async function (next) {
  const semesterRegistrationInfo = this;

  // check is there any ONGOING | UPCOMING semester registration (if true, then can't create new semester registration)
  const isThereAnyUpcomingOrOngoingSemester =
    await SemesterRegistrationModel.findOne({
      $or: [
        { status: RegistrationStatus.UPCOMING },
        { status: RegistrationStatus.ONGOING },
      ],
    });
  if (isThereAnyUpcomingOrOngoingSemester) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `There is already an ${isThereAnyUpcomingOrOngoingSemester.status} registered semester !`,
    );
  }

  // check is new semester registration already exists or not
  const isNewSemesterExists = await SemesterRegistrationModel.findOne({
    academicSemester: semesterRegistrationInfo.academicSemester,
  });
  if (isNewSemesterExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Semester already exists!');
  }

  // Check is academic semester exists or not
  const isAcademicSemesterExists = await AcademicSemesterModel.findById({
    _id: semesterRegistrationInfo.academicSemester,
  });
  if (!isAcademicSemesterExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Semester not found!');
  }

  next();
});

export const SemesterRegistrationModel = model<SemesterRegistrationProps>(
  'Semester-Registration',
  semesterRegistrationSchema,
);
