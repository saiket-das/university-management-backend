import { z } from 'zod';

const usernameSchemaValidation = z.object({
  firstName: z
    .string({
      required_error: 'Name is required',
    })
    .trim()
    .max(20, { message: 'Can not be more than 20 characters' })
    .regex(/^[A-Za-z]+$/, {
      message: 'Firstname can only contain alphabetic characters',
    }),
  lastName: z
    .string()
    .max(20, { message: 'Firstname is required' })
    .regex(/^[A-Za-z]+$/, {
      message: 'Lastname can only contain alphabetic characters',
    }),
});

const guardianSchemaValidation = z.object({
  fatherName: z
    .string({
      required_error: 'Father name is required',
    })
    .trim()
    .max(20, { message: 'Can not be more than 20 characters' })
    .regex(/^[A-Za-z]+$/, {
      message: 'Firstname can only contain alphabetic characters',
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
    .max(20, { message: 'Firstname is required' })
    .regex(/^[A-Za-z]+$/, {
      message: 'Firstname can only contain alphabetic characters',
    }),
  motherOccupation: z.string({
    required_error: 'Father occupation is required',
  }),
  motherContactNo: z.string({
    required_error: 'Father contact number is required',
  }),
});

const localGuardianSchemaValidation = z.object({
  name: z
    .string({
      required_error: 'Name is required',
    })
    .trim()
    .max(20, { message: 'Can not be more than 20 characters' })
    .regex(/^[A-Za-z]+$/, {
      message: 'Firstname can only contain alphabetic characters',
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

const studentSchemaValidation = z.object({
  id: z.string(),
  name: usernameSchemaValidation,
  email: z
    .string({ message: 'Email is required' })
    .email({ message: 'Email must be a valid email' }),
  gender: z
    .enum(['male', 'female', 'others'], { message: '{VALUE} is not valid' })
    .refine((value) => value.length <= 20, {
      message: "Gender can't be more than 20 characters",
    }),
  dateOfBirth: z.string(),
  contactNumber: z.string().regex(/^[+0-9]+$/, {
    message: 'Contact number can only contain numeric characters and "+"',
  }),
  emergencyContactNumber: z.string().regex(/^[+0-9]+$/, {
    message:
      'Emergency ontact number can only contain numeric characters and "+"',
  }),
  presentAddress: z.string(),
  permanentAddress: z.string(),
  guardian: guardianSchemaValidation,
  localGuardian: localGuardianSchemaValidation,
  bloodGroup: z.enum(['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-'], {
    message: '{VALUE} is not valid blood group',
  }),
  isActive: z
    .enum(['active', 'inactive'], {
      message: '{VALUE} is not valid status',
    })
    .default('active'),
  profileImage: z
    .string()
    .url({ message: 'Profile image must be a valid URI' }),
  isDeleted: z.boolean().optional(),
});

export const StudentValidation = { studentSchemaValidation };
