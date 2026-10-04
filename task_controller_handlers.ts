import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/tasks?status=...
export const getTasks = async (req: Request, res: Response) => {
  const { status } = req.query;
  const filter = status && status !== 'ALL' ? { status: String(status) as any } : {};

  const tasks = await prisma.task.findMany({
    where: filter,
    orderBy: { dueDate: 'asc' }
  });

  return res.json(tasks);
};

// POST /api/tasks
export const createTask = async (req: Request, res: Response) => {
  const newTask = await prisma.task.create({
    data: {
      title: req.body.title,
      description: req.body.description || '',
      status: req.body.status,
      dueDate: new Date(req.body.dueDate)
    }
  });
  return res.status(201).json(newTask);
};

// PUT /api/tasks/:id
export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = await prisma.task.update({
    where: { id },
    data: {
      ...req.body,
      dueDate: req.body.dueDate ? new Date(req.body.dueDate) : undefined
    }
  });
  return res.json(updated);
};

// DELETE /api/tasks/:id
export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.task.delete({ where: { id } });
  return res.json({ message: 'Task deleted successfully' });
};