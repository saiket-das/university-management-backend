import { NextFunction, Response } from 'express';

interface ResponseProps<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

const sendResponse = <T>(res: Response, data: ResponseProps<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
  });
};

export default sendResponse;
