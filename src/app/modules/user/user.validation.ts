import { z } from 'zod';

const userSchemaValidation = z.object({
  id: z.string(),
  password: z
    .string()
    .max(20, { message: 'Password can not be more than 20 charcaters' }),
  needsPasswordChange: z.boolean().optional(),
  role: z.enum(['admin', 'faculty', 'student']),
  status: z.enum(['in-progress', 'blocked']),
  isDeleted: z.boolean().optional(),
});

export default userSchemaValidation;
