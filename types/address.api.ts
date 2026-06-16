export type AddressRead = {
  id: string;
  title: string;
  fullName: string;
  phone: string;
  province: string;
  city: string;
  addressLine: string;
  postalCode: string;
  isDefault: boolean;
};

/** `POST /addresses` */
export type AddressCreateBody = {
  title: string;
  fullName: string;
  phone: string;
  province: string;
  city: string;
  addressLine: string;
  postalCode: string;
  isDefault?: boolean;
};

/** `PATCH /addresses/{addressId}` */
export type AddressUpdateBody = Partial<AddressCreateBody>;
