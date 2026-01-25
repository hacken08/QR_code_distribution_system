/* eslint-disable @typescript-eslint/no-explicit-any */
// import { getDbInstance } from '../../database/firebase-config'
import {  qrCodeSchemaList  } from '../../database/schemas/qrcodeSchemas'
import { NextResponse } from 'next/server';
import { z } from 'zod'
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
    
    const itemCode = parsedBody[0].item_code
    const batchNo = parsedBody[0].batch_no
    const productName = parsedBody[0].product_name

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
    // Checking if the product with item code is exists
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
    const insertQRCodes = db.transaction(() => {
      console.log("{DB OPT} Inserting QR Code in DB")
      for (const qrData of parsedBody) {
        const insertQuery = db.prepare( `
          INSERT OR IGNORE  INTO qrcodes (
            product_name, 
            product_id, 
            item_code, 
            batch_no, 
            qrcode_string, 
            points, 
            is_used
          ) 
          VALUES ( 
            '${qrData.product_name}', 
            '${productId}', 
            '${qrData.item_code}', 
            '${qrData.batch_no}', 
            '${qrData.qrcode_string}', 
            '${qrData.points}', 0 );
        `);
        insertQuery.run() 
      }
    });    
    insertQRCodes()
    
    return NextResponse.json({
        message: "QR code created successfully",
        data: []
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


// async function isQRCodeAlreadyExists(qrCodeString: string): Promise<boolean> {
//     const findingExistedQRCode = db.transaction((params: {
//       qrCodeString: string, 
//     }) => {
//       const row = db.prepare("SELECT * FROM qrcodes WHERE qrcode_string = ?;").get(params.qrCodeString) as any;
//       console.log("Existing QR Codes: ", row);
//       return row
//     });    

//     await findingExistedQRCode(qrCodeString);
    
//   return true;
// }
