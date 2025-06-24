import { useEffect, useState } from 'react';
import { getSpecialties, updateSpecialty } from '@/api/specialty';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { SpecialtyRequest } from '@/types/specialty';
import SpecialtyModal from '@/components/SpecialtyModal';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { Role } from '@/types/user';

const SpecialtiesUpdate = () => {
  const REQUIRED_ROLE: Role = 'ADMIN';
  useRoleGuard(REQUIRED_ROLE);

  const { id } = useParams();
  const specialtyId = Number(id);
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState<SpecialtyRequest | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const all = await getSpecialties();
        const found = all.find((s) => s.id === specialtyId);
        if (!found) {
          toast.error('Especialidade não encontrada');
          return navigate('/admin/specialties');
        }
        setInitialData({
          name: found.name,
          active: found.active,
          subSpecialties: found.subSpecialties,
        });
      } catch {
        toast.error('Erro ao carregar especialidade');
      }
    };
    load();
  }, [specialtyId, navigate]);

  const handleUpdate = async (data: SpecialtyRequest) => {
    try {
      setLoading(true);
      await updateSpecialty(specialtyId, data);
      toast.success('Especialidade atualizada');
      navigate('/admin/specialties');
    } catch {
      toast.error('Erro ao atualizar especialidade');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SpecialtyModal
      open
      onClose={() => navigate('/admin/specialties')}
      onSubmit={handleUpdate}
      initialData={initialData}
      loading={loading}
    />
  );
};

export default SpecialtiesUpdate;