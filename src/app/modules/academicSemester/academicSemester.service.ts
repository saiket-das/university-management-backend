import { ObjectId } from 'mongoose';
import { academicSemesterNameCodeMapper } from './academicSemester.constant';
import {
  AcademicSemesterProps,
  NameCodeMapperProps,
} from './academicSemester.interface';
import { AcademicSemesterModel } from './academicSemester.model';

// Create a new academic semester
const createAcademicSemesterService = async (
  payload: AcademicSemesterProps,
) => {
  // academicSemesterNameCodeMapper['Summer'] === '02'
  if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new Error('Invalid semester code');
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
    throw new Error('Invalid Semester Code');
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
