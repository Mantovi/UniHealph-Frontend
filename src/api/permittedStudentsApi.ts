import api from './axios';
import { PermittedStudents, PermittedStudentsResponse } from '../types/university';

export const registerStudent = async (universityId: number, studentData: PermittedStudents) => {
  const token = localStorage.getItem('token');

  try {
    const response = await api.post(`/api/permitted-students/university/${universityId}`, studentData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Erro ao cadastrar aluno');
    console.error(error);
  }
};

export const getStudentsByUniversity = async (universityId: number): Promise<PermittedStudentsResponse[]> => {
  const token = localStorage.getItem('token');

  try {
    const response = await api.get(`/api/permitted-students/university/${universityId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Erro ao obter lista de alunos');
    console.error(error);
  }
};
