import { ZodError, ZodIssue } from 'zod';
import {
  ErrorSourcesProps,
  GenericErrorResponseProps,
} from '../interfaces/error.interface';

const handleZodError = (err: ZodError): GenericErrorResponseProps => {
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
