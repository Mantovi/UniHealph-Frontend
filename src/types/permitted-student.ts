export interface PermittedStudent {
  name: string;
  email: string;
  cpf: string;
}

export interface PermittedStudentResponse {
  id: number;
  name: string;
  email: string;
  cpf: string;
  universityId: number;
}
