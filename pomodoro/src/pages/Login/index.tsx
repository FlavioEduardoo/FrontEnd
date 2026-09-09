import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { DefaultInput } from '../../components/DefaultInput';
import { showMessage } from '../../adapters/showMessage.ts';
import { useAuthContext } from '../../contexts/AuthContext/index.tsx';
import styles from './Login.module.css';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!username.trim()) {
      showMessage.warn('Informe o usuário');
      return;
    }
    if (!password) {
      showMessage.warn('Informe a senha');
      return;
    }
    if (login(username, password)) {
      showMessage.success('Bem-vindo!');
      navigate('/home');
    } else {
      showMessage.error('Usuário ou senha inválidos');
    }
  }

  return (
    <div className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Entrar na conta</h1>

        <DefaultInput
          id="login-user"
          labelText="Usuário"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.input}
          labelClassName={styles.label}
          wrapperClassName={styles.field}
        />

        <DefaultInput
          id="login-pass"
          labelText="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          labelClassName={styles.label}
          wrapperClassName={styles.field}
        />

        <button type="submit" className={styles.btnPrimary}>
          Entrar
        </button>

        <button
          type="button"
          className={styles.btnSecondary}
          onClick={() => showMessage.info('Cadastro em breve')}
        >
          Cadastrar
        </button>

        <button
          type="button"
          className={styles.btnSecondary}
          onClick={() => showMessage.info('Recuperação em breve')}
        >
          Esqueci a senha
        </button>
      </form>
    </div>
  );
}
