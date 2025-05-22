export interface Installment {
  id: number;
  installmentPlan: string;
  name: string;
  description: string;
  planId: number;
  planCode: string;
  mccCode: string[];
  isActive: boolean;
  cardId: number[];
  startDate: string;
  endDate: string;
}

export interface InstallmentPlan {
  id: number;
  month: string;
  name: string;
  isAbroad: boolean;
  isActive: boolean;
  planInstallment: Plan[];
}
export interface Plan {
  interestRate: number;
  month: number;
  expensesMinimumInstallment: number;
}

export interface MCC {
  id: number;
  code: string;
  name: string;
}

export interface ParameterMCC {
  id: number;
  cardName: string;
  cardId: number;
  mccCode: string[];
}

export interface ParameterMinimum {
  id: number;
  cardName: string;
  cardId: number;
  minimumAmount: number;
  oldMinimumAmount?: number;
  isEditing: boolean;
}

// export enum UserPermission {
//   Promotion = 'promotion',
//   Setting = 'setting',
// }
