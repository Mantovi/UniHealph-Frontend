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

  const loadSuperiors = async (mode: LinkMode) => {
    if (mode === 'specialty-sub') setSuperiors(await getSpecialties());
    if (mode === 'sub-category') setSuperiors(await getSubSpecialties());
    if (mode === 'category-type') setSuperiors(await getCategories());
    if (mode === 'type-product') setSuperiors(await getProductTypes());
  };

  const loadInferiors = async (mode: LinkMode) => {
    if (mode === 'specialty-sub') setInferiors(await getSubSpecialties());
    if (mode === 'sub-category') setInferiors(await getCategories());
    if (mode === 'category-type') setInferiors(await getProductTypes());
    if (mode === 'type-product') setInferiors(await getAllProducts());
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
  if (!mode || !selectedSuperiorId) return;
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
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Vincular Hierarquia de Categorias</h1>
      {!mode && (
        <div className="space-y-4">
          {LINK_MODES.map((opt) => (
            <Button key={opt.key} className="w-full" variant="secondary" onClick={() => handleModeSelect(opt.key)}>
              {opt.label}
            </Button>
          ))}
        </div>
      )}
      {mode && step === 1 && (
        <div>
          <p className="mb-2 font-semibold">
            Selecione a {LINK_MODES.find((m) => m.key === mode)?.superior}:
          </p>
          <div className="space-y-2">
            {superiors.map((sup) => (
              <Button
                key={sup.id}
                className={`w-full justify-start ${selectedSuperiorId === sup.id ? 'bg-blue-100 font-bold' : ''}`}
                variant="outline"
                onClick={() => handleSelectSuperior(sup.id)}
              >
                {sup.name}
              </Button>
            ))}
          </div>
          <Button className="mt-6" variant="ghost" onClick={() => setMode(null)}>Voltar</Button>
        </div>
      )}
      {mode && step === 2 && (
        <div>
          <p className="mb-2 font-semibold">
            Selecione {LINK_MODES.find((m) => m.key === mode)?.inferior}(es) para vincular:
          </p>
          <div className="space-y-2">
            {inferiors.map((inf) => (
              <label key={inf.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedInferiorIds.includes(inf.id)}
                  onChange={() => toggleInferior(inf.id)}
                />
                {inf.name}
              </label>
            ))}
          </div>
          <div className="flex gap-2 mt-6">
            <Button variant="default" onClick={handleLink} disabled={selectedInferiorIds.length === 0}>Vincular</Button>
            <Button variant="ghost" onClick={() => { setStep(1); setSelectedInferiorIds([]); }}>Voltar</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryHierarchy;