import { toast } from 'react-toastify';
import type { ApiResponse } from '@/types/api';

const lastShownToasts = new Map<string, number>();

export function showApiMessage<T>(
  response: ApiResponse<T>,
  options?: {
    successMessage?: string;
    errorMessage?: string;
    toastId?: string;
    cooldownMs?: number;
  }
) {
  const id = options?.toastId || 'default-toast-id';
  const now = Date.now();
  const cooldown = options?.cooldownMs || 3000;

  const lastShown = lastShownToasts.get(id);
  if (lastShown && now - lastShown < cooldown) return;

  lastShownToasts.set(id, now);

  const defaultSuccess = 'Operação realizada com sucesso!';
  const defaultError = 'Erro ao realizar operação.';

  if (response.success) {
    toast.success(options?.successMessage || response.message || defaultSuccess, { toastId: id });
  } else {
    toast.error(options?.errorMessage || response.message || defaultError, { toastId: id });
  }
}

