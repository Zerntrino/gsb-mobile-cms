export interface Promotion {
  id: number;
  name: string;
  description: string;
  category_id: number;
  category_name: string;
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
  mcc_code: string[];

  coverImageUrl: string;
  cover_url: string;
  imageUrl: string[];
  image_url: string[];

  generate_type: number;
  prefix_code: string;
  import_code?: string[];
  isNotification: boolean;
  is_notification: boolean;
  categoryName?: string;

  limit: number;
  limit_per_month: number;
  limit_per_card_month: number;
  limit_per_card_day: number;
  card_id: number[];
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
