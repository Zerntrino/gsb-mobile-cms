export interface Reward {
  id: number;
  name: string;
  category_name: string;
  categoryName: string;
  endDate: string;
  startDate: string;
  type: string;
  isActive: boolean;
  select: boolean;

  typeId: number;
  typeName: string;
}

export interface RewardHistory {
  id: number;
  cardName: string;
  cardNumber: string;
  createdAt: string;
  name: string;
  telephone: string;
  select: boolean;
}
