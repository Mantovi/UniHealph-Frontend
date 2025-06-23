export type PointsType = 'GANHO' | 'USADO' | 'ESTORNO' | 'BONUS';

export interface PointsBalance {
  points: number;
  real: number;
}

export interface PointsHistory {
  amount: number;
  type: PointsType;
  description: string;
  createdAt: string;
}
