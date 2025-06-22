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

const schema = z.object({
    name: z.string().min(3, 'Nome é obrigatório'),
    email: z.string().email('Email inválido'),
    cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF deve estar no formato 000.000.000-00'),
})

type FormData = z.infer<typeof schema>;

const PermittedStudents = () => {
        const REQUIRED_ROLE: Role = 'UNIVERSITY';
        useRoleGuard(REQUIRED_ROLE);

        const {user} = useAuthStore();
        const univesityId = user?.universityId;
        const [students, setStudents] = useState<PermittedStudentResponse[]>([]);

        const {register, handleSubmit, reset, 
            formState: {errors, isSubmitting}} = useForm<FormData>({resolver: zodResolver(schema)});

            useEffect(() => {
                if (!univesityId) return;
            
                getAllPermittedStudents(univesityId)
                .then((data) => {
                    if (data) setStudents(data);
                })
                .catch((error: AxiosError<ApiResponse<null>>) => {
                    const message = error.response?.data?.message || 'Erro ao obter estudantes permitidos';
                    toast.error(message);
                });
            }, [univesityId]);

            const onSubmit = async (data: PermittedStudent) => {
                if (!univesityId) return;

                try {
                    const newStudent = await createPermittedStudent(data, univesityId);
                    setStudents((prev) => [...prev, newStudent]);
                    reset();
                    toast.success('Estudante permitido com sucesso');
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse<null>>;
                    const message = axiosError.response?.data?.message || 'Erro ao permitir estudante';
                    toast.error(message);
                }
            };

            return (
                <div className="max-w-3xl mx-auto mt-10 space-y-6 p-4">
                <h1 className="text-2xl font-bold text-center">Gerenciar Alunos Permitidos</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-3">
                    <div>
                        <Label htmlFor="name">Nome</Label>
                        <Input id="name" {...register('name')} />
                        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="email">Email institucional</Label>
                        <Input id="email" {...register('email')} />
                        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="cpf">CPF</Label>
                        <Input id="cpf" placeholder="000.000.000-00" {...register('cpf')} />
                        {errors.cpf && <p className="text-sm text-red-500">{errors.cpf.message}</p>}
                    </div>

                    <div className="md:col-span-3">
                        <Button type="submit" disabled={isSubmitting} className="w-full">
                            {isSubmitting ? 'Cadastrando...' : 'Cadastrar aluno'}
                        </Button>
                    </div>
                </form>

                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-2">Alunos permitidos</h2>
                    <ul className="divide-y rounded border border-gray-200 bg-white">
                        {students.map((student) => (
                            <li key={student.id} className="p-4">
                                <p className="font-semibold">{student.name}</p>
                                <p className="text-sm text-gray-600">
                                    {student.email} — {student.cpf}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            );
};

export default PermittedStudents;