import { NextFunction, Request, Response } from 'express';

const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const satusCode = 500;
  const errorMessage = error.message || 'Something went wrong';
  return res.status(satusCode).json({
    success: false,
    message: errorMessage,
    error: error,
  });
};

export default globalErrorHandler;
