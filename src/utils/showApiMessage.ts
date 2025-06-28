import { toast } from 'react-toastify';
import type { ApiResponse } from '@/types/api';

export function showApiMessage(response: ApiResponse<unknown>) {
  if (response.success) {
    if (response.message) toast.success(response.message);
  } else {
    toast.error(response.message || 'Erro inesperado');
  }
}
