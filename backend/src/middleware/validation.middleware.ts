import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate = (schema: AnyZodObject) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('Validating request:', req.body);
  try {
    await schema.parseAsync(req.body);
    return next();
  } catch (error) {
    console.error('Validation error:', error);
    if (error instanceof ZodError) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        errors: error.errors,
      });
    }
    return next(error);
  }
}; 