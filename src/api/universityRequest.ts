import api from './axios';
import type {
  PendingUniversityRequest,
  PendingUniversityRequestResponse,
} from '@/types/university-request';
import type { ApiResponse } from '@/types/api';

export async function requestAccess(data: PendingUniversityRequest): Promise<void> {
  await api.post<ApiResponse<null>>('/api/public/universities/request', data);
}

export async function getAllUniversityRequests(): Promise<PendingUniversityRequestResponse[]> {
  const res = await api.get<ApiResponse<PendingUniversityRequestResponse[]>>(
    '/api/admin/university-requests'
  );
  return res.data.data ?? [];
}

export async function approveRequest(id: number): Promise<string> {
  const res = await api.post<ApiResponse<string | null>>
  (`/api/admin/university-requests/${id}/approve`);
  return res.data.data ?? 'Solicitaçõa aprovada';
}

export async function rejectRequest(id: number): Promise<string> {
  const res = await api.post<ApiResponse<string | null>>
  (`/api/admin/university-requests/${id}/reject`);
  return res.data.data ?? 'Solicitação rejeitada';
}