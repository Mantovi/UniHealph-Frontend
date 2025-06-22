export type SaleType =  'VENDA' | 'ALUGUEL';

export interface ProductBasic {
  id: number;
  name: string;
}

export interface ProductCreate {
  name: string;
  description: string;
  price: number;
  stockThreshold: number;
  saleType: SaleType;
  productTypeId: number;
  brandId: number;
  initialStock: number;
  imageUrls: string[];
}

export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  saleType: SaleType;
  active: boolean;
  averageRating: number;
  quantitySold: number;
  brandName: string;
  productTypeId: number;
  productTypeName: string;
  availableStock: number;
  imageUrls: string[];
}

export interface ProductUpdate {
  name: string;
  description: string;
  price: number;
  stockThreshold: number;
  saleType: SaleType;
  active: boolean;
  brandId: number;
  productTypeId: number;
  imageUrls: string[];
}

export interface ProductSearchParams {
  q?: string;
  brandIds?: number[];
  productTypeIds?: number[];
  categoryId?: number;
  subSpecialtyId?: number;
  specialtyId?: number;
  minPrice?: number;
  maxPrice?: number;
  saleType?: SaleType;
  sortBy?: string;
  direction?: 'asc' | 'desc';
}