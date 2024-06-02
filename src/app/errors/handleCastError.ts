import { Error } from 'mongoose';
import {
  ErrorSourcesProps,
  GenericErrorResponseProps,
} from '../interfaces/error.interface';
import httpStatus from 'http-status';

const handleCastError = (error: Error.CastError): GenericErrorResponseProps => {
  const statusCode = httpStatus.BAD_REQUEST;
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
