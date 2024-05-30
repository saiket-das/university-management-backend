import { z } from 'zod';

const usernameValidationSchema = z.object({
  firstName: z
    .string({
      required_error: 'Name is required',
    })
    .trim()
    .max(20, { message: 'Can not be more than 20 characters' })
    .regex(/^[A-Za-z/s]+$/, {
      message: 'Firstname can only contain alphabetic characters',
    }),
  lastName: z.string().max(20, { message: 'Firstname is required' }),
});

const guardianValidationSchema = z.object({
  fatherName: z
    .string({
      required_error: 'Father name is required',
    })
    .trim()
    .max(20, { message: 'Can not be more than 20 characters' })
    .regex(/^[A-Za-z\s]+$/, {
      message: 'Name can only contain alphabetic characters',
    }),
  fatherOccupation: z.string({
    required_error: 'Father occupation is required',
  }),
  fatherContactNo: z.string({
    required_error: 'Father contact number is required',
  }),

  motherName: z
    .string({
      required_error: 'Father name is required',
    })
    .trim()
    .max(20, { message: 'Can not be more than 20 characters' })
    .regex(/^[A-Za-z\s]+$/, {
      message: 'Name can only contain alphabetic characters',
    }),
  motherOccupation: z.string({
    required_error: 'Father occupation is required',
  }),
  motherContactNo: z.string({
    required_error: 'Father contact number is required',
  }),
});

const localGuardianValidationSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
    })
    .trim()
    .max(20, { message: 'Can not be more than 20 characters' })
    .regex(/^[A-Za-z\s]+$/, {
      message: 'Name can only contain alphabetic characters',
    }),
  occupation: z.string({
    required_error: 'Occupation is required',
  }),
  contactNo: z.string({
    required_error: 'Contact number is required',
  }),
  address: z.string({
    required_error: 'Address is required',
  }),
});

export const createStudentValidationSchema = z.object({
  body: z.object({
    student: z.object({
      name: usernameValidationSchema,
      email: z
        .string({ message: 'Email is required' })
        .email({ message: 'Email must be a valid email' }),
      gender: z.enum(['male', 'female', 'others']),
      dateOfBirth: z.string().optional(),
      contactNumber: z.string().regex(/^[+0-9]+$/),
      emergencyContactNumber: z.string().regex(/^[+0-9]+$/),
      presentAddress: z.string(),
      permanentAddress: z.string(),
      guardian: guardianValidationSchema,
      localGuardian: localGuardianValidationSchema,
      bloodGroup: z.enum(['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-']),
      admissionSemester: z.string(),
      profileImage: z
        .string()
        .url({ message: 'Profile image must be a valid URL' }),
      isDeleted: z.boolean().optional(),
    }),
  }),
});

export const studentValidations = { createStudentValidationSchema };
