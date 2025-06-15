export interface User {
  creditCardUserInformation: CardUserInformation;
  revolvingLoanUserInformation: RevolvingLoanUserInformation;
  creditCardList: CreditCardList[];
  responseCode: string;
  responseDesc: string;
  responseDescTh: string;
  cardTypeFlag: string;
}

export interface CardUserInformation {
  address: string;
  email: string;
  fullName: string;
  mobileNubmer: string;
}

export interface RevolvingLoanUserInformation {
  fullName: string;
  mobileNubmer: string;
  email: string;
  address: string;
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
  promotionName: string;
  promotionType: string;
  regisDate: string;
}

export interface Admin {
  createdDate: string;
  email: string;
  id: number;
  isActive: boolean;
  role: number;
}
