export interface Promotion {
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
  mccCode: string[];

  coverImageUrl: string;
  cover_url: string;
  coverUrl: string;
  imageUrl: string[];
  image_url: string[];

  generate_type: number;
  generateType: number;
  prefix_code: string;
  prefixCode: string;
  import_code?: string[];
  importCode?: string[];
  importCodeFileName: string[] | string;
  isNotification: boolean;
  is_notification: boolean;

  limit: number;
  limit_per_month: number;
  limitPerMonth: number;
  limit_per_card_month: number;
  limitPerCardMonth: number;
  limit_per_card_day: number;
  limitPerCardDay: number;
  card_id: number[];
  cardId: number[];
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

export interface PromotionType {
  id: number;
  name: string;
}
