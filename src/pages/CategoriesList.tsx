import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSpecialtyTree } from '@/api/specialtyTree';
import type { SpecialtyTree } from '@/types/specialtyTree';
import { Card } from '@/components/ui/card';

const CategoriesList = () => {
  const [specialties, setSpecialties] = useState<SpecialtyTree[]>([]);
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<number | null>(null);
  const [selectedSubSpecialtyId, setSelectedSubSpecialtyId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    getSpecialtyTree()
      .then((data) => {
        const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
        setSpecialties(sorted);
      })
      .catch(() => console.error('Erro ao carregar especialidades'));
  }, []);

  const selectedSpecialty = specialties.find((s) => s.id === selectedSpecialtyId);
  const selectedSubSpecialty = selectedSpecialty?.subSpecialties.find(
    (sub) => sub.id === selectedSubSpecialtyId
  );
  const selectedCategory = selectedSubSpecialty?.categories.find(
    (cat) => cat.id === selectedCategoryId
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Especialidades</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {specialties.map((spec) => (
          <Card
            key={spec.id}
            className={`p-4 text-center cursor-pointer border ${
              selectedSpecialtyId === spec.id ? 'border-primary' : 'hover:border-gray-400'
            }`}
            onClick={() => {
              setSelectedSpecialtyId(spec.id);
              setSelectedSubSpecialtyId(null);
              setSelectedCategoryId(null);
            }}
          >
            {spec.name}
          </Card>
        ))}
      </div>

      {selectedSpecialty && (
        <>
          <h2 className="text-xl font-semibold mt-6">Subespecialidades</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {selectedSpecialty.subSpecialties.map((sub) => (
              <Card
                key={sub.id}
                className={`p-3 cursor-pointer ${
                  selectedSubSpecialtyId === sub.id ? 'border-primary' : 'hover:border-gray-400'
                }`}
                onClick={() => {
                  setSelectedSubSpecialtyId(sub.id);
                  setSelectedCategoryId(null);
                }}
              >
                {sub.name}
              </Card>
            ))}
          </div>
        </>
      )}

      {selectedSubSpecialty && (
        <>
          <h2 className="text-xl font-semibold mt-6">Categorias</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {selectedSubSpecialty.categories.map((cat) => (
              <Card
                key={cat.id}
                className={`p-3 cursor-pointer ${
                  selectedCategoryId === cat.id ? 'border-primary' : 'hover:border-gray-400'
                }`}
                onClick={() => setSelectedCategoryId(cat.id)}
              >
                {cat.name}
              </Card>
            ))}
          </div>
        </>
      )}

      {selectedCategory && (
        <>
          <h2 className="text-xl font-semibold mt-6">Tipos de Produto</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {selectedCategory.productTypes.map((pt) => (
              <Card
                key={pt.id}
                className="p-3 cursor-pointer hover:border-primary"
                onClick={() =>
                  navigate(`/products?productTypeIds=${pt.id}`)
                }
              >
                {pt.name}
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default CategoriesList;