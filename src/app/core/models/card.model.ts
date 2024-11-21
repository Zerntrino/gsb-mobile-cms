export interface Card {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  tags: string[];
  referenceCode: string;
  referenceId: number;
  isActive: boolean;
}

export interface CardRef {
  id: number;
  name: string;
  referenceCode: string;
}
