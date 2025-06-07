export interface SubSpecialtyBasic {
  id: number;
  name: string;
}

export interface Specialty {
  id: number;
  name: string;
  active: boolean;
  subSpecialties: SubSpecialtyBasic[];
}
