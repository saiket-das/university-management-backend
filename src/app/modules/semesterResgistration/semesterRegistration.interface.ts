import { Types } from 'mongoose';

export interface SemesterRegistrationProps {
  academicSemester: Types.ObjectId;
  status?: 'UPCOMING' | 'ONGOING' | 'ENDED';
  startDate: Date;
  endDate: Date;
  minCredit?: number;
  maxCredit: number;
}
