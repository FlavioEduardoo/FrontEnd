import express from 'express';
import cors from 'cors';
import { settingsRouter } from './routes/settings.routes';
import { tasksRouter } from './routes/tasks.routes';
import { authRouter } from './routes/auth.routes';
import { authMiddleware } from './middlewares/auth.middleware';

export const app = express();

app.use(cors());
app.use(express.json());

// Rotas públicas
app.use('/auth', authRouter);

app.get('/health', (_req, res) => {
  return res.json({ ok: true });
});

// Rotas protegidas
app.use('/settings', authMiddleware, settingsRouter);
app.use('/tasks', authMiddleware, tasksRouter);