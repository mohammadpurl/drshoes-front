export type ApiError = {
  title?: string;
  status?: number;
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>;
};

export type BadRequestError = ApiError & { status: 400 };
export type ValidationError = ApiError & { status: 422 };
export type NotFoundError = ApiError & { status: 404 };
export type UnauthorizedError = ApiError & { status: 401 };
export type UnhandledException = ApiError & { status: 500 };
export type NetworkError = ApiError & { status: 0 };
