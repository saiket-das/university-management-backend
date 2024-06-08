import { CourseProps } from './course.interface';
import { CourseModel } from './course.model';

const createCourseService = async (payload: CourseProps) => {
  const result = await CourseModel.create(payload);
  return result;
};

const getAllCoursesService = async () => {
  const result = await CourseModel.find();
  return result;
};

const getSingleCourseByIdService = async (courseId: string) => {
  const result = await CourseModel.findById(courseId);
  return result;
};

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

export const CourseServices = {
  createCourseService,
  getAllCoursesService,
  getSingleCourseByIdService,
  deleteCourseByIdService,
};
