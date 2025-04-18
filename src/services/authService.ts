import { LoginForm, RegisterForm, JwtPayload } from '@/types/auth';

export const authService = {
  async login(data: LoginForm): Promise<JwtPayload> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!res.ok) throw new Error('Login inválido');

    const { token } = await res.json();

    const decoded = parseJwt(token);
    localStorage.setItem('token', token);
    return decoded;
  },

  async register(data: RegisterForm): Promise<void> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!res.ok) throw new Error('Falha ao registrar');
  },

  logout() {
    localStorage.removeItem('token');
  }
};

const parseJwt = (token: string): JwtPayload => {
  const payload = token.split('.')[1];
  return JSON.parse(atob(payload));
};
