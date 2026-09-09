import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../lib/prisma';

export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Cadastro
authRouter.post('/register', async (req, res) => {
  const { name, email, password } = req.body as {
    name: string;
    email: string;
    password: string;
  };

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Preencha todos os campos' });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(400).json({ message: 'E-mail já cadastrado' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  return res.status(201).json({ id: user.id, name: user.name, email: user.email });
});

// Login
authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body as { email: string; password: string };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: 'E-mail ou senha inválidos' });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ message: 'E-mail ou senha inválidos' });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

  return res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

// Esqueci minha senha
authRouter.post('/forgot-password', async (req, res) => {
  const { email } = req.body as { email: string };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.json({ message: 'Se o e-mail existir, você receberá as instruções' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hora

  await prisma.passwordResetToken.create({
    data: { token, expiresAt, userId: user.id },
  });

  // Em produção: enviar e-mail com o link
  // Em laboratório: retornamos o token diretamente
  return res.json({ message: 'Token gerado', resetToken: token });
});

// Redefinir senha
authRouter.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body as { token: string; newPassword: string };

  const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });

  if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
    return res.status(400).json({ message: 'Token inválido ou expirado' });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: resetToken.userId },
    data: { password: hashedPassword },
  });

  await prisma.passwordResetToken.update({
    where: { token },
    data: { used: true },
  });

  return res.json({ message: 'Senha redefinida com sucesso' });
});