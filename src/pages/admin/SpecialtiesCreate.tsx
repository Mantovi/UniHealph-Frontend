import { useState } from 'react';
import { createSpecialty } from '@/api/specialty';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { SpecialtyRequest } from '@/types/specialty';
import SpecialtyModal from '@/components/SpecialtyModal';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { Role } from '@/types/user';

const SpecialtiesCreate = () => {
  const REQUIRED_ROLE: Role = 'ADMIN';
  useRoleGuard(REQUIRED_ROLE);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (data: SpecialtyRequest) => {
    try {
      setLoading(true);
      await createSpecialty(data);
      toast.success('Especialidade criada');
      navigate('/admin/specialties');
    } catch {
      toast.error('Erro ao criar especialidade');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SpecialtyModal
      open
      onClose={() => navigate('/admin/specialties')}
      onSubmit={handleCreate}
      loading={loading}
    />
  );
};

export default SpecialtiesCreate;