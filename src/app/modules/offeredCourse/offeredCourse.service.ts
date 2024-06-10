import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { SemesterRegistrationModel } from '../semesterResgistration/semesterRegistration.model';
import { OfferedCourseProps } from './offeredCourse.interface';
import { OfferedCourseModel } from './offeredCourse.model';
import { FacultyModel } from '../faculty/faculty.model';
import { handleTimeConflict } from './offeredCourse.utils';
import { RegistrationStatus } from '../semesterResgistration/semesterRegistration.constant';
import QueryBuilder from '../../builder/QueryBuilder';
import { OfferedCourseSearchableFields } from './offeredCourse.constant';

// Create a new semester resgistration
const createOfferedCourseService = async (payload: OfferedCourseProps) => {
  const { semesterRegistration } = payload;

  // check if semester registration exists or not
  const isSemesterExists =
    await SemesterRegistrationModel.findById(semesterRegistration);
  if (!isSemesterExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Semester not found!');
  }

  payload.academicSemester = isSemesterExists.academicSemester;

  const result = await OfferedCourseModel.create(payload);
  return result;
};

// Create a new semester resgistration
const getOfferedCoursesService = async (query: Record<string, unknown>) => {
  const offeredCourseQuery = new QueryBuilder(
    OfferedCourseModel.find()
      .populate('semesterRegistration')
      .populate('academicSemester')
      .populate('academicFaculty')
      .populate('academicDepartment')
      .populate('course')
      .populate('faculty'),
    query,
  )
    .search(OfferedCourseSearchableFields)
    .filter()
    .sort()
    .pagination()
    .fields();

  const result = await offeredCourseQuery.modelQuery;
  return result;
};

// Create a new semester resgistration
const updateOfferedCourseService = async (
  id: string,
  payload: Pick<
    OfferedCourseProps,
    'faculty' | 'days' | 'startTime' | 'endTime'
  >,
) => {
  const { faculty, days, startTime, endTime } = payload;

  // check if offered course  exists or not
  const isOfferedCourseExists = await OfferedCourseModel.findById(id);
  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found!');
  }

  // check if faculty(Lecturer) exists or not
  const isFacultyExists = await FacultyModel.findById(faculty);
  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found!');
  }

  const semesterRegistration = isOfferedCourseExists.semesterRegistration;

  // check registation semester status is UPCOMING or not before update (if UPCOMING then only can update)
  const isRegistrationSemesterStatusUpcoming =
    await SemesterRegistrationModel.findById(semesterRegistration);
  if (
    isRegistrationSemesterStatusUpcoming?.status !== RegistrationStatus.UPCOMING
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Semester is already ${isRegistrationSemesterStatusUpcoming?.status}. Can't update offered course's info.`,
    );
  }

  // get the schedules of the given faculty for the give days
  const assignedSchedules = await OfferedCourseModel.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days  startTime endTime');
  const newSchedule = {
    days,
    startTime,
    endTime,
  };
  // check is given faculty has time conflict within given days & time & exisiting days & time
  if (handleTimeConflict(assignedSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      `This faculty not available this time. Choose another time or day`,
    );
  }

  const result = await OfferedCourseModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

export const OfferedCourseServices = {
  createOfferedCourseService,
  updateOfferedCourseService,
  getOfferedCoursesService,
};
