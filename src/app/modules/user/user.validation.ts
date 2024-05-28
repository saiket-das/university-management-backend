import { z } from 'zod';

export const userValidationSchema = z.object({
  password: z
    .string({ invalid_type_error: 'Password must be a string' })
    .max(20, { message: 'Password can not be more than 20 charcaters' })
    .optional(),
});

export const userValidations = { userValidationSchema };
