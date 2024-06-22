import httpStatus from 'http-status';
import { OfferedCourseModel } from '../offeredCourse/offeredCourse.model';
import { EnrolledCourseProps } from './enrolledCourse.interface';
import AppError from '../../errors/AppError';
import { StudentModel } from '../student/student.model';
import { EnrolledCourseModel } from './enrolledCourse.model';
import { CourseModel } from '../course/course.model';
import { SemesterRegistrationModel } from '../semesterResgistration/semesterRegistration.model';
import { startSession } from 'mongoose';

// Create an enrolled course
const createEnrolledCourseService = async (
  userId: string,
  payload: EnrolledCourseProps,
) => {
  /*
    step 1: check is the offered course exists or not
    step 2: check is there any capacity or not
    step 3: check is student already enrolled or not
    step 4: check total credits exceeds maxCredit
    step 5: create an enrolled course
  */

  const { offeredCourse } = payload;

  // check is the offered course exists or not
  const isOfferedCourseExists =
    await OfferedCourseModel.findById(offeredCourse);
  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found!');
  }

  // check is there any capacity or not
  if (isOfferedCourseExists.maxCapacity <= 0) {
    throw new AppError(httpStatus.BAD_GATEWAY, 'Section is full!');
  }

  // Check is student exist or not
  const student = await StudentModel.findOne({ id: userId }, { _id: 1 });
  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student not found !');
  }

  // check is the student already enrolled or not
  const isStudentAlreadyEnrolled = await EnrolledCourseModel.findOne({
    semesterRegistration: isOfferedCourseExists.semesterRegistration,
    offeredCourse,
    student: student._id,
  });
  if (isStudentAlreadyEnrolled) {
    throw new AppError(httpStatus.CONFLICT, 'Student is already enrolled !');
  }

  // get current credit
  const course = await CourseModel.findById(isOfferedCourseExists.course);
  const currentCredit = course?.credits;

  // get max credit of the semester
  const semesterRegistration = await SemesterRegistrationModel.findById(
    isOfferedCourseExists.semesterRegistration,
  ).select('maxCredit');
  const maxCredit = semesterRegistration?.maxCredit;

  // check total credits exceeds maxCredit
  const enrolledCourses = await EnrolledCourseModel.aggregate([
    {
      $match: {
        semesterRegistration: isOfferedCourseExists.semesterRegistration,
        student: student._id,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'enrolledCourseData',
      },
    },
    {
      $unwind: '$enrolledCourseData',
    },
    {
      $group: {
        _id: null,
        totalEnrolledCredits: { $sum: '$enrolledCourseData.credits' },
      },
    },
    {
      $project: {
        _id: 0,
        totalEnrolledCredits: 1,
      },
    },
  ]);

  //  total enrolled credits + new enrolled course credit > maxCredit
  const totalCredits =
    enrolledCourses.length > 0 ? enrolledCourses[0].totalEnrolledCredits : 0;

  if (totalCredits && maxCredit && totalCredits + currentCredit > maxCredit) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You have exceeded maximum number of credits !',
    );
  }

  // start session
  const session = await startSession();

  try {
    session.startTransaction();

    // create an enrolled course (transaction - 1)
    const result = await EnrolledCourseModel.create(
      [
        {
          semesterRegistration: isOfferedCourseExists.semesterRegistration,
          academicSemester: isOfferedCourseExists.academicSemester,
          academicFaculty: isOfferedCourseExists.academicFaculty,
          academicDepartment: isOfferedCourseExists.academicDepartment,
          offeredCourse: offeredCourse,
          course: isOfferedCourseExists.course,
          student: student._id,
          faculty: isOfferedCourseExists.faculty,
          isEnrolled: true,
        },
      ],
      { session },
    );
    if (!result) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to enroll in this cousre!',
      );
    }

    // update the capacity into Offered course (transaction - 2)
    const maxCapacity = isOfferedCourseExists.maxCapacity;
    await OfferedCourseModel.findByIdAndUpdate(
      offeredCourse,
      {
        maxCapacity: maxCapacity - 1,
      },
      { session },
    );

    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

// Create an enrolled course's info
const updateEnrolledCourseMarksService = (
  payload: Partial<EnrolledCourseProps>,
) => {};

export const EnrolledCourseServices = {
  createEnrolledCourseService,
  updateEnrolledCourseMarksService,
};
