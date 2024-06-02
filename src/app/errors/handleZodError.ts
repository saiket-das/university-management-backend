import { ZodError, ZodIssue } from 'zod';
import { ErrorSourcesProps } from '../interfaces/error.interface';

export const handleZodError = (err: ZodError) => {
  const statusCode = 400;
  const errorSources: ErrorSourcesProps = err.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue?.message,
    };
  });

  return {
    statusCode,
    message: 'Validation error',
    errorSources: errorSources,
  };
};
