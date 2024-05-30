import { z } from 'zod';

const academicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Name type is string',
      required_error: 'Academic department name is required',
    }),
    academicFaculty: z.string(),
  }),
});

export const AcademicDepartmentValidations = {
  academicDepartmentValidationSchema,
};
