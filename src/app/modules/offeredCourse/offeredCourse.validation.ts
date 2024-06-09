import { z } from 'zod';
import { Days } from './offeredCourse.constant';

// Validate time format (hour:mintue --> 10:30)
const timeStringSchema = z.string().refine(
  (time) => {
    const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/; // 00-09 10-19 20-23
    return regex.test(time);
  },
  {
    message: 'Invalid time format. Expected "HH:MM" in 24 hours format',
  },
);

// Validation schema to create a new offered course
const createOfferedCourseValidationSchema = z.object({
  body: z.object({
    semesterRegistration: z.string(),
    academicFaculty: z.string(),
    academicDepartment: z.string(),
    course: z.string(),
    faculty: z.string(),
    section: z.string(),
    maxCapacity: z.number(),
    days: z.array(z.enum([...(Days as [string, ...string[]])])),
    startTime: timeStringSchema,
    endTime: timeStringSchema,
  }),
});

// Validation schema to update an exisiting offered course
const updateOfferedCourseValidationSchema = z.object({
  body: z.object({
    semesterRegistration: z.string(),
    academicFaculty: z.string(),
    academicDepartment: z.string(),
    course: z.string(),
    faculty: z.string().optional(),
    section: z.string(),
    maxCapacity: z.number().optional(),
    days: z.enum([...(Days as [string, ...string[]])]).optional(),
    startTime: z.string().datetime().optional(),
    endTime: z.string().datetime().optional(),
  }),
});

export const OfferedCourseValidations = {
  createOfferedCourseValidationSchema,
  updateOfferedCourseValidationSchema,
};
