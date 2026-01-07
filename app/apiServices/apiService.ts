/* eslint-disable @typescript-eslint/no-explicit-any */

import path from "path"
import axios, { AxiosError } from 'axios';
import { ProductType } from '../database/schemas/productSchemas'
import { apiErrorHandle } from './error'
import { ApiResponse } from './apiResponseStruct';
import { QrCodeSchemaList, QrCodeType } from '../database/schemas/qrcodeSchemas';

async function getProducts(): Promise<ApiResponse<ProductType[]>> {
    try {
        const response = await axios.get<{ data: ProductType[] }>('/api/get_product');
        console.log("{API RES} /api/get_product -> \n", response)
        if (!response.data?.data) {
            return { status: false, error: 'Invalid response format from server', };
        }
        return {
            status: true,
            data: response.data.data,
        };
    } catch (err: unknown) {
        return apiErrorHandle<ProductType[]>(err)
    }
}


async function getProductsQrCount(id: number): Promise<ApiResponse<any>> {
    try {
        const response = await axios.get<{ data: number }>(
            '/api/number_of_qr',
            { params: { id } }
        );
        console.log("{API RES} /api/get_product -> \n", response)
        if (!response.data?.data) {
            return {
                status: false,
                error: 'Invalid response format from server',
            };
        }
        return {
            status: true,
            data: response.data.data,
        };
    } catch (err: unknown) {
        return apiErrorHandle<any>(err)
    }
}





async function getDownloadQrCode(productId: number, qrQty: number): Promise<ApiResponse<QrCodeType[]>> {
    try {
        const response = await axios.post(
            '/api/download_qr', {
            qrQty,
            productId
        });

        console.log("{API RES} /api/download_qr -> \n", response)
        if (!response.data?.data) {
            return {
                status: false,
                error: 'Invalid response format from server',
            };
        }
        return {
            status: true,
            data: response.data.data,
        };
    } catch (err: unknown) {
        return apiErrorHandle<QrCodeType[]>(err)
    }
}




async function createExcelApi(qrCodes: QrCodeType[], divideIn: number): Promise<ApiResponse<any>> {
    try {
        const response = await axios.post('/api/gen-xl', { qrCodes, divideIn }, { responseType: 'blob' });
        console.log("{API RES} /api/gen-xl -> \n", response)
        // if (!response.data?.data) {
        //     return {
        //         status: false,
        //         error: 'Invalid response format from server',
        //     };
        // }
        return {
            status: true,
            data: response.data,
        };
    } catch (err: unknown) {
        return apiErrorHandle<any>(err)
    }
}



async function uploadExcelToServer(qrCodes: QrCodeSchemaList): Promise<ApiResponse<any>> {
    try {
        const response = await axios.post('/api/upload_qr', qrCodes);
        console.log("{API RES} /api/upload_qr -> \n", response)
        if (!response.data?.data) {
            return {
                status: false,
                error: 'Invalid response format from server',
            };
        }
        return {
            status: true,
            data: response.data,
        };
    } catch (err: unknown) {
        return apiErrorHandle<any>(err)
    }
}



export { getProducts, getProductsQrCount, getDownloadQrCode, createExcelApi, uploadExcelToServer }

