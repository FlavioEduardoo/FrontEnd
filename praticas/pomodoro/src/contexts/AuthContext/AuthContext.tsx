import { createContext } from 'react';

export type User = {
  id: string;
  name: string;
  email: string;
};

export type AuthContextValue = {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);