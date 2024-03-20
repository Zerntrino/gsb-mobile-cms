export interface Banner {
  id: number;
  imageUrl: string;
  isActive: boolean;
  name: string;
  endDate: string;
  startDate: string;

  select?: boolean;
}
