export interface Reward {
  id: number;
  name: string;
  description: string;
  category_id: number;
  categoryId: number;
  category_name: string;
  categoryName: string;
  endDate: string;
  startDate: string;
  start_date: string;
  end_date: string;
  type_id: number;
  typeId: number;
  type_name: string;
  typeName?: string;
  shop_id: number;
  shopId: number;
  isActive: boolean;
  is_active: boolean;
  select: boolean;

  about_it: string[];
  aboutIt: string[];
  mcc_code: string[];

  coverUrl: string;
  cover_url: string;
  imageUrl: string[];
  image_url: string[];

  generate_type: number;
  generateType: number;
  prefix_code: string;
  prefixCode: string;
  import_code?: string[];
  importCode?: string[];
  importCodeFileName: string[] | string;

  productName: string;
  productCode: string;
  point: number;
  creditCashBack: number;
  credit_cash_back: number;
  mPoint: number;
  ref1: string;

  isNotification: boolean;
  is_notification: boolean;

  limit: number;
  limit_per_month: number;
  limitPerMonth: number;
  limit_per_card_per_month: number;
  limitPerCardPerMonth: number;
  limit_per_card: number;
  limitPerCard: number;
  limit_per_card_per_day: number;
  limitPerCardPerDay: number;
  card_id: number[];
  cardId: number[];

  productId: string;
  productDescription: string;
}

export interface RewardHistory {
  id: number;
  cardName: string;
  cardNumber: string;
  date: string;
  name: string;
  telephone: string;
  select: boolean;

  cashBack: number;
  point: number;
}
