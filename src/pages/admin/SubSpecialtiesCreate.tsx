import { useState } from 'react';
import { createSubSpecialty } from '@/api/subspecialty';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { SubSpecialtyRequest } from '@/types/subspecialty';
import SubSpecialtyModal from '@/components/SubSpecialtyModal';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { Role } from '@/types/user';

const SubSpecialtiesCreate = () => {
  const REQUIRED_ROLE: Role = 'ADMIN';
  useRoleGuard(REQUIRED_ROLE);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (data: SubSpecialtyRequest) => {
    try {
      setLoading(true);
      await createSubSpecialty(data);
      toast.success('Subespecialidade criada');
      navigate('/admin/sub-specialties');
    } catch {
      toast.error('Erro ao criar subespecialidade');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SubSpecialtyModal
      open
      onClose={() => navigate('/admin/sub-specialties')}
      onSubmit={handleCreate}
      loading={loading}
    />
  );
};

export default SubSpecialtiesCreate;