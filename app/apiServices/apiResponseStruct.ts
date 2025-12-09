/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ApiResponse<T = any> {
    status: boolean;
    data?: T;
    error?: string;
}
