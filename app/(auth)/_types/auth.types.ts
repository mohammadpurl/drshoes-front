export type JWT = {
  exp: number;
  sub?: string;
  userName?: string;
  fullName?: string;
  pic?: string;
  userId?: string | number;
  id?: string | number;
  roles?: string[];
  role?: string | string[];
  permissions?: string[];
};

export type SignInModel = {
  username: string;
  password: string;
  userAgent?: string;
};

export type AdminSignInModel = {
  username: string;
  password: string;
};

export type UserResponse = {
  accessToken: string;
  sessionId?: string;
  sessionExpiry?: number;
  userId?: string | number;
  roles?: string[];
  permissions?: string[];
};

export type UserSession = {
  userName: string;
  fullName?: string;
  pic?: string;
  exp: number;
  accesstoken: string;
  sessionId: string;
  sessionExpiry: number;
  userId?: string;
  roles?: string[];
  permissions?: string[];
};
