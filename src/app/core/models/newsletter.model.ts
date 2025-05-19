export interface NewsLetter {
  id: number;
  subject: string;
  description: string;
  sendNotificationDate: string;
  condition?: string;
  conditionId?: number[];
  isActive: boolean;
  isSendNotification: boolean;
  linkUrl: string;
  sendNotificationStatus: number;
}
