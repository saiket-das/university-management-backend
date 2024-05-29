import {
  AcademicSemesterProps,
  NameCodeMapperProps,
} from './academicSemester.interface';
import { academicSemesterModel } from './academicSemester.model';

const createAcademicSemesterService = async (
  playload: AcademicSemesterProps,
) => {
  // semester name === semester code (exmple -> (Autumn === 01, Summer === 02 & Fall === 03))
  const academicSemesterNameCodeMapper: NameCodeMapperProps = {
    Autumn: '01',
    Summer: '02',
    Fall: '03',
  };

  // academicSemesterNameCodeMapper['Summer'] === '02'
  if (academicSemesterNameCodeMapper[playload.name] !== playload.code) {
    throw new Error('Invalid semester code');
  }

  const result = await academicSemesterModel.create(playload);
  return result;
};

export const AcademicSemesterServices = {
  createAcademicSemesterService,
};
