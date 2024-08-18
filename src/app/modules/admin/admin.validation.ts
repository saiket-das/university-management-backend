import { z } from 'zod';

// Validation schema for create a new faculty
const createUsernameValidationSchema = z.object({
  firstName: z
    .string({
      required_error: 'Firstname is required',
    })
    .trim()
    .max(20, { message: 'Firstname can not be more than 20 characters' }),
  lastName: z
    .string({ required_error: 'Lastname is required' })
    .max(20, { message: 'Lastname can not be more than 20 characters' }),
});

const createAdminValidationSchema = z.object({
  body: z.object({
    admin: z.object({
      name: createUsernameValidationSchema,
      email: z
        .string({ required_error: 'Email is required' })
        .email({ message: 'Email must be a valid email' }),
      gender: z.enum(['male', 'female', 'others']),
      dateOfBirth: z.string(),
      contactNumber: z.string().regex(/^[+0-9]+$/),
      emergencyContactNumber: z.string().regex(/^[+0-9]+$/),
      presentAddress: z.string(),
      permanentAddress: z.string(),
      bloodGroup: z.enum(['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-']),
      managementDepartment: z.string(),
      isDeleted: z.boolean().optional(),
    }),
  }),
});

// Validation schema for update a existing faculty
const updateUsernameValidationSchema = z.object({
  firstName: z
    .string({
      required_error: 'Firstname is required',
    })
    .trim()
    .max(20, { message: 'Firstname can not be more than 20 characters' })
    .optional(),
  lastName: z
    .string({ required_error: 'Lastname is required' })
    .max(20, { message: 'Lastname can not be more than 20 characters' })
    .optional(),
});

const updateAdminValidationSchema = z.object({
  body: z.object({
    password: z.string().optional(),
    admin: z.object({
      name: updateUsernameValidationSchema.optional(),
      email: z
        .string({ required_error: 'Email is required' })
        .email({ message: 'Email must be a valid email' })
        .optional(),
      gender: z.enum(['male', 'female', 'others']).optional(),
      dateOfBirth: z.string().optional(),
      contactNumber: z
        .string()
        .regex(/^[+0-9]+$/)
        .optional(),
      emergencyContactNumber: z
        .string()
        .regex(/^[+0-9]+$/)
        .optional(),
      presentAddress: z.string().optional(),
      permanentAddress: z.string().optional(),
      bloodGroup: z
        .enum(['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-'])
        .optional(),
      managementDepartment: z.string().optional(),
      isDeleted: z.boolean().optional(),
    }),
  }),
});

export const AdminValidations = {
  createAdminValidationSchema,
  updateAdminValidationSchema,
};
