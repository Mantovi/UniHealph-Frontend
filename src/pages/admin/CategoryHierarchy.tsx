import { useState } from 'react';
import { toast } from 'react-toastify';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { Role } from '@/types/user';

import { getSpecialties } from '@/api/specialty';
import { getSubSpecialties } from '@/api/subspecialty';
import { getCategories } from '@/api/category';
import { getProductTypes } from '@/api/productType';
import { getAllProducts } from '@/api/products';

import {
  linkSubSpecialtiesToSpecialty,
  linkCategoriesToSubSpecialty,
  linkProductTypesToCategory,
  linkProductsToProductType,
} from '@/api/categoryHierarchy';

import type { Specialty } from '@/types/specialty';
import type { SubSpecialty } from '@/types/subspecialty';
import type { Category } from '@/types/category';
import type { ProductType } from '@/types/productType';
import type { ProductResponse } from '@/types/product';
import { Button } from '@/components/ui/button';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types/api';
import { ArrowLeftCircle } from 'lucide-react';
import { sortByAlpha } from '@/utils/sort';

type LinkMode = 'specialty-sub' | 'sub-category' | 'category-type' | 'type-product';

const LINK_MODES: { key: LinkMode; label: string; superior: string; inferior: string }[] = [
  { key: 'specialty-sub', label: 'Especialidade → Subespecialidade', superior: 'Especialidade', inferior: 'Subespecialidade' },
  { key: 'sub-category', label: 'Subespecialidade → Categoria', superior: 'Subespecialidade', inferior: 'Categoria' },
  { key: 'category-type', label: 'Categoria → Tipo de Produto', superior: 'Categoria', inferior: 'Tipo de Produto' },
  { key: 'type-product', label: 'Tipo de Produto → Produto', superior: 'Tipo de Produto', inferior: 'Produto' },
];

const REQUIRED_ROLE: Role = 'ADMIN';

const CategoryHierarchy = () => {
  useRoleGuard(REQUIRED_ROLE);

  const [mode, setMode] = useState<LinkMode | null>(null);
  const [step, setStep] = useState(1);

  const [superiors, setSuperiors] = useState<(Specialty | SubSpecialty | Category | ProductType)[]>([]);
  const [selectedSuperiorId, setSelectedSuperiorId] = useState<number | null>(null);

  const [inferiors, setInferiors] = useState<(SubSpecialty | Category | ProductType | ProductResponse)[]>([]);
  const [selectedInferiorIds, setSelectedInferiorIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);


const loadSuperiors = async (mode: LinkMode) => {
  if (mode === 'specialty-sub') setSuperiors(sortByAlpha(await getSpecialties(), 'name'));
  if (mode === 'sub-category') setSuperiors(sortByAlpha(await getSubSpecialties(), 'name'));
  if (mode === 'category-type') setSuperiors(sortByAlpha(await getCategories(), 'name'));
  if (mode === 'type-product') setSuperiors(sortByAlpha(await getProductTypes(), 'name'));
};

const loadInferiors = async (mode: LinkMode) => {
  if (mode === 'specialty-sub') setInferiors(sortByAlpha(await getSubSpecialties(), 'name'));
  if (mode === 'sub-category') setInferiors(sortByAlpha(await getCategories(), 'name'));
  if (mode === 'category-type') setInferiors(sortByAlpha(await getProductTypes(), 'name'));
  if (mode === 'type-product') setInferiors(sortByAlpha(await getAllProducts(), 'name'));
};

  const handleModeSelect = async (newMode: LinkMode) => {
    setMode(newMode);
    setStep(1);
    setSelectedSuperiorId(null);
    setSelectedInferiorIds([]);
    setInferiors([]);
    await loadSuperiors(newMode);
  };

  const handleSelectSuperior = async (id: number) => {
    setSelectedSuperiorId(id);
    await loadInferiors(mode!);
    if (mode === 'specialty-sub') {
      const allSpecialties = await getSpecialties();
      const found = allSpecialties.find((s) => s.id === id);
      setSelectedInferiorIds(found ? found.subSpecialties.map(sub => sub.id) : []);
    } else if (mode === 'sub-category') {
      const allSubs = await getSubSpecialties();
      const found = allSubs.find((s) => s.id === id);
      setSelectedInferiorIds(found ? found.categories.map(cat => cat.id) : []);
    } else if (mode === 'category-type') {
      const allCats = await getCategories();
      const found = allCats.find((c) => c.id === id);
      setSelectedInferiorIds(found ? found.productTypes.map(pt => pt.id) : []);
    } else if (mode === 'type-product') {
      const allTypes = await getProductTypes();
      const found = allTypes.find((t) => t.id === id);
      setSelectedInferiorIds(found ? (found.products?.map(p => p.id) ?? []) : []);
    } else {
      setSelectedInferiorIds([]);
    }
    setStep(2);
  };

  const toggleInferior = (id: number) => {
    setSelectedInferiorIds((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );
  };

  const handleLink = async () => {
    if (!mode || !selectedSuperiorId) {
      toast.error('Selecione uma opção!');
      return;
    }
    if (selectedInferiorIds.length === 0) {
      toast.error('Selecione pelo menos um item para vincular!');
      return;
    }
    setLoading(true);
    try {
      switch (mode) {
        case 'specialty-sub':
          await linkSubSpecialtiesToSpecialty(selectedSuperiorId, selectedInferiorIds);
          break;
        case 'sub-category':
          await linkCategoriesToSubSpecialty(selectedSuperiorId, selectedInferiorIds);
          break;
        case 'category-type':
          await linkProductTypesToCategory(selectedSuperiorId, selectedInferiorIds);
          break;
        case 'type-product':
          await linkProductsToProductType(selectedSuperiorId, selectedInferiorIds);
          break;
      }
      toast.success('Vinculação realizada com sucesso!');
      setMode(null);
      setStep(1);
      setSuperiors([]);
      setSelectedSuperiorId(null);
      setInferiors([]);
      setSelectedInferiorIds([]);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<null>>;
      const message = axiosError.response?.data?.message || 'Erro ao realizar vinculação';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Vincular Hierarquia de Categorias</h1>
      {!mode && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {LINK_MODES.map((opt) => (
            <Button
              key={opt.key}
              className="w-full"
              variant="secondary"
              onClick={() => handleModeSelect(opt.key)}
              disabled={loading}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      )}
      {mode && (
        <div>
          <div className="flex items-center mb-4">
            <Button
              variant="ghost"
              onClick={() => {
                if (step === 1) setMode(null);
                else { setStep(1); setSelectedInferiorIds([]); }
              }}
              className="p-0 mr-2"
            >
              <ArrowLeftCircle size={28} className="text-sky-500 hover:text-sky-700 transition" />
            </Button>
            <span className="font-semibold text-lg">
              {step === 1
                ? `Selecione a ${LINK_MODES.find((m) => m.key === mode)?.superior}`
                : `Selecione ${LINK_MODES.find((m) => m.key === mode)?.inferior}(es) para vincular`
              }
            </span>
          </div>
          {step === 1 && (
            <div className="space-y-2 w-full max-w-md sm:max-w-xl md:max-w-2xl mx-auto">
              {superiors.length === 0 && (
                <p className="text-gray-500">Nenhum item encontrado.</p>
              )}
              {superiors.map((sup) => (
                <Button
                  key={sup.id}
                  className={`
                    w-full justify-start transition
                    ${selectedSuperiorId === sup.id ? 'bg-sky-400 text-white' : ''}
                    hover:bg-sky-400 hover:text-white
                    text-base py-3
                  `}
                  variant="outline"
                  onClick={() => handleSelectSuperior(sup.id)}
                  disabled={loading}
                >
                  {sup.name}
                </Button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="space-y-2 w-full max-w-md sm:max-w-xl md:max-w-2xl mx-auto max-h-[60vh] overflow-y-auto border rounded-md p-3 bg-gray-50">
                {inferiors.length === 0 && (
                  <p className="text-gray-500">Nenhum item encontrado.</p>
                )}
                {inferiors.map((inf) => (
                  <label key={inf.id} className="flex items-center gap-3 cursor-pointer py-1">
                    <input
                      type="checkbox"
                      checked={selectedInferiorIds.includes(inf.id)}
                      onChange={() => toggleInferior(inf.id)}
                      className="accent-blue-600 w-5 h-5"
                      disabled={loading}
                    />
                    <span>{inf.name}</span>
                  </label>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-2 mt-6">
                <Button variant="default" onClick={handleLink} disabled={loading || selectedInferiorIds.length === 0}>
                  {loading ? 'Salvando...' : 'Vincular'}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryHierarchy;
