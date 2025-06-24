import type { CategoryBasic } from "./category";

export interface SubSpecialtyBasic {
  id: number;
  name: string;
}

export interface SubSpecialty {
  id: number;
  name: string;
  active: boolean;
  categories: CategoryBasic[];
}

export interface SubSpecialtyRequest {
  name: string;
  active: boolean;
  categories?: CategoryBasic[];
}
