import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(3, 'Title is required and must be at least 3 characters'),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).default('TODO'),
  dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Valid ISO date string required'
  })
});

export const updateTaskSchema = createTaskSchema.partial();

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Validation Error',
          details: error.flatten().fieldErrors
        });
      }
      next(error);
    }
  };
};
