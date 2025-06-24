import { useEffect, useState } from 'react';
import { getSpecialtyTree } from '@/api/specialtyTree';
import type { SpecialtyTree, ProductTypeNode } from '@/types/specialtyTree';

interface Props {
  selectedProductTypes: number[];
  onToggleProductType: (id: number) => void;
}

export default function CategoryTreeFilter({ selectedProductTypes, onToggleProductType }: Props) {
  const [tree, setTree] = useState<SpecialtyTree[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const makeKey = (type: 'spec' | 'sub' | 'cat', id: number) => `${type}-${id}`;
  const toggleExpand = (key: string) => {
    setExpanded((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const isExpanded = (key: string) => expanded.includes(key);

  useEffect(() => {
    getSpecialtyTree()
      .then(setTree)
      .catch(() => console.error('Erro ao carregar categorias'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-muted-foreground">Carregando categorias...</p>;

  return (
    <div className="space-y-2 text-sm">
      <h3 className="font-semibold">Categorias</h3>
      {tree.map((spec) => {
        const specKey = makeKey('spec', spec.id);
        return (
          <div key={spec.id}>
            <button
              onClick={() => toggleExpand(specKey)}
              className="font-medium w-full text-left"
              aria-expanded={isExpanded(specKey)}
            >
              {isExpanded(specKey) ? '▼' : '►'} {spec.name}
            </button>

            {isExpanded(specKey) &&
              spec.subSpecialties.map((sub) => {
                const subKey = makeKey('sub', sub.id);
                return (
                  <div key={sub.id} className="pl-4">
                    <button
                      onClick={() => toggleExpand(subKey)}
                      className="text-left w-full"
                      aria-expanded={isExpanded(subKey)}
                    >
                      {isExpanded(subKey) ? '▼' : '►'} {sub.name}
                    </button>

                    {isExpanded(subKey) &&
                      sub.categories.map((cat) => {
                        const catKey = makeKey('cat', cat.id);
                        return (
                          <div key={cat.id} className="pl-4">
                            <button
                              onClick={() => toggleExpand(catKey)}
                              className="text-left w-full"
                              aria-expanded={isExpanded(catKey)}
                            >
                              {isExpanded(catKey) ? '▼' : '►'} {cat.name}
                            </button>

                            {isExpanded(catKey) &&
                              cat.productTypes.map((pt: ProductTypeNode) => (
                                <div key={pt.id} className="pl-4 flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    id={`pt-${pt.id}`}
                                    checked={selectedProductTypes.includes(pt.id)}
                                    onChange={() => onToggleProductType(pt.id)}
                                  />
                                  <label htmlFor={`pt-${pt.id}`}>{pt.name}</label>
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
  );
}