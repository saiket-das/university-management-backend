import { Types } from 'mongoose';

// export enum WeekDaysProps {
//   Sunday = 'Sun',
//   Monday = 'Mon',
//   Tuesday = 'Tue',
//   Wednesday = 'Wed',
//   Thursday = 'Thu',
//   Friday = 'Fri',
//   Saturday = 'Sat',
// }

export type DaysProps = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';
export interface OfferedCourseProps {
  academicSemester: Types.ObjectId;
  semesterRegistration: Types.ObjectId;
  academicFaculty: Types.ObjectId;
  academicDepartment: Types.ObjectId;
  course: Types.ObjectId;
  faculty: Types.ObjectId;
  section: string;
  days: DaysProps;
  maxCapacity: number;
  startTime: string;
  endTime: string;
}
