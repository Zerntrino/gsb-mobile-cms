export interface Card {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  tags: string[];
  referenceCode: string;
  referenceId: number;
}

export interface CardRef {
  id: number;
  name: string;
  referenceCode: string;
}
