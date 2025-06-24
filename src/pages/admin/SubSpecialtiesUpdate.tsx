import { useEffect, useState } from 'react';
import { getSubSpecialties, updateSubSpecialty } from '@/api/subspecialty';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { SubSpecialtyRequest } from '@/types/subspecialty';
import SubSpecialtyModal from '@/components/SubSpecialtyModal';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { Role } from '@/types/user';

export default function SubSpecialtiesUpdate () {
  const REQUIRED_ROLE: Role = 'ADMIN';
  useRoleGuard(REQUIRED_ROLE);

  const { id } = useParams();
  const subId = Number(id);
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState<SubSpecialtyRequest | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const all = await getSubSpecialties();
        const found = all.find((s) => s.id === subId);
        if (!found) {
          toast.error('Subespecialidade não encontrada');
          return navigate('/admin/sub-specialties');
        }
        setInitialData({ name: found.name, active: found.active, categories: found.categories ?? [] });
      } catch {
        toast.error('Erro ao carregar subespecialidade');
      }
    };
    load();
  }, [subId, navigate]);

  const handleUpdate = async (data: SubSpecialtyRequest) => {
    try {
      setLoading(true);
      await updateSubSpecialty(subId, data);
      toast.success('Subespecialidade atualizada');
      navigate('/admin/sub-specialties');
    } catch {
      toast.error('Erro ao atualizar subespecialidade');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SubSpecialtyModal
      open
      onClose={() => navigate('/admin/sub-specialties')}
      onSubmit={handleUpdate}
      initialData={initialData}
      loading={loading}
    />
  );
};