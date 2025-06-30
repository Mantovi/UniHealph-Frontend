import { createPermittedStudent, getAllPermittedStudents } from "@/api/permittedStudents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRoleGuard } from "@/hooks/useRoleGuard";
import { useAuthStore } from "@/store/authStore";
import type { ApiResponse } from "@/types/api";
import type { PermittedStudent, PermittedStudentResponse } from "@/types/permitted-student";
import type { Role } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

function maskCpf(value: string): string {
  value = value.replace(/\D/g, "");
  if (value.length > 9)
    return value.replace(/^(\d{3})(\d{3})(\d{3})(\d{1,2}).*/, "$1.$2.$3-$4");
  else if (value.length > 6)
    return value.replace(/^(\d{3})(\d{3})(\d{1,3}).*/, "$1.$2.$3");
  else if (value.length > 3)
    return value.replace(/^(\d{3})(\d{1,3}).*/, "$1.$2");
  return value;
}

const schema = z.object({
  name: z.string().min(3, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF deve estar no formato 000.000.000-00'),
});

type FormData = z.infer<typeof schema>;

const PermittedStudents = () => {
  const REQUIRED_ROLE: Role = 'UNIVERSITY';
  useRoleGuard(REQUIRED_ROLE);

  const { user } = useAuthStore();
  const universityId = user?.universityId;
  const [students, setStudents] = useState<PermittedStudentResponse[]>([]);
  const [cpfValue, setCpfValue] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!universityId) return;

    getAllPermittedStudents(universityId)
      .then((data) => {
        if (data) setStudents(data);
      })
      .catch((error: AxiosError<ApiResponse<null>>) => {
        const message = error.response?.data?.message || 'Erro ao obter estudantes permitidos';
        toast.error(message);
      });
  }, [universityId]);

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskCpf(e.target.value);
    setValue('cpf', masked, { shouldValidate: true });
    setCpfValue(masked);
  };

  const onSubmit = async (data: PermittedStudent) => {
    if (!universityId) return;

    try {
      const newStudent = await createPermittedStudent(data, universityId);
      setStudents((prev) => [...prev, newStudent]);
      reset();
      setCpfValue('');
      toast.success('Estudante permitido com sucesso');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<null>>;
      const message = axiosError.response?.data?.message || 'Erro ao permitir estudante';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col justify-center py-10">
      <div className="max-w-3xl mx-auto w-full bg-white rounded-3xl shadow-2xl border border-blue-100 p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-900 text-center mb-7">
          Gerenciar Alunos Permitidos
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4 md:grid-cols-3 bg-blue-50 rounded-2xl p-4 mb-7"
        >
          <div>
            <Label htmlFor="name" className="text-blue-900 font-medium">
              Nome
            </Label>
            <Input id="name" {...register('name')} className="mt-1" />
            {errors.name && (
              <p className="text-orange-600 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="text-blue-900 font-medium">
              Email institucional
            </Label>
            <Input id="email" {...register('email')} className="mt-1" />
            {errors.email && (
              <p className="text-orange-600 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="cpf" className="text-blue-900 font-medium">
              CPF
            </Label>
            <Input
              id="cpf"
              placeholder="000.000.000-00"
              {...register('cpf')}
              className="mt-1"
              maxLength={14}
              value={cpfValue}
              onChange={handleCpfChange}
            />
            {errors.cpf && (
              <p className="text-orange-600 text-xs mt-1">{errors.cpf.message}</p>
            )}
          </div>

          <div className="md:col-span-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg font-bold mt-3 py-2"
            >
              {isSubmitting ? 'Cadastrando...' : 'Cadastrar aluno'}
            </Button>
          </div>
        </form>

        <div>
          <h2 className="text-xl font-semibold text-blue-800 mb-2">Alunos permitidos</h2>
          <ul className="divide-y rounded-xl border border-blue-100 bg-white shadow">
            {students.length === 0 ? (
              <li className="p-4 text-center text-gray-500">
                Nenhum aluno cadastrado ainda.
              </li>
            ) : (
              students.map((student) => (
                <li key={student.id} className="p-4">
                  <p className="font-semibold text-blue-900">{student.name}</p>
                  <p className="text-sm text-gray-600">{student.email}</p>
                  <p className="text-sm text-blue-700">{student.cpf}</p>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PermittedStudents;