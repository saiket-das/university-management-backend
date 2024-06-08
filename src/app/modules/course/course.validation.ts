import { z } from 'zod';

const createPreRequisiteCoursesValidationSchema = z.object({
  body: z.object({
    faculty: z.object({
      course: z.string(),
      isDeleted: z.boolean(),
    }),
  }),
});

const createCourseValidationSchema = z.object({
  body: z.object({
    faculty: z.object({
      name: z.string(),
      prefix: z.string(),
      code: z.number(),
      credits: z.number(),
      preRequisiteCourses: z.array(createPreRequisiteCoursesValidationSchema),
    }),
  }),
});

export const CourseValidations = {
  createCourseValidationSchema,
};
