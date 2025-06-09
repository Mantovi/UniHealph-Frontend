import { useEffect, useState } from 'react';

import api from '@/api/axios';
import { fetchSpecialties } from '@/api/categoryHierarchyApi';

import {
  Specialty,
  SubSpecialty,
  SubSpecialtyBasic,
  Category,
  CategoryBasic,
  ProductTypeBasic,
} from '@/types/categoryHierarchy';

import SpecialtyList from '@/components/SpecialtyList';
import SubSpecialtyList from '@/components/SubSpecialtyList';
import CategoryList from '@/components/CategoryList';
import ProductTypeList from '@/components/ProductTypeList';

const Categories: React.FC = () => {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [subSpecialties, setSubSpecialties] = useState<SubSpecialtyBasic[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [selectedSubSpecialty, setSelectedSubSpecialty] = useState<SubSpecialty | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryBasic | null>(null);
  const [productTypes, setProductTypes] = useState<ProductTypeBasic[]>([]);

  useEffect(() => {
    fetchSpecialties().then(setSpecialties);
  }, []);

  const handleSpecialtySelect = (subsName: SubSpecialtyBasic[], specName: string) => {
    setSubSpecialties(subsName);
    setSelectedSpecialty(specName);
    setSelectedSubSpecialty(null);
    setSelectedCategory(null);
    setProductTypes([]);
  };

  const handleSubSpecialtySelect = async (sub: SubSpecialtyBasic) => {
    try {
      const res = await api.get<SubSpecialty[]>('/api/sub-specialties');
      const fullSub = res.data.find((s) => s.id === sub.id);

      if (fullSub) {
        setSelectedSubSpecialty(fullSub);
        setSelectedCategory(null);
        setProductTypes([]);
      } else {
        console.warn('Subespecialidade não encontrada.');
      }
    } catch (err) {
      console.error('Erro ao buscar subespecialidade:', err);
    }
  };

  const handleCategorySelect = async (categoryId: number) => {
    if (!selectedSubSpecialty) return;

    const category = selectedSubSpecialty.categories.find((c) => c.id === categoryId);
    if (category) {
      setSelectedCategory(category);
      try {
        const res = await api.get<Category[]>('/api/categories');
        const fullCategory = res.data.find((c) => c.id === category.id);
        if (fullCategory) {
          setProductTypes(fullCategory.productTypes);
        }
      } catch (error) {
        console.error('Erro ao carregar tipos de produto:', error);
      }
    }
  };

  const handleBackToSubSpecialties = () => {
    setSelectedCategory(null);
    setProductTypes([]);
  };

  const handleBackToSpecialties = () => {
    setSelectedSubSpecialty(null);
    setSelectedCategory(null);
    setProductTypes([]);
  };

  const handleBackToRoot = () => {
    setSelectedSpecialty(null);
    setSubSpecialties([]);
    setSelectedSubSpecialty(null);
    setSelectedCategory(null);
    setProductTypes([]);
  };


  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Categorias de Produtos</h1>

      {!selectedSpecialty && (
        <SpecialtyList specialties={specialties} onSelect={handleSpecialtySelect} />
      )}

      {selectedSpecialty && !selectedSubSpecialty && (
        <>
          <button
            onClick={handleBackToRoot}
            className="mb-4 px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300 transition"
          >
            ← Voltar para Especialidades
          </button>
          <SubSpecialtyList
            title={selectedSpecialty}
            subSpecialties={subSpecialties}
            onSelect={handleSubSpecialtySelect}
          />
        </>
      )}

      {selectedSubSpecialty && !selectedCategory && (
        <>
          <button
            onClick={handleBackToSpecialties}
            className="mb-4 px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300 transition"
          >
            ← Voltar para Subespecialidades
          </button>
          <CategoryList
            categories={selectedSubSpecialty.categories}
            onSelect={handleCategorySelect}
          />
        </>
      )}

      {selectedCategory && (
        <>
          <button
            onClick={handleBackToSubSpecialties}
            className="mb-4 px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300 transition"
          >
            ← Voltar para Categorias
          </button>
          <ProductTypeList productTypes={productTypes} />
        </>
      )}
    </div>
  );
};

export default Categories;
