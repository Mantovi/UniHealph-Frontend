import api from './axios';
import type { PermittedStudent, PermittedStudentResponse } from '@/types/permitted-student';
import type { ApiResponse } from '@/types/api';

export async function createPermittedStudent(
  data: PermittedStudent,
  universityId: number
): Promise<PermittedStudentResponse> {
  const res = await api.post<ApiResponse<PermittedStudentResponse>>(
    `/api/permitted-students/university/${universityId}`,
    data
  );

  if (!res.data.success || !res.data.data) {
    throw new Error('Erro ao cadastrar estudante');
  }

  return res.data.data;
}

export async function getAllPermittedStudents(universityId: number) {
  const res = await api.get<ApiResponse<PermittedStudentResponse[]>>(
    `/api/permitted-students/university/${universityId}`
  );
  return res.data.data;
}