import { AcademicSemesterProps } from './academicSemester.interface';
import { academicSemesterModel } from './academicSemester.model';

const createAcademicSemesterService = async (
  playload: AcademicSemesterProps,
) => {
  const result = await academicSemesterModel.create(playload);
  return result;
};

export const AcademicSemesterServices = {
  createAcademicSemesterService,
};
