import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { RegistrationStatus } from './semesterRegistration.constant';
import { SemesterRegistrationProps } from './semesterRegistration.interface';
import { SemesterRegistrationModel } from './semesterRegistration.model';
import AppError from '../../errors/AppError';

// Create a new semester resgistration
const createSemesterRegistrationService = async (
  payload: SemesterRegistrationProps,
) => {
  const result = await SemesterRegistrationModel.create(payload);
  return result;
};

// Get all semester registrations
const getAllSemesterRegistrationsService = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistrationModel.find().populate('academicSemester'),
    query,
  )
    .filter()
    .sort()
    .pagination()
    .fields();
  const result = semesterRegistrationQuery.modelQuery;
  return result;
};

// Get a semester registration by Id
const getSingleSemesterRegistrationService = async (id: string) => {
  const result =
    await SemesterRegistrationModel.findById(id).populate('academicSemester');
  return result;
};

// Update a semester registration info by Id
const updateSemesterRegistrationService = async (
  id: string,
  payload: Partial<SemesterRegistrationProps>,
) => {
  // check is new semester registration already exists or not
  const isRequestedSemesterExists =
    await SemesterRegistrationModel.findById(id);
  if (!isRequestedSemesterExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Semester not found!');
  }

  // check if the semester is ended or not (if ended, then can't update)
  const currentSemesterStatus = isRequestedSemesterExists.status;
  const requestedSemesterStatus = payload?.status;
  if (currentSemesterStatus === RegistrationStatus.ENDED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This semester already ${currentSemesterStatus}!`,
    );
  }

  // UPCOMING --> ONGOING --> ENDED
  // can't change UPCOMING --> ENDED
  if (
    currentSemesterStatus === RegistrationStatus.UPCOMING &&
    requestedSemesterStatus === RegistrationStatus.ENDED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not chnage semester status from ${currentSemesterStatus} to ${requestedSemesterStatus}!`,
    );
  }
  // can't change ONGOING --> UPCOMING
  if (
    currentSemesterStatus === RegistrationStatus.ONGOING &&
    requestedSemesterStatus === RegistrationStatus.UPCOMING
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not chnage semester status from ${currentSemesterStatus} to ${requestedSemesterStatus}!`,
    );
  }

  const result = await SemesterRegistrationModel.findByIdAndUpdate(
    id,
    payload,
    {
      new: true,
      runValidators: true,
    },
  );
  return result;
};

export const SemesterRegistrationServices = {
  createSemesterRegistrationService,
  getAllSemesterRegistrationsService,
  getSingleSemesterRegistrationService,
  updateSemesterRegistrationService,
};
