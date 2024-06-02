import { Error } from 'mongoose';
import {
  ErrorSourcesProps,
  GenericErrorResponseProps,
} from '../interfaces/error.interface';

const handleCastError = (error: Error.CastError): GenericErrorResponseProps => {
  const statusCode = 400;
  const errorSources: ErrorSourcesProps = [
    {
      path: error?.path,
      message: error?.message,
    },
  ];
  return {
    statusCode,
    message: 'Invalid ID',
    errorSources,
  };
};

export default handleCastError;
