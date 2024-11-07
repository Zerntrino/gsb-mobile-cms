export interface Card {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  type: string;
  tags: string[];
  referenceCode: string;
}

export interface CardRef {
  id: number;
  name: string;
}
