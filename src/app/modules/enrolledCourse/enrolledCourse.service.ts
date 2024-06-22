import httpStatus from 'http-status';
import { OfferedCourseModel } from '../offeredCourse/offeredCourse.model';
import { EnrolledCourseProps } from './enrolledCourse.interface';
import AppError from '../../errors/AppError';
import { StudentModel } from '../student/student.model';
import { EnrolledCourseModel } from './enrolledCourse.model';
import { CourseModel } from '../course/course.model';
import { SemesterRegistrationModel } from '../semesterResgistration/semesterRegistration.model';
import { startSession } from 'mongoose';
import { FacultyModel } from '../faculty/faculty.model';
import { calculateGradeAndPoints } from './enrolledCourse.utils';
import QueryBuilder from '../../builder/QueryBuilder';

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
      'You have exceeded maximum number of credits!',
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

// Get all courses of a specific student
const getMyEnrolledCoursesService = async (
  studentId: string,
  query: Record<string, unknown>,
) => {
  const student = await StudentModel.findOne({ id: studentId });

  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student not found !');
  }

  const enrolledCourseQuery = new QueryBuilder(
    EnrolledCourseModel.find({ student: student._id }).populate(
      'semesterRegistration academicSemester academicFaculty academicDepartment offeredCourse course student faculty',
    ),
    query,
  )
    .filter()
    .sort()
    .pagination()
    .fields();

  const result = await enrolledCourseQuery.modelQuery;
  const meta = await enrolledCourseQuery.countTotal();

  return {
    meta,
    result,
  };
};

// Create an enrolled course's info
const updateEnrolledCourseMarksService = async (
  facultyId: string,
  payload: Partial<EnrolledCourseProps>,
) => {
  const { semesterRegistration, offeredCourse, student, courseMarks } = payload;

  // check is semester registration exists or not
  const isSemesterRegistrationExists =
    await SemesterRegistrationModel.findById(semesterRegistration);
  if (!isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Semester registration not found!',
    );
  }

  // check is offered course exists or not
  const isOfferedCourseExists =
    await OfferedCourseModel.findById(offeredCourse);
  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found!');
  }

  // check is student exists or not
  const isStudentExists = await StudentModel.findById(student);
  if (!isStudentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student not found!');
  }

  // check is faculty exists or not
  const faculty = await FacultyModel.findOne({ id: facultyId }, { _id: 1 });
  if (!faculty) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found!');
  }

  // check is course belongs to given faculty
  const isCourseBelongToFaculty = await EnrolledCourseModel.findOne({
    semesterRegistration,
    offeredCourse,
    student,
    faculty: faculty._id,
  });

  if (!isCourseBelongToFaculty) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden!');
  }

  // Modify course marks data
  const modifiedData: Record<string, unknown> = {
    ...courseMarks,
  };

  if (courseMarks?.finalTerm) {
    const { classTest1, classTest2, midTerm, finalTerm } =
      isCourseBelongToFaculty.courseMarks;

    // calculate total marks, grade & gpa
    const totalMarks =
      Math.ceil(classTest1 * 0.1) +
      Math.ceil(midTerm * 0.3) +
      Math.ceil(classTest2 * 0.1) +
      Math.ceil(finalTerm * 0.5);

    const result = calculateGradeAndPoints(totalMarks);

    // set grade and grade points (gpa) into modify data (course marks)
    modifiedData.grade = result.grade;
    modifiedData.gradePoints = result.gradePoints;
    modifiedData.isCompleted = true;
  }

  if (courseMarks && Object.keys(courseMarks).length) {
    for (const [key, value] of Object.entries(courseMarks)) {
      modifiedData[`courseMarks.${key}`] = value;
    }
  }

  // update course marks, grade & grade point (gpa)
  const result = await EnrolledCourseModel.findByIdAndUpdate(
    isCourseBelongToFaculty._id,
    modifiedData,
    {
      new: true,
    },
  );

  return result;

  return null;
};

export const EnrolledCourseServices = {
  createEnrolledCourseService,
  getMyEnrolledCoursesService,
  updateEnrolledCourseMarksService,
};
