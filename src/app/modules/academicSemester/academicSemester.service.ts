import { academicSemesterNameCodeMapper } from './academicSemester.constant';
import { AcademicSemesterProps } from './academicSemester.interface';
import { AcademicSemesterModel } from './academicSemester.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

// Create a new academic semester
const createAcademicSemesterService = async (
  payload: AcademicSemesterProps,
) => {
  // academicSemesterNameCodeMapper['Summer'] === '02'
  if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invalid semester code');
  }
  const result = await AcademicSemesterModel.create(payload);
  return result;
};

// Get all academic semesters
const fetchAllAcademicSemesterService = async () => {
  const result = await AcademicSemesterModel.find();
  return result;
};

// Get a single academic semester by id
const fetchSingleAcademicSemesterByIdService = async (semesterId: string) => {
  const result = await AcademicSemesterModel.findById(semesterId);
  return result;
};

// Update a academic semester's info
const updateAcademicSemesterByIdService = async (
  semesterId: string,
  payload: Partial<AcademicSemesterProps>,
) => {
  if (
    payload.name &&
    payload.code &&
    academicSemesterNameCodeMapper[payload.name] !== payload.code
  ) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invalid Semester Code');
  }
  const result = await AcademicSemesterModel.findOneAndUpdate(
    { _id: semesterId },
    payload,
    { new: true },
  );
  return result;
};
export const AcademicSemesterServices = {
  createAcademicSemesterService,
  fetchAllAcademicSemesterService,
  fetchSingleAcademicSemesterByIdService,
  updateAcademicSemesterByIdService,
};
