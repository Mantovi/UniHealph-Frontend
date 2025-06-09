export interface Specialty {
  id: number;
  name: string;
  active: boolean;
  subSpecialties: SubSpecialtyBasic[];
}

export interface SubSpecialty {
  id: number;
  name: string;
  active: boolean;
  categories: CategoryBasic[];
}

export interface SubSpecialtyBasic {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  active: boolean;
  productTypes: ProductTypeBasic[];
}
export interface CategoryBasic {
  id: number;
  name: string;
}

export interface ProductTypeBasic {
  id: number;
  name: string;
}
