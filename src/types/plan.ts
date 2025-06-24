export interface Plan {
  id: number;
  name: string;
  maxStudents: number;
  priceMonthly: number;
  priceYearly: number;
  description: string;
}
export interface PlanRequest {
  name: string;
  maxStudents: number;
  priceMonthly: number;
  priceYearly: number;
  description: string;
}