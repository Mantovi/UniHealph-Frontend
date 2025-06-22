import type { ProductTypeBasic } from "./product-type";

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
