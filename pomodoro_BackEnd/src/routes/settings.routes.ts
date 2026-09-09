import { Router } from 'express';
import { prisma } from '../lib/prisma';
import type { AuthRequest } from '../middlewares/auth.middleware';

export const settingsRouter = Router();

settingsRouter.get('/', async (req: AuthRequest, res) => {
  const userId = req.userId!;

  let settings = await prisma.settings.findUnique({
    where: { userId },
  });

  if (!settings) {
    settings = await prisma.settings.create({
      data: {
        workTime: 25,
        shortBreakTime: 5,
        longBreakTime: 15,
        userId,
      },
    });
  }

  return res.json(settings);
});

settingsRouter.put('/', async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const { workTime, shortBreakTime, longBreakTime } = req.body as {
    workTime: number;
    shortBreakTime: number;
    longBreakTime: number;
  };

  if (
    !Number.isInteger(workTime) ||
    !Number.isInteger(shortBreakTime) ||
    !Number.isInteger(longBreakTime)
  ) {
    return res.status(400).json({ message: 'Valores inválidos' });
  }

  const settings = await prisma.settings.upsert({
    where: { userId },
    update: { workTime, shortBreakTime, longBreakTime },
    create: { workTime, shortBreakTime, longBreakTime, userId },
  });

  return res.json(settings);
});