import React, { useEffect, useState } from 'react';
import { registerStudent, getStudentsByUniversity } from '../api/permittedStudentsApi';
import { PermittedStudents, PermittedStudentsResponse} from '../types/university';
import { getUniversityIdFromToken } from '@/utils/getUniversityIdFromToken';

const UniversityStudents = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [students, setStudents] = useState<PermittedStudentsResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const universityId = getUniversityIdFromToken();

  
  useEffect(() => {

    if (!universityId) return

    const fetchStudents = async () => {
      setLoading(true);
      try {
        const data = await getStudentsByUniversity(universityId);
        setStudents(data);
      } catch (error) {
        setError('Erro ao carregar alunos');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [universityId]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!universityId) {
      setError('Você não tem permissão para acessar esta página.');
      return;
    }

    const studentData: PermittedStudents = {
      name,
      email,
      cpf,
    };

    setIsSubmitting(true);

    try {
      const newStudent = await registerStudent(universityId, studentData);
      setStudents((prev) => [...prev, newStudent]);
      setName('');
      setEmail('');
      setCpf('');
    } catch (error) {
      setError('Erro ao cadastrar aluno');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Cadastro de Alunos</h2>
      
      {error && <div className="text-red-500">{error}</div>}

      <form onSubmit={handleRegister}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="text"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          placeholder="CPF"
          required
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Cadastrando...' : 'Cadastrar Aluno'}
        </button>
      </form>

      <h3>Alunos Cadastrados</h3>
      {loading ? (
        <div>Carregando alunos...</div>
      ) : (
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Nome</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">CPF</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td className="border px-4 py-2">{student.name}</td>
                <td className="border px-4 py-2">{student.email}</td>
                <td className="border px-4 py-2">{student.cpf}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UniversityStudents;
