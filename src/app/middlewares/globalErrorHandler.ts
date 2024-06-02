import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import config from '../config';
import { ErrorSourcesProps } from '../interfaces/error.interface';
import handleZodError from '../errors/handleZodError';
import handleValidationError from '../errors/handleValidationError';

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

  // handle zod validation error
  if (err instanceof ZodError) {
    const simplifiedZodError = handleZodError(err);
    satusCode = simplifiedZodError?.statusCode;
    errorMessage = simplifiedZodError?.message;
    errorSources = simplifiedZodError?.errorSources;
  }
  // handle mongoose validation error
  else if (err?.name === 'ValidationError') {
    const simplifiedMongooseError = handleValidationError(err);
    satusCode = simplifiedMongooseError?.statusCode;
    errorMessage = simplifiedMongooseError?.message;
    errorSources = simplifiedMongooseError?.errorSources;
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
  success: false,
  message: '....'
  errorSources: {
    path: '....',
    message: '....'
  }
  stack: '/' [DEVELOPMENT]
*/
