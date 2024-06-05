export interface Promotion {
  id: number;
  name: string;
  category_name: string;
  endDate: string;
  startDate: string;
  type_id: number;
  type_name: string;
  isActive: boolean;
  select: boolean;

  categoryName?: string;
  typeName?: string;
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
