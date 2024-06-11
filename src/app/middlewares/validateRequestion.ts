import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';
import catachAsync from '../utils/catchAsync';

const validateRequest = (schema: AnyZodObject) => {
  return catachAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      // Validation using Zod
      await schema.parseAsync({
        body: req.body,
      });
      next();
    },
  );
};

export default validateRequest;
