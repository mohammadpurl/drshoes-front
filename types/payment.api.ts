export type PaymentInfo = {
  cardNumber: string;
  cardHolder: string;
  bankName: string;
  instructions: string;
};

export type PaymentSettingsRead = {
  cardNumber: string;
  cardHolderName: string;
  bankName: string;
  instructions: string;
  iban?: string;
};

export type PaymentInfoUpdate = PaymentInfo;
