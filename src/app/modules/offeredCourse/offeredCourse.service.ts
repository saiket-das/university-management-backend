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
import { StudentModel } from '../student/student.model';

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

// Get all offered courses
const getAllOfferedCoursesService = async (query: Record<string, unknown>) => {
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
  const meta = await offeredCourseQuery.countTotal();
  return { meta, result };
};

// Get all offered courses of a specific student
const getMyOfferedCoursesService = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  // pagination setup
  const page = Number(query?.page) || 1;
  const limit = Number(query?.limit) || 10;
  const skip = (page - 1) * limit;

  // check is student exists or not
  const student = await StudentModel.findOne({ id: userId });
  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not found');
  }

  // check is current ongoing semester exists or not
  const currentOngoingRegistrationSemester =
    await SemesterRegistrationModel.findOne({
      status: RegistrationStatus.ONGOING,
    });

  if (!currentOngoingRegistrationSemester) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'There is no ongoing semester registration!',
    );
  }

  // agregation query
  /*
    1: Offered only student's department courses
    2: Filter Out Enrolled Courses
    3: Filter Out Courses Unfulfilled By Prerequisite Requirements
  */
  const aggregationQuery = [
    {
      $match: {
        semesterRegistration: currentOngoingRegistrationSemester?._id,
        academicFaculty: student.academicFaculty,
        academicDepartment: student.academicDepartment,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'course',
      },
    },
    {
      $unwind: '$course',
    },
    {
      $lookup: {
        from: 'enrolled-courses',
        let: {
          currentOngoingRegistrationSemester:
            currentOngoingRegistrationSemester._id,
          currentStudent: student._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: [
                      '$semesterRegistration',
                      '$$currentOngoingRegistrationSemester',
                    ],
                  },
                  {
                    $eq: ['$student', '$$currentStudent'],
                  },
                  {
                    $eq: ['$isEnrolled', true],
                  },
                ],
              },
            },
          },
        ],
        as: 'enrolledCourses',
      },
    },
    {
      $lookup: {
        from: 'enrolled-courses',
        let: {
          currentStudent: student._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ['$student', '$$currentStudent'],
                  },
                  {
                    $eq: ['$isCompleted', true],
                  },
                ],
              },
            },
          },
        ],
        as: 'completedCourses',
      },
    },
    {
      $addFields: {
        completedCourseIds: {
          $map: {
            input: '$completedCourses',
            as: 'completed',
            in: '$$completed.course',
          },
        },
      },
    },
    {
      $addFields: {
        isPreRequisitesFulFilled: {
          $or: [
            { $eq: ['$course.preRequisiteCourses', []] },
            {
              $setIsSubset: [
                '$course.preRequisiteCourses.course',
                '$completedCourseIds',
              ],
            },
          ],
        },

        isAlreadyEnrolled: {
          $in: [
            '$course._id',
            {
              $map: {
                input: '$enrolledCourses',
                as: 'enroll',
                in: '$$enroll.course',
              },
            },
          ],
        },
      },
    },
    {
      $match: {
        isAlreadyEnrolled: false,
        isPreRequisitesFulFilled: true,
      },
    },
  ];

  // pagination query
  const paginationQuery = [
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ];

  // get result after agreegation and pagination query
  const result = await OfferedCourseModel.aggregate([
    ...aggregationQuery,
    ...paginationQuery,
  ]);

  const total = (await OfferedCourseModel.aggregate(aggregationQuery)).length;
  const totalPage = Math.ceil(result.length / limit);

  const meta = {
    page,
    limit,
    total,
    totalPage,
  };

  return {
    meta,
    result,
  };
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
  getAllOfferedCoursesService,
  getMyOfferedCoursesService,
  updateOfferedCourseService,
};
