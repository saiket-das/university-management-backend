import { ZodError, ZodIssue } from 'zod';
import {
  ErrorSourcesProps,
  GenericErrorResponseProps,
} from '../interfaces/error.interface';
import httpStatus from 'http-status';

const handleZodError = (err: ZodError): GenericErrorResponseProps => {
  const statusCode = httpStatus.BAD_REQUEST;
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
