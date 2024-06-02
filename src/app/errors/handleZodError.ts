import { ZodError, ZodIssue } from 'zod';
import { ErrorSourcesProps } from '../interfaces/error.interface';

const handleZodError = (err: ZodError) => {
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
    errorSources,
  };
};
export default handleZodError;
