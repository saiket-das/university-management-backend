import {
  AcademicSemesterCodeProps,
  AcademicSemesterNameProps,
  MonthsProps,
  NameCodeMapperProps,
} from './academicSemester.interface';

export const Months: MonthsProps[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const AcademicSemesterName: AcademicSemesterNameProps[] = [
  'Autumn',
  'Summer',
  'Fall',
];

export const AcademicSemesterCode: AcademicSemesterCodeProps[] = [
  '01',
  '02',
  '03',
];

// semester name === semester code (exmple -> (Autumn === 01, Summer === 02 & Fall === 03))
export const academicSemesterNameCodeMapper: NameCodeMapperProps = {
  Autumn: '01',
  Summer: '02',
  Fall: '03',
};

export const AcademicSemesterSearchableFields = ['name', 'year'];
