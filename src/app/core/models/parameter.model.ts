export interface Installment {
  id: number;
  installmentPlan: string;
  name: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
}

export interface InstallmentPlan {
  id: number;
  month: string;
  name: string;
  isActive: boolean;
}

export interface MCC {
  id: number;
  code: string;
  name: string;
}

export interface ParameterMCC {
  id: number;
  cardName: string;
  mccCode: string[];
}

export interface ParameterMinimum {
  id: number;
  cardName: string;
  minimumAmount: number;
  isEditing: boolean;
}

// export enum UserPermission {
//   Promotion = 'promotion',
//   Setting = 'setting',
// }
