import type { ProductTypeBasic } from "./productType";

export interface CategoryBasic {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  active: boolean;
  productTypes: ProductTypeBasic[];
}

export interface CategoryRequest {
  name: string;
  active: boolean;
  productTypes?: ProductTypeBasic[];
}
