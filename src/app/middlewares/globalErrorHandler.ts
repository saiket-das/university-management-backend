import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import config from '../config';
import { ErrorSourcesProps } from '../interfaces/error.interface';
import { handleZodError } from '../errors/handleZodError';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // default values
  let satusCode = 500;
  let errorMessage = err.message || 'Something went wrong';
  let errorSources: ErrorSourcesProps = [
    {
      path: '',
      message: 'Something went wrong',
    },
  ];

  // handle zod error
  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    satusCode = simplifiedError?.statusCode;
    errorMessage = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  }

  return res.status(satusCode).json({
    success: false,
    message: errorMessage,
    errorSources: errorSources,
    stack: config.NODE_ENV === 'development' ? err?.stack : null,
    // error: err,
  });
};

export default globalErrorHandler;

/* 
  -- Pattern --
  success: true | false,
  message: '....'
  errorSources: {
    path: '/',
    message: '....'
  }
  stack: '/' [DEVELOPMENT]
*/
