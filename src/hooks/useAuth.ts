import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { getCurrentUser } from '../api/user';

export function useAuthInit() {
  const { token, setAuth, logout } = useAuthStore();

  useEffect(() => {
    if (token) {
      getCurrentUser()
        .then((user) => setAuth(token, user))
        .catch(() => logout());
    }
  }, [token, setAuth, logout]);
}