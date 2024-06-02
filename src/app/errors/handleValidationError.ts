import { Error } from 'mongoose';
import { ErrorSourcesProps } from '../interfaces/error.interface';

const handleValidationError = (err: Error.ValidationError) => {
  const statusCode = 400;
  const errorSources: ErrorSourcesProps = Object.values(err.errors).map(
    (value: Error.ValidatorError | Error.CastError) => {
      return {
        path: value?.path,
        message: value.message,
      };
    },
  );

  return {
    statusCode,
    message: 'Validation error',
    errorSources,
  };
};

export default handleValidationError;
