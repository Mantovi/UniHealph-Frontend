import type { ProductBasic } from "./product";

export interface ProductTypeBasic {
  id: number;
  name: string;
}

export interface ProductType {
  id: number;
  name: string;
  active: boolean;
  products: ProductBasic[];
}

export interface ProductTypeRequest {
  name: string;
  active: boolean;
  products?: ProductBasic[];
}
