/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from "axios";
import { ApiResponse } from "./apiResponseStruct";



function apiErrorHandle<T = any>(err: any): ApiResponse<T> {
    if (err instanceof AxiosError) {
        const message =
            err.response?.data?.error ||
            err.response?.data?.message ||
            err.message ||
            'Network error';

        const statusCode = err?.status ?? 0;
        console.error(`[API ERROR] ${err.request} → ${statusCode} ${message}`);
        return {
            status: false,
            error: statusCode >= 500
                ? 'Server error. Please try again later.'
                : message,
        };
    }

    if (err instanceof Error) {
        console.error('[UNEXPECTED ERROR]', err);
        return {
            status: false,
            error: 'An unexpected error occurred',
        };
    }

    return {
        status: false,
        error: 'Failed to fetch products',
    };

}



export { apiErrorHandle }
