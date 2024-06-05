export interface Reward {
  id: number;
  name: string;
  category_name: string;
  endDate: string;
  startDate: string;
  type: string;
  isActive: boolean;
  select: boolean;
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
