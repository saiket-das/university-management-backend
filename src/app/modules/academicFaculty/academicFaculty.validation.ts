import { z } from 'zod';

const academicFacultyValidationSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Name type is string',
      required_error: 'Academic faculty  name is required',
    }),
  }),
});

export const AcademicFacultyValidations = {
  academicFacultyValidationSchema,
};
