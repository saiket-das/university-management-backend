import { Types } from 'mongoose';

export type DaysProps =
  | 'Sunday'
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday';
export interface OfferedCourseProps {
  semesterRegistration: Types.ObjectId;
  academicSemester?: Types.ObjectId;
  academicFaculty: Types.ObjectId;
  academicDepartment: Types.ObjectId;
  course: Types.ObjectId;
  faculty: Types.ObjectId;
  section: string;
  days: DaysProps[];
  maxCapacity: number;
  startTime: string;
  endTime: string;
}

export interface ScheduleProps {
  days: DaysProps[];
  startTime: string;
  endTime: String;
}
