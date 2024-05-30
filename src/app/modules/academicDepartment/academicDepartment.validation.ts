import { z } from 'zod';

const createAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Academic department name must be string',
      required_error: 'Academic department name is required',
    }),
    academicFaculty: z.string(),
  }),
});

const updateAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: 'Academic department name must be string',
        required_error: 'Academic department name is required',
      })
      .optional(),
    academicFaculty: z.string().optional(),
  }),
});

export const AcademicDepartmentValidations = {
  createAcademicDepartmentValidationSchema,
  updateAcademicDepartmentValidationSchema,
};
