import { API_URL } from "@/configs/global";

import {
    ApiError,
} from "@/types/http-errors.interface";
import axios, {
    AxiosRequestConfig,
    AxiosRequestHeaders,
    AxiosResponse,
} from "axios";
import { defaultErrorStrategy, errorHandler, networkErrorStrategy } from "./http-error-strategies";
import { getSession } from "@/app/utils/session";

const httpService = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

httpService.interceptors.request.use((config) => {
    if (config.data instanceof FormData) {
        const headers = config.headers;
        if (headers && typeof headers === 'object') {
            if ('delete' in headers && typeof headers.delete === 'function') {
                headers.delete('Content-Type');
                headers.delete('content-type');
            } else {
                const h = headers as Record<string, unknown>;
                delete h['Content-Type'];
                delete h['content-type'];
            }
        }
    }
    return config;
});

httpService.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error?.response) {
            const statusCode = error.response.status;
            if (statusCode >= 400) {
                const errorData: ApiError = error.response?.data ?? {
                    title: 'خطا',
                    status: statusCode,
                    detail: error.message,
                };
                const handler = errorHandler[statusCode] ?? defaultErrorStrategy;
                handler(errorData);
            }
        } else {
            networkErrorStrategy();
        }
        return Promise.reject(error);
    }
);

async function apiBase<T>(
    url: string,
    options?: AxiosRequestConfig
): Promise<T> {
    const response: AxiosResponse = await httpService(url, options);
    return response.data as T;
}

async function readData<T>(
    url: string,
    headers?: AxiosRequestHeaders
): Promise<T> {
    const options: AxiosRequestConfig = {
        headers: headers,
        method: "GET",
    };
    return await apiBase<T>(url, options);
}

async function createData<TModel, TResult>(
    url: string,
    data: TModel,
    headers?: AxiosRequestHeaders
): Promise<TResult> {
    const options: AxiosRequestConfig = {
        method: "POST",
        headers: headers,
        data
    };
    console.log("createData url is", url);

    return await apiBase<TResult>(url, options);
}

async function updateData<TModel, TResult>(
    url: string,
    data: TModel,
    headers?: AxiosRequestHeaders
): Promise<TResult> {
    const options: AxiosRequestConfig = {
        method: "PUT",
        headers: headers,
        data: JSON.stringify(data),
    };

    return await apiBase<TResult>(url, options);
}

async function patchData<TModel, TResult>(
    url: string,
    data: TModel,
    headers?: AxiosRequestHeaders
): Promise<TResult> {
    const options: AxiosRequestConfig = {
        method: "PATCH",
        headers: headers,
        data,
    };

    return await apiBase<TResult>(url, options);
}

async function uploadData<TResult>(
    url: string,
    data: FormData,
    headers?: AxiosRequestHeaders
): Promise<TResult> {
    const options: AxiosRequestConfig = {
        method: "POST",
        headers: headers,
        data,
    };

    return await apiBase<TResult>(url, options);
}

async function deleteData(
    url: string,
    headers?: AxiosRequestHeaders
): Promise<void> {
    const options: AxiosRequestConfig = {
        method: "DELETE",
        headers: headers,
    };

    return await apiBase(url, options);
}

/**
 * Helper function to get auth headers from session
 * This function reads the session from cookies and adds Authorization header
 */
async function getAuthHeaders(
    json = true,
    cartToken?: string
): Promise<AxiosRequestHeaders> {
    const session = await getSession();
    const headers: Record<string, string> = {
        "Accept": "application/json",
    };

    if (json) {
        headers["Content-Type"] = "application/json";
    }
    
    if (session?.accesstoken) {
        headers["Authorization"] = `Bearer ${session.accesstoken}`;
    }

    if (cartToken) {
        headers["X-Cart-Token"] = cartToken;
    }
    
    return headers as AxiosRequestHeaders;
}

/**
 * Read data with automatic authentication from session
 */
async function readDataWithAuth<T>(url: string): Promise<T> {
    const headers = await getAuthHeaders();
    return await readData<T>(url, headers);
}

/**
 * Create data with automatic authentication from session
 */
async function createDataWithAuth<TModel, TResult>(
    url: string,
    data: TModel,
    cartToken?: string
): Promise<TResult> {
    const headers = await getAuthHeaders(true, cartToken);
    return await createData<TModel, TResult>(url, data, headers);
}

/**
 * Update data with automatic authentication from session
 */
async function updateDataWithAuth<TModel, TResult>(
    url: string,
    data: TModel
): Promise<TResult> {
    const headers = await getAuthHeaders();
    return await updateData<TModel, TResult>(url, data, headers);
}

/**
 * Delete data with automatic authentication from session
 */
async function deleteDataWithAuth(url: string): Promise<void> {
    const headers = await getAuthHeaders();
    return await deleteData(url, headers);
}

async function patchDataWithAuth<TModel, TResult>(
    url: string,
    data: TModel
): Promise<TResult> {
    const headers = await getAuthHeaders();
    return await patchData<TModel, TResult>(url, data, headers);
}

async function uploadDataWithAuth<TResult>(
    url: string,
    data: FormData
): Promise<TResult> {
    const headers = await getAuthHeaders(false);
    return await uploadData<TResult>(url, data, headers);
}

async function createDataWithCartToken<TModel, TResult>(
    url: string,
    data: TModel,
    cartToken?: string
): Promise<TResult> {
    const headers: Record<string, string> = {
        Accept: "application/json",
        "Content-Type": "application/json",
    };
    if (cartToken?.trim()) {
        headers["X-Cart-Token"] = cartToken.trim();
    }
    return await createData<TModel, TResult>(url, data, headers as AxiosRequestHeaders);
}

export type CartHttpResult<T> = {
    data: T;
    cartToken?: string;
};

async function buildCartHeaders(cartToken?: string): Promise<Record<string, string>> {
    const headers = await getAuthHeaders(true, cartToken);
    return headers as Record<string, string>;
}

function extractCartToken(response: AxiosResponse): string | undefined {
    const token =
        response.headers["x-cart-token"] ?? response.headers["X-Cart-Token"];
    return typeof token === "string" && token.trim() ? token.trim() : undefined;
}

async function cartGet<T>(url: string, cartToken?: string): Promise<CartHttpResult<T>> {
    const response = await httpService.get<T>(url, {
        headers: await buildCartHeaders(cartToken),
    });
    return { data: response.data, cartToken: extractCartToken(response) };
}

async function cartPost<TModel, TResult>(
    url: string,
    data: TModel,
    cartToken?: string
): Promise<CartHttpResult<TResult>> {
    const response = await httpService.post<TResult>(url, data, {
        headers: await buildCartHeaders(cartToken),
    });
    return { data: response.data, cartToken: extractCartToken(response) };
}

async function cartPatch<TModel, TResult>(
    url: string,
    data: TModel,
    cartToken?: string
): Promise<CartHttpResult<TResult>> {
    const response = await httpService.patch<TResult>(url, data, {
        headers: await buildCartHeaders(cartToken),
    });
    return { data: response.data, cartToken: extractCartToken(response) };
}

async function cartDelete<T = void>(
    url: string,
    cartToken?: string
): Promise<CartHttpResult<T>> {
    const response = await httpService.delete<T>(url, {
        headers: await buildCartHeaders(cartToken),
    });
    return { data: response.data, cartToken: extractCartToken(response) };
}

export { 
    createData, 
    readData, 
    updateData,
    patchData,
    uploadData,
    deleteData,
    createDataWithCartToken,
    createDataWithAuth,
    readDataWithAuth,
    updateDataWithAuth,
    patchDataWithAuth,
    uploadDataWithAuth,
    deleteDataWithAuth,
    cartGet,
    cartPost,
    cartPatch,
    cartDelete,
};
