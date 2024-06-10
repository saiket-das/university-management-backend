import { ScheduleProps } from './offeredCourse.interface';

export const handleTimeConflict = (
  assignedSchedules: ScheduleProps[],
  newSchedule: ScheduleProps,
) => {
  for (const schedule of assignedSchedules) {
    const existingStartTime = new Date(`1970-01-01T${schedule.startTime}`);
    const existingEndTime = new Date(`1970-01-01T${schedule.endTime}`);
    const newStartTime = new Date(`1970-01-01T${newSchedule.startTime}`);
    const newEndTime = new Date(`1970-01-01T${newSchedule.endTime}`);

    // exist time --> 9:00 - 10:30
    // new time   --> 9:00 - 11:00
    //   9:00 < 10:30    &&    11:00 > 9:00
    if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
      return true;
    }
  }
  return false;
};
