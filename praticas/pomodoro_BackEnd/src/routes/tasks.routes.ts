import { Router } from 'express';
import { prisma } from '../lib/prisma';

export const tasksRouter = Router();

tasksRouter.get('/', async (_req, res) => {
  const tasks = await prisma.task.findMany({
    orderBy: {
      startDate: 'desc',
    },
  });

  return res.json(tasks);
});

tasksRouter.post('/', async (req, res) => {
  const { id, name, duration, type, startDate } = req.body as {
    id: string;
    name: string;
    duration: number;
    type: string;
    startDate: number;
  };

  const task = await prisma.task.create({
    data: {
      id,
      name,
      duration,
      type,
      startDate: BigInt(startDate),
    },
  });

  return res.status(201).json(task);
});