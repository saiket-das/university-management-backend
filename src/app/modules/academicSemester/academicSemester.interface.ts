export type AcademicSemesterNameProps = 'Autumn' | 'Summer' | 'Fall';
export type AcademicSemesterCodeProps = '01' | '02' | '03';

export type MonthsProps =
  | 'January'
  | 'February'
  | 'April'
  | 'March'
  | 'May'
  | 'June'
  | 'July'
  | 'August'
  | 'September'
  | 'October'
  | 'November'
  | 'December';

// Autumn: '01', Summer: '02', Fall: '03';
export interface AcademicSemesterProps {
  name: AcademicSemesterNameProps;
  code: AcademicSemesterCodeProps;
  year: String;
  startMonth: MonthsProps;
  endMonth: MonthsProps;
}

export interface NameCodeMapperProps {
  [key: string]: string;
}
