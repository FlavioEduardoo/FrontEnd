import { Router } from 'express';
import { prisma } from '../lib/prisma';

export const tasksRouter = Router();

const serializeTask = (task: any) => ({
  ...task,
  startDate: task.startDate?.toString(),
  completeDate: task.completeDate?.toString(),
  interruptDate: task.interruptDate?.toString(),
});

tasksRouter.get('/', async (_req, res) => {
  const tasks = await prisma.task.findMany({
    orderBy: { startDate: 'desc' },
  });

  return res.json(tasks.map(serializeTask));
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

  return res.status(201).json(serializeTask(task));
});

tasksRouter.patch('/:id/complete', async (req, res) => {
  const { id } = req.params;
  const { completeDate } = req.body as { completeDate: number };

  const task = await prisma.task.update({
    where: { id },
    data: { completeDate: BigInt(completeDate) },
  });

  return res.json(serializeTask(task));
});

tasksRouter.delete('/', async (_req, res) => {
  await prisma.task.deleteMany();
  return res.status(204).send();
});