/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from 'axios';
import { ProductType } from '../database/schemas/productSchemas'
import { apiErrorHandle } from './error'
import { ApiResponse } from './apiResponseStruct';
import { QrCodeSchemaList, QrCodeType } from '../database/schemas/qrcodeSchemas';


const backendHost = process.env.NEXT_PUBLIC_BACKEND_HOST || "";

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
        console.log("{INFO} base url -> ", backendHost);
        const reqBody = {
            variables: { createQrcodeInput: qrCodes },
            query: `mutation createQrcode($createQrcodeInput: [CreateQrcodeInput!]!) {
                    createQrcode(createQrcodeInput: $createQrcodeInput) 
                }`
        }
        const response = await axios.post(backendHost, reqBody, { maxBodyLength: 10 * 1024 * 1024 });
        console.log("{API RES} /api/upload_qr -> \n", response)
        if (!response.data?.data.createQrcode) {
            return {
                status: false,
                error: 'Invalid response format from server',
            };
        }
        return {
            status: true,
            data: response.data?.data.createQrcode,
        };
    } catch (err: unknown) {
        return apiErrorHandle<any>(err)
    }
}




async function findProductByName(product_name: string): Promise<ApiResponse<any>> {
    try {
        console.log("{INFO} base url -> ", backendHost);
        const reqBody = {
            variables: { searchProductInput: { product_name } },
            query: `query findProductByName($searchProductInput: SearchProductInput!) {
                findProductByName(searchProductInput: $searchProductInput) {
                    product_name, id, item_code
                }
            }`
        }
        const response = await axios.post(backendHost, reqBody);
        console.log("{API RES} /api/findProductByName -> \n", response.data)
        if (!response.data?.data.findProductByName) {
            return {
                status: false,
                error: 'Invalid response format from server',
            };
        }
        return {
            status: true,
            data: response.data?.data.findProductByName,
        };
    } catch (err: unknown) {
        return apiErrorHandle<any>(err)
    }
}




export {
    getProducts,
    getProductsQrCount,
    getDownloadQrCode,
    createExcelApi,
    uploadExcelToServer,
    findProductByName
}

