import { z } from 'zod';
import { Days } from './offeredCourse.constant';

// Validation schema to create a new offered course
const createOfferedCourseValidationSchema = z.object({
  body: z.object({
    academicSemester: z.string(),
    semesterRegistration: z.string(),
    academicFaculty: z.string(),
    academicDepartment: z.string(),
    course: z.string(),
    faculty: z.string(),
    section: z.string(),
    maxCapacity: z.number(),
    days: z.enum([...(Days as [string, ...string[]])]),
    startTime: z.string().datetime(),
    endTime: z.string().datetime(),
  }),
});

// Validation schema to update an exisiting offered course
const updateOfferedCourseValidationSchema = z.object({
  body: z.object({
    academicSemester: z.string(),
    semesterRegistration: z.string(),
    academicFaculty: z.string(),
    academicDepartment: z.string(),
    course: z.string(),
    faculty: z.string(),
    section: z.string(),
    maxCapacity: z.number(),
    days: z.enum([...(Days as [string, ...string[]])]),
    startTime: z.string().datetime(),
    endTime: z.string().datetime(),
  }),
});

export const OfferedCourseValidations = {
  createOfferedCourseValidationSchema,
  updateOfferedCourseValidationSchema,
};
