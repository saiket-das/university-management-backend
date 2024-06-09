import { z } from 'zod';

// Validation schema for creating a new course
const createPreRequisiteCoursesValidationSchema = z.object({
  course: z.string(),
  isDeleted: z.boolean().optional(),
});

const createCourseValidationSchema = z.object({
  body: z.object({
    course: z.object({
      title: z.string(),
      prefix: z.string(),
      code: z.number(),
      credits: z.number(),
      preRequisiteCourses: z
        .array(createPreRequisiteCoursesValidationSchema)
        .optional(),
    }),
  }),
});

// Validation schema for update a existing course
const updatePreRequisiteCoursesValidationSchema = z.object({
  course: z.string(),
  isDeleted: z.boolean().optional(),
});

const updateCourseValidationSchema = z.object({
  body: z.object({
    course: z.object({
      title: z.string().optional(),
      prefix: z.string().optional(),
      code: z.number().optional(),
      credits: z.number().optional(),
      preRequisiteCourses: z
        .array(updatePreRequisiteCoursesValidationSchema)
        .optional(),
    }),
  }),
});

// Validation course faculty
const courseFacultyValidationSchema = z.object({
  body: z.object({
    faculties: z.array(z.string()),
  }),
});

export const CourseValidations = {
  createCourseValidationSchema,
  updateCourseValidationSchema,
  courseFacultyValidationSchema,
};
