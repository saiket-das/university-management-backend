import { z } from 'zod';

// Using zod
const usernameSchema = z.object({
  firstName: z
    .string({
      required_error: 'Name is required',
    })
    .trim()
    .max(20, { message: 'Firstname is required' })
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

const studentValidationSchemaZod = z.object({
  name: usernameSchema,
  password: z
    .string({ message: 'Password is required' })
    .max(20, { message: 'Password can not be more than 20 charcaters' }),
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
  bloodGroup: z.enum(['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-'], {
    message: '{VALUE} is not valid blood group',
  }),
  address: z.string(),
  isActive: z
    .enum(['active', 'inactive'], {
      message: '{VALUE} is not valid status',
    })
    .default('active'),
  avatar: z.string().url({ message: 'Avatar must be a valid URI' }),
  isDeleted: z.boolean().optional(),
});

export default studentValidationSchemaZod;
