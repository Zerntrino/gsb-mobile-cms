export interface Promotion {
  id: number;
  name: string;
  categoryName: string;
  endDate: string;
  startDate: string;
  type: string;
  isActive: boolean;
  select: boolean;
}

export interface PromotionHistory {
  id: number;
  cardName: string;
  cardNumber: string;
  createdAt: string;
  name: string;
  telephone: string;
  select: boolean;
}
