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

export interface AcademicSemesterProps {
  name: AcademicSemesterNameProps;
  code: AcademicSemesterCodeProps;
  year: Date;
  startMonth: MonthsProps;
  endMonth: MonthsProps;
}
