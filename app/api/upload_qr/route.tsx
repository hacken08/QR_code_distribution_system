/* eslint-disable @typescript-eslint/no-explicit-any */
import { addDoc, query, collection, where, getDocs } from 'firebase/firestore'
// import { getDbInstance } from '../../database/firebase-config'
import {  qrcodeModel, qrCodeSchemaList  } from '../../database/schemas/qrcodeSchemas'
import { NextResponse } from 'next/server';
import { z } from 'zod'
import { ProductModel } from '@/app/database/schemas/productSchemas';
import { db } from '../../../db/db'


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedBody = qrCodeSchemaList.parse(body);

    // check if body contains any data to upload
    if (parsedBody.length === 0) {
      return NextResponse.json(
        { message: "NOT FONUD: There is no QR code provided to upload in request payload" },
        { status: 204 }
      )
    }
    
    const itemCode = parsedBody[0].itemCode
    const batchNo = parsedBody[0].batchNo
    const productName = parsedBody[0].productName

    // Check if batch already exist in excel
    const existedQrCodeQuery = db.prepare(`
      SELECT * FROM qrcodes 
      WHERE 'batch_no' = ${batchNo};
    `)
    const existedQrCode = existedQrCodeQuery.all()
    if (existedQrCode.length > 0) {
      return NextResponse.json(
        { message: "UNABLE TO UPLOAD: QR Code already exists" },
        { status: 409 }
      )
    }
    
    // Checkng if the product with item code is exists
    const getOrCreateProductId = db.transaction((productParams: {
      itemCode: number, 
      productName: string,
    }): number => {
      const row = db.prepare("SELECT id FROM products WHERE item_code = ?").get(productParams.itemCode) as any;
      if (row) return row.id;
      const insert = db.prepare("INSERT INTO products (item_code, product_name) VALUES (?, ?)");
      const result = insert.run(productParams.itemCode, productParams.productName);
      return result.lastInsertRowid as number;
    });    

    const productId = getOrCreateProductId({itemCode, productName: productName})

    // Inserting QR Code data into sqlite3 database
    for (const qrData of parsedBody) {
      const insertQuery = `
        INSERT INTO qrcodes (
          product_name, 
          product_id, 
          item_code, 
          batch_no, 
          qrcode_string, 
          points, 
          is_used
        ) 
        VALUES ( 
          '${qrData.productName}', 
          '${productId}', 
          '${qrData.itemCode}', 
          '${qrData.batchNo}', 
          '${qrData.qrcodeString}', 
          '${qrData.points}', 0 );
      `
      db.exec(insertQuery) // executing query 
    }
    
    return NextResponse.json({
        message: "QR code created successfully",
      }, { status: 201 }
    );
  } catch (error: unknown) {
    console.error("API ERROR:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation failed", errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Internal server error", error: error },
      { status: 500 }
    );
  }
}

