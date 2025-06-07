import { useEffect, useState } from 'react';
import { getAllSpecialties } from '@/api/specialtyApi';
import { Specialty, SubSpecialtyBasic } from '@/types/specialty';
import SpecialtyList from '@/components/SpecialtyList';
import SubSpecialtyList from '@/components/SubSpecialtyList';

const Categories = () => {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);

  useEffect(() => {
    (async () => {
      const data = await getAllSpecialties();
      setSpecialties(data);
    })();
  }, []);

  const handleSpecialtyClick = (spec: Specialty) => {
    setSelectedSpecialty(spec);
  };

  const handleSubBack = () => {
    setSelectedSpecialty(null);
  };

  const handleSubSelect = (sub: SubSpecialtyBasic) => {
    console.log('Subespecialidade selecionada:', sub.name);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Categorias de Produtos</h2>

      {!selectedSpecialty && (
        <SpecialtyList specialties={specialties} onSelect={handleSpecialtyClick} />
      )}

      {selectedSpecialty && (
        <SubSpecialtyList
          subs={selectedSpecialty.subSpecialties}
          onSelect={handleSubSelect}
          onBack={handleSubBack}
        />
      )}
    </div>
  );
};

export default Categories;
