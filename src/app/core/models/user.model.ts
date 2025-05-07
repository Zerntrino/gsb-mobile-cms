export interface User {
  creditCardUserInformation: CardUserInformation;
  creditCardList: CreditCardList[];
  responseCode: string;
  responseDesc: string;
  responseDescTh: string;
}

export interface CardUserInformation {
  address: string;
  email: string;
  fullName: string;
  mobileNubmer: string;
}

export interface CreditCardList {
  accountNumber: string;
  cardId: number;
  cardImageUrl: string;
  cardNumber: string;
  cardOrg: string;
  cardRel: string;
  cardRelName: string;
  cardType: string;
  cardTypeFlag: string;
  cardTypeName: string;
  cardholderName: string;
}

export interface CardReward {
  categoryName: string;
  id: number;
  isActive: boolean;
  redeemPoint: number;
  reward: string;
  rewardType: string;
  transactionDate: string;
}

export interface CardPomition {
  categoryName: string;
  id: number;
  isActive: boolean;
  redeemPoint: number;
  reward: string;
  rewardType: string;
  transactionDate: string;
}
