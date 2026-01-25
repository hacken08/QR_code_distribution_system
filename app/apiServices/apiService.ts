/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from 'axios';
import { ProductType } from '../database/schemas/productSchemas'
import { apiErrorHandle } from './error'
import { ApiResponse } from './apiResponseStruct';
import { QrCodeSchemaList, QrCodeType } from '../database/schemas/qrcodeSchemas';


const backendHost = process.env.NEXT_PUBLIC_BACKEND_HOST || "";

async function getProducts(): Promise<ApiResponse<ProductType[]>> {
    try {
        const reqBody = {
            variables: {},
            query: `query findAllProducts {
                findAllProducts {
                    id, item_code, product_name,
                    created_at, deleted_at, updated_at,
                }
            }`
        }
        const response = await axios.post<{ data: { findAllProducts: ProductType[] } }>(backendHost, reqBody);
        console.log("{API RES} /api/get_product -> \n", response)
        return {
            status: true,
            data: response.data.data.findAllProducts,
        };
    } catch (err: unknown) {
        return apiErrorHandle<ProductType[]>(err)
    }
}


async function getProductsQrCount(id: number): Promise<ApiResponse<number>> {
    try {
        const reqBody = {
            variables: { id },
            query: `query getQrCodeCount($id: Int!) {
               getQrCodeCount(id:$id) 
            }`
        }
        const response = await axios.post<{ data: { getQrCodeCount: number } }>(backendHost, reqBody);
        console.log("{API RES} /api/get_product -> \n", response)
        return {
            status: true,
            data: response.data.data.getQrCodeCount,
        };
    } catch (err: unknown) {
        return apiErrorHandle<any>(err)
    }
}





async function downloadQrCodes(product_id: number, qty: number): Promise<ApiResponse<QrCodeType[]>> {
    try {
        const reqBody = {
            variables: { product_id, qty },
            query: `query downloadQrCodes($qty: Int!, $product_id: Int!) {
                downloadQrCodes(qty:$qty, product_id:$product_id) {
                    id, product_id, 
                    product_name, points,
                    qrcode_string, is_used, 
                    batch_no, item_code
                }
            }`
        }
        const response = await axios.post<{ data: { downloadQrCodes: QrCodeType[] } }>(backendHost, reqBody);
        console.log("{API RES} /api/download_qr -> \n", response)
        return {
            status: true,
            data: response.data.data.downloadQrCodes,
        };
    } catch (err: unknown) {
        return apiErrorHandle<QrCodeType[]>(err)
    }
}




async function createExcelApi(qrCodes: QrCodeType[], divideIn: number): Promise<ApiResponse<any>> {
    try {
        const response = await axios.post('/api/gen-xl', { qrCodes, divideIn }, { responseType: 'blob' });
        console.log("{API RES} /api/gen-xl -> \n", response)
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
    uploadExcelToServer,
    findProductByName,
    downloadQrCodes,
    createExcelApi,
}

