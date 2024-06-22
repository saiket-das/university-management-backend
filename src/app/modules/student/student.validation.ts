import { z } from 'zod';

// Validation schema for create a new student
const createUsernameValidationSchema = z.object({
  firstName: z
    .string({
      required_error: 'Name is required',
    })
    .trim()
    .max(20, { message: 'Can not be more than 20 characters' }),
  lastName: z.string().max(20, { message: 'Firstname is required' }),
});

const createGuardianValidationSchema = z.object({
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

const createLocalGuardianValidationSchema = z.object({
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

const createStudentValidationSchema = z.object({
  body: z.object({
    password: z.string().optional(),
    student: z.object({
      name: createUsernameValidationSchema,
      email: z
        .string({ message: 'Email is required' })
        .email({ message: 'Email must be a valid email' }),
      gender: z.enum(['male', 'female', 'others']),
      dateOfBirth: z.string().optional(),
      contactNumber: z.string().regex(/^[+0-9]+$/),
      emergencyContactNumber: z.string().regex(/^[+0-9]+$/),
      presentAddress: z.string(),
      permanentAddress: z.string(),
      guardian: createGuardianValidationSchema,
      localGuardian: createLocalGuardianValidationSchema,
      bloodGroup: z.enum(['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-']),
      admissionSemester: z.string(),
      academicDepartment: z.string(),
      isDeleted: z.boolean().optional(),
    }),
  }),
});

// Validation schema for update a existing student
const updateUsernameValidationSchema = z.object({
  firstName: z
    .string()
    .trim()
    .max(20, { message: 'Can not be more than 20 characters' })
    .optional(),
  lastName: z.string().max(20).optional(),
});

const updateGuardianValidationSchema = z.object({
  fatherName: z.string().trim().max(20).optional(),
  fatherOccupation: z.string().optional(),
  fatherContactNo: z.string().optional(),

  motherName: z.string().trim().max(20).optional(),
  motherOccupation: z.string().optional(),
  motherContactNo: z.string().optional(),
});

const updateLocalGuardianValidationSchema = z.object({
  name: z.string().trim().max(20).optional(),
  occupation: z.string().optional(),
  contactNo: z.string().optional(),
  address: z.string().optional(),
});

const updateStudentValidationSchema = z.object({
  body: z.object({
    student: z.object({
      name: updateUsernameValidationSchema.optional(),
      email: z
        .string({ message: 'Email is required' })
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
      guardian: updateGuardianValidationSchema.optional(),
      localGuardian: updateLocalGuardianValidationSchema.optional(),
      bloodGroup: z
        .enum(['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-'])
        .optional(),
      admissionSemester: z.string().optional(),
      academicDepartment: z.string().optional(),
      profileImage: z
        .string()
        .url({ message: 'Profile image must be a valid URL' })
        .optional(),
      isDeleted: z.boolean().optional(),
    }),
  }),
});

export const StudentValidations = {
  createStudentValidationSchema,
  updateStudentValidationSchema,
};
