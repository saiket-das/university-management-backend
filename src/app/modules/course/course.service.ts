import mongoose, { Types } from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { CourseSearchableFields } from './course.constant';
import { CourseFacultyProps, CourseProps } from './course.interface';
import { CourseFacultyModel, CourseModel } from './course.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

// Create a new course
const createCourseService = async (payload: CourseProps) => {
  const result = await CourseModel.create(payload);
  return result;
};

// Get all courses
const getAllCoursesService = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    CourseModel.find().populate({
      path: 'preRequisiteCourses',
      populate: {
        path: 'course',
      },
    }),
    query,
  )
    .search(CourseSearchableFields)
    .fields()
    .sort()
    .filter()
    .pagination();
  const result = await courseQuery.modelQuery;
  const meta = await courseQuery.countTotal();
  return {
    meta,
    result,
  };
};

// Get a course by Id
const getSingleCourseByIdService = async (courseId: string) => {
  const result = await CourseModel.findById(courseId).populate({
    path: 'preRequisiteCourses',
    populate: {
      path: 'course',
    },
  });
  return result;
};

// Get assigned faculties with course
const getFacultiesWithCourseService = async (courseId: string) => {
  const result = await CourseFacultyModel.findOne({
    course: courseId,
  }).populate('faculties');
  return result;
};

// Update a course info by Id
const updateCourseByIdService = async (
  courseId: string,
  payload: Partial<CourseProps>,
) => {
  const session = await mongoose.startSession();
  try {
    // start transaction
    session.startTransaction();

    const { preRequisiteCourses, ...remainingData } = payload;
    // session 1 - update basic data (except preRequisiteCourses)
    const updatdeBasicCourseInfo = await CourseModel.findByIdAndUpdate(
      courseId,
      remainingData,
      {
        new: true,
        runValidators: true,
        session,
      },
    );

    if (!updatdeBasicCourseInfo) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update basic info');
    }

    // check if there is any pre-requisite courses to update
    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      // filter out deleted pre-requiste courses (isdeleted = true)
      const deletedPreRequisites = preRequisiteCourses
        .filter((ele) => ele.course && ele.isDeleted === true)
        .map((ele) => ele.course);

      // session 2 - delete deleted pre-requiste courses from actual course
      const deletedPreRequisitesCourse = await CourseModel.findByIdAndUpdate(
        courseId,
        {
          $pull: {
            preRequisiteCourses: { course: { $in: deletedPreRequisites } },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );

      if (!deletedPreRequisitesCourse) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Failed to delete pre-requisites courses',
        );
      }

      // filter out new pre-requiste courses (isdeleted = false)
      const newPreRequisites = preRequisiteCourses.filter(
        (ele) => ele.course && !ele.isDeleted,
      );
      // session 3 - add new pre-requiste courses to actual course
      const newPreRequisitesCourse = await CourseModel.findByIdAndUpdate(
        courseId,
        {
          $addToSet: {
            preRequisiteCourses: { $each: newPreRequisites },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );

      if (!newPreRequisitesCourse) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Failed to add new pre-requisites courses',
        );
      }
    }

    // send user updated data
    const result = await CourseModel.findById(courseId).populate(
      'preRequisiteCourses.course',
    );
    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'An error occurred while updating course info!',
    );
  }
};

// Delete a course by Id
const deleteCourseByIdService = async (courseId: string) => {
  const result = await CourseModel.findByIdAndUpdate(
    courseId,
    {
      isDeleted: true,
    },
    {
      new: true,
    },
  );
  return result;
};

// Assign course to faculties
const assignCourseToFacultiesService = async (
  courseId: string,
  payload: Partial<CourseFacultyProps>,
) => {
  const result = await CourseFacultyModel.findByIdAndUpdate(
    courseId,
    {
      course: courseId, // add courseId (from params) into course-faculty
      $addToSet: { faculties: { $each: payload.faculties } },
    },
    {
      upsert: true, // if dont have any course-faculty with this courseId then create a new course-faculty
      new: true,
    },
  );

  return result;
};

// Delete faculties from course
const removeFacultiesFromCourseService = async (
  courseId: string,
  payload: Partial<CourseFacultyProps>,
) => {
  const result = await CourseFacultyModel.findByIdAndUpdate(
    courseId,
    {
      $pull: { faculties: { $in: payload.faculties } },
    },
    {
      new: true,
    },
  );

  return result;
};

export const CourseServices = {
  createCourseService,
  getAllCoursesService,
  getSingleCourseByIdService,
  getFacultiesWithCourseService,
  updateCourseByIdService,
  deleteCourseByIdService,
  assignCourseToFacultiesService,
  removeFacultiesFromCourseService,
};
