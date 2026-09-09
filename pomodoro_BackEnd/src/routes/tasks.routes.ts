import { Router } from 'express';
import { prisma } from '../lib/prisma';
import type { AuthRequest } from '../middlewares/auth.middleware';

export const tasksRouter = Router();

const serializeTask = (task: any) => ({
  ...task,
  startDate: task.startDate?.toString(),
  completeDate: task.completeDate?.toString(),
  interruptDate: task.interruptDate?.toString(),
});

tasksRouter.get('/', async (req: AuthRequest, res) => {
  const userId = req.userId!;

  const tasks = await prisma.task.findMany({
    where: { userId },
    orderBy: { startDate: 'desc' },
  });

  return res.json(tasks.map(serializeTask));
});

tasksRouter.post('/', async (req: AuthRequest, res) => {
  const userId = req.userId!;
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
      userId,
    },
  });

  return res.status(201).json(serializeTask(task));
});

tasksRouter.patch('/:id/complete', async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const { id } = req.params;
  const { completeDate } = req.body as { completeDate: number };

  const task = await prisma.task.update({
    where: { id, userId },
    data: { completeDate: BigInt(completeDate) },
  });

  return res.json(serializeTask(task));
});

tasksRouter.delete('/', async (req: AuthRequest, res) => {
  const userId = req.userId!;

  await prisma.task.deleteMany({ where: { userId } });
  return res.status(204).send();
});