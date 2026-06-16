/** `POST /auth/login` و `POST /auth/register` */
export type AuthTokenResponse = {
  access_token: string;
  token_type: string;
};

/** `POST /auth/login` */
export type CustomerLoginBody = {
  username: string;
  password: string;
};

/** `POST /auth/register` */
export type CustomerRegisterBody = {
  username: string;
  password: string;
  fullName: string;
  phone: string;
};

/** `GET /auth/me` */
export type CustomerMeRead = {
  id: string;
  username: string;
  full_name: string;
  phone: string;
  email?: string | null;
  is_admin: boolean;
};
