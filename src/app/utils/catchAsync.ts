import { NextFunction, Request, RequestHandler, Response } from 'express';

const catachAsync = (func: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(func(req, res, next)).catch((error) => next(error));
  };
};

export default catachAsync;
