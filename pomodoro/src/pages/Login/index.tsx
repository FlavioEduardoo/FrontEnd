import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { DefaultInput } from '../../components/DefaultInput';
import { showMessage } from '../../adapters/showMessage.ts';
import { useAuthContext } from '../../contexts/AuthContext/index.tsx';
import styles from './Login.module.css';

type PageView = 'login' | 'register' | 'forgot' | 'reset';

const API_URL = 'http://localhost:3333';

export function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuthContext();

  const [pageView, setPageView] = useState<PageView>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return showMessage.warn('Informe o e-mail');
    if (!password) return showMessage.warn('Informe a senha');

    const result = await login(email, password);
    if (result.ok) {
      showMessage.success('Bem-vindo!');
      navigate('/home');
    } else {
      showMessage.error(result.message || 'Erro ao fazer login');
    }
  }

  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return showMessage.warn('Informe o nome');
    if (!email.trim()) return showMessage.warn('Informe o e-mail');
    if (!password) return showMessage.warn('Informe a senha');

    const result = await register(name, email, password);
    if (result.ok) {
      showMessage.success('Conta criada! Faça login.');
      setPageView('login');
    } else {
      showMessage.error(result.message || 'Erro ao cadastrar');
    }
  }

  async function handleForgot(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return showMessage.warn('Informe o e-mail');

    const res = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    showMessage.info('Se o e-mail existir, você receberá as instruções');

    if (data.resetToken) {
      setResetToken(data.resetToken);
      setPageView('reset');
    }
  }

  async function handleReset(e: FormEvent) {
    e.preventDefault();
    if (!resetToken.trim()) return showMessage.warn('Informe o token');
    if (!newPassword) return showMessage.warn('Informe a nova senha');

    const res = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: resetToken, newPassword }),
    });

    const data = await res.json();
    if (res.ok) {
      showMessage.success('Senha redefinida! Faça login.');
      setPageView('login');
    } else {
      showMessage.error(data.message || 'Erro ao redefinir senha');
    }
  }

  return (
    <div className={styles.page}>
      {pageView === 'login' && (
        <form className={styles.form} onSubmit={handleLogin}>
          <h1 className={styles.title}>Entrar na conta</h1>

          <DefaultInput id="login-email" labelText="E-mail" type="email"
            value={email} onChange={e => setEmail(e.target.value)}
            className={styles.input} labelClassName={styles.label} wrapperClassName={styles.field} />

          <DefaultInput id="login-pass" labelText="Senha" type="password"
            value={password} onChange={e => setPassword(e.target.value)}
            className={styles.input} labelClassName={styles.label} wrapperClassName={styles.field} />

          <button type="submit" className={styles.btnPrimary}>Entrar</button>
          <button type="button" className={styles.btnSecondary} onClick={() => setPageView('register')}>Cadastrar</button>
          <button type="button" className={styles.btnSecondary} onClick={() => setPageView('forgot')}>Esqueci a senha</button>
        </form>
      )}

      {pageView === 'register' && (
        <form className={styles.form} onSubmit={handleRegister}>
          <h1 className={styles.title}>Criar conta</h1>

          <DefaultInput id="reg-name" labelText="Nome" type="text"
            value={name} onChange={e => setName(e.target.value)}
            className={styles.input} labelClassName={styles.label} wrapperClassName={styles.field} />

          <DefaultInput id="reg-email" labelText="E-mail" type="email"
            value={email} onChange={e => setEmail(e.target.value)}
            className={styles.input} labelClassName={styles.label} wrapperClassName={styles.field} />

          <DefaultInput id="reg-pass" labelText="Senha" type="password"
            value={password} onChange={e => setPassword(e.target.value)}
            className={styles.input} labelClassName={styles.label} wrapperClassName={styles.field} />

          <button type="submit" className={styles.btnPrimary}>Cadastrar</button>
          <button type="button" className={styles.btnSecondary} onClick={() => setPageView('login')}>Voltar ao login</button>
        </form>
      )}

      {pageView === 'forgot' && (
        <form className={styles.form} onSubmit={handleForgot}>
          <h1 className={styles.title}>Esqueci a senha</h1>

          <DefaultInput id="forgot-email" labelText="E-mail" type="email"
            value={email} onChange={e => setEmail(e.target.value)}
            className={styles.input} labelClassName={styles.label} wrapperClassName={styles.field} />

          <button type="submit" className={styles.btnPrimary}>Enviar</button>
          <button type="button" className={styles.btnSecondary} onClick={() => setPageView('login')}>Voltar ao login</button>
        </form>
      )}

      {pageView === 'reset' && (
        <form className={styles.form} onSubmit={handleReset}>
          <h1 className={styles.title}>Redefinir senha</h1>

          <DefaultInput id="reset-token" labelText="Token" type="text"
            value={resetToken} onChange={e => setResetToken(e.target.value)}
            className={styles.input} labelClassName={styles.label} wrapperClassName={styles.field} />

          <DefaultInput id="reset-pass" labelText="Nova senha" type="password"
            value={newPassword} onChange={e => setNewPassword(e.target.value)}
            className={styles.input} labelClassName={styles.label} wrapperClassName={styles.field} />

          <button type="submit" className={styles.btnPrimary}>Redefinir</button>
          <button type="button" className={styles.btnSecondary} onClick={() => setPageView('login')}>Voltar ao login</button>
        </form>
      )}
    </div>
  );
}