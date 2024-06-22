import { Types } from 'mongoose';

export type GradeProps = 'A' | 'B' | 'C' | 'D' | 'F' | 'NA';

export type EnrolledCourseMarksProps = {
  classTest1: number;
  midTerm: number;
  classTest2: number;
  finalTerm: number;
};

export type EnrolledCourseProps = {
  semesterRegistration: Types.ObjectId;
  academicSemester: Types.ObjectId;
  academicFaculty: Types.ObjectId;
  academicDepartment: Types.ObjectId;
  offeredCourse: Types.ObjectId;
  course: Types.ObjectId;
  student: Types.ObjectId;
  faculty: Types.ObjectId;
  isEnrolled: boolean;
  courseMarks: EnrolledCourseMarksProps;
  grade: GradeProps;
  gradePoints: number;
  isCompleted: boolean;
};
