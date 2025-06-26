export interface SpecialtyTree {
  id: number;
  name: string;
  active: boolean;
  subSpecialties: SubSpecialtyNode[];
}

export interface SubSpecialtyNode {
  id: number;
  name: string;
  categories: CategoryNode[];
}

export interface CategoryNode {
  id: number;
  name: string;
  productTypes: ProductTypeNode[];
}

export interface ProductTypeNode {
  id: number;
  name: string;
}
