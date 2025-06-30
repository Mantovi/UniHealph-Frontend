import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSpecialtyTree } from '@/api/specialtyTree';
import type { SpecialtyTree } from '@/types/specialtyTree';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeftCircle } from 'lucide-react';

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
  selectedSubSpecialty?.categories.find(
    (cat) => cat.id === selectedCategoryId
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col justify-center py-10">
      <div className="max-w-5xl mx-auto w-full bg-white rounded-3xl shadow-2xl border border-blue-100 px-4 py-8 space-y-8">

        <h1 className="text-3xl font-bold text-blue-900 text-center mb-4">Categorias de Produtos</h1>

        {!selectedSpecialty && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-blue-900">Especialidades</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {specialties.map((spec) => (
                <Card
                  key={spec.id}
                  className="p-5 text-center cursor-pointer border-2 border-blue-100 hover:border-blue-400 font-semibold text-blue-800 bg-blue-50 rounded-xl shadow-sm transition"
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
          </>
        )}

        {selectedSpecialty && !selectedSubSpecialtyId && (
          <>
            <div className="flex items-center gap-2 mb-3">
              <Button
                variant="ghost"
                className="flex items-center gap-1 text-blue-700 hover:text-blue-900"
                onClick={() => setSelectedSpecialtyId(null)}
              >
                <ArrowLeftCircle size={22} /> Voltar
              </Button>
              <h2 className="text-xl font-semibold text-blue-900">Subespecialidades de <span className="font-bold">{selectedSpecialty.name}</span></h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {selectedSpecialty.subSpecialties.map((sub) => (
                <Card
                  key={sub.id}
                  className="p-5 cursor-pointer border-2 border-blue-100 hover:border-blue-400 font-semibold text-blue-800 bg-blue-50 rounded-xl shadow-sm transition"
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

        {selectedSpecialty && selectedSubSpecialtyId && !selectedCategoryId && (
          <>
            <div className="flex items-center gap-2 mb-3">
              <Button
                variant="ghost"
                className="flex items-center gap-1 text-blue-700 hover:text-blue-900"
                onClick={() => setSelectedSubSpecialtyId(null)}
              >
                <ArrowLeftCircle size={22} /> Voltar
              </Button>
              <h2 className="text-xl font-semibold text-blue-900">
                Categorias de <span className="font-bold">{selectedSpecialty.subSpecialties.find(sub => sub.id === selectedSubSpecialtyId)?.name}</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {selectedSpecialty.subSpecialties
                .find((sub) => sub.id === selectedSubSpecialtyId)
                ?.categories.map((cat) => (
                  <Card
                    key={cat.id}
                    className="p-5 cursor-pointer border-2 border-blue-100 hover:border-blue-400 font-semibold text-blue-800 bg-blue-50 rounded-xl shadow-sm transition"
                    onClick={() => setSelectedCategoryId(cat.id)}
                  >
                    {cat.name}
                  </Card>
                ))}
            </div>
          </>
        )}

        {selectedSpecialty && selectedSubSpecialtyId && selectedCategoryId && (
          <>
            <div className="flex items-center gap-2 mb-3">
              <Button
                variant="ghost"
                className="flex items-center gap-1 text-blue-700 hover:text-blue-900"
                onClick={() => setSelectedCategoryId(null)}
              >
                <ArrowLeftCircle size={22} /> Voltar
              </Button>
              <h2 className="text-xl font-semibold text-blue-900">
                Tipos de Produto da categoria <span className="font-bold">
                  {selectedSpecialty.subSpecialties
                    .find(sub => sub.id === selectedSubSpecialtyId)
                    ?.categories.find(cat => cat.id === selectedCategoryId)?.name}
                </span>
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {selectedSpecialty.subSpecialties
                .find((sub) => sub.id === selectedSubSpecialtyId)
                ?.categories.find(cat => cat.id === selectedCategoryId)
                ?.productTypes.map((pt) => (
                  <Card
                    key={pt.id}
                    className="p-5 cursor-pointer border-2 border-blue-100 hover:border-emerald-500 font-semibold text-blue-800 bg-blue-50 rounded-xl shadow transition"
                    onClick={() => navigate(`/products?productTypeIds=${pt.id}`)}
                  >
                    {pt.name}
                  </Card>
                ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default CategoriesList;