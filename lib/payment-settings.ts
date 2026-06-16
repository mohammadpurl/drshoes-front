import type { PaymentInfo, PaymentSettingsRead } from "@/types/payment.api";

export function normalizePaymentSettings(
  data: PaymentInfo | PaymentSettingsRead
): PaymentSettingsRead {
  if ("cardHolder" in data && data.cardHolder) {
    return {
      cardNumber: data.cardNumber,
      cardHolderName: data.cardHolder,
      bankName: data.bankName,
      instructions: data.instructions,
    };
  }
  return data as PaymentSettingsRead;
}
