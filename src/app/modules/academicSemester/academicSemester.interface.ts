export type MonthsProps =
  | 'January'
  | 'February'
  | 'March'
  | 'April'
  | 'May'
  | 'June'
  | 'July'
  | 'August'
  | 'September'
  | 'October'
  | 'November'
  | 'December';

export interface AcademicSemesterProps {
  name: 'Autumn' | 'Summer' | 'Fall';
  code: '01' | '02' | '03 ';
  year: Date;
  startMonth: MonthsProps;
  endMonth: MonthsProps;
}
