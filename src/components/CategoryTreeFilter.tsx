'use client';

import { useEffect, useState } from 'react';
import { getSpecialtyTree } from '@/api/specialtyTree';
import type { SpecialtyTree, ProductTypeNode } from '@/types/specialtyTree';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface Props {
  selectedProductTypes: number[];
  onToggleProductType: (id: number) => void;
}

const CategoryTreeFilter = ({ selectedProductTypes, onToggleProductType }: Props) => {
  const [tree, setTree] = useState<SpecialtyTree[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const makeKey = (type: 'spec' | 'sub' | 'cat', id: number) => `${type}-${id}`;
  const toggleExpand = (key: string) => {
    setExpanded((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]);
  };
  const isExpanded = (key: string) => expanded.includes(key);

  useEffect(() => {
    getSpecialtyTree()
      .then(setTree)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-muted-foreground">Carregando categorias...</p>;

  return (
    <div className="space-y-4 text-sm">
      <h3 className="font-semibold text-blue-900 text-base">Categorias</h3>

      <div className="max-h-[400px] overflow-y-auto pr-2 custom-scroll">
        {tree.map((spec) => {
          const specKey = makeKey('spec', spec.id);
          return (
            <div key={spec.id}>
              <button
                onClick={() => toggleExpand(specKey)}
                className="flex items-center gap-2 font-medium w-full text-left hover:text-blue-600 transition"
                aria-expanded={isExpanded(specKey)}
              >
                {isExpanded(specKey) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                {spec.name}
              </button>

              {isExpanded(specKey) && spec.subSpecialties.map((sub) => {
                const subKey = makeKey('sub', sub.id);
                return (
                  <div key={sub.id} className="pl-4 border-l border-gray-200 ml-1 space-y-1">
                    <button
                      onClick={() => toggleExpand(subKey)}
                      className="flex items-center gap-2 w-full text-left hover:text-blue-500 transition"
                      aria-expanded={isExpanded(subKey)}
                    >
                      {isExpanded(subKey) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      {sub.name}
                    </button>

                    {isExpanded(subKey) && sub.categories.map((cat) => {
                      const catKey = makeKey('cat', cat.id);
                      return (
                        <div key={cat.id} className="pl-4 border-l border-gray-100 ml-1 space-y-1">
                          <button
                            onClick={() => toggleExpand(catKey)}
                            className="flex items-center gap-2 w-full text-left hover:text-blue-400 transition"
                            aria-expanded={isExpanded(catKey)}
                          >
                            {isExpanded(catKey) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            {cat.name}
                          </button>

                          {isExpanded(catKey) && cat.productTypes.map((pt: ProductTypeNode) => (
                            <div key={pt.id} className="pl-4 flex items-center gap-2">
                              <Checkbox
                                id={`pt-${pt.id}`}
                                checked={selectedProductTypes.includes(pt.id)}
                                onCheckedChange={() => onToggleProductType(pt.id)}
                              />
                              <Label htmlFor={`pt-${pt.id}`}>{pt.name}</Label>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default CategoryTreeFilter;