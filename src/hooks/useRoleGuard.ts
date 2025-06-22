import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import type { Role } from '@/types/user';

export function useRoleGuard(requiredRole: Role) {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null) return;

    if (!user || user.role?.toUpperCase() !== requiredRole.toUpperCase()) {
      navigate('/unauthorized');
    }
  }, [user, requiredRole, navigate]);
}
