import type { SubSpecialtyBasic } from "./subspecialty";

export interface Specialty {
  id: number;
  name: string;
  active: boolean;
  subSpecialties: SubSpecialtyBasic[];
}
