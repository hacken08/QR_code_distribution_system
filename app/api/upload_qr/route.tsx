/* eslint-disable @typescript-eslint/no-explicit-any */
import { addDoc, query, collection, where, getDocs } from 'firebase/firestore'
import { getDbInstance } from '../../database/firebase-config'
import {  qrcodeModel, qrCodeSchemaList  } from '../../database/schemas/qrcodeSchemas'
import { NextResponse } from 'next/server';
import { z } from 'zod'
import { ProductModel } from '@/app/database/schemas/productSchemas';



export async function POST(request: Request) {
  try {
    const body = await request.json();
    const findingUndefine = body.filter((data:any) => !data.productName || !data.qrcodeString || !data.points )
    console.log(`undefine fields in qr data`, findingUndefine)
    const parsedBody = qrCodeSchemaList.parse(body);

    // check if body contains any data to upload
    if (parsedBody.length === 0) {
      return NextResponse.json(
        { message: "NOT FONUD: there is no qr code to upload" },
        { status: 409 }
      )
    }
    
    const itemCode = parsedBody[0].itemCode
    const db = await getDbInstance();
    const qrCodeCollection = collection(db, "qrcodes").withConverter(qrcodeModel)

    // Check if batch already exist in excel
    // const qrCodebatchQuery =  query(qrCodeCollection, where('batchNo', '==', parsedBody[0].batchNo))
    // const existedQrCode = await getDocs(qrCodebatchQuery)
    
    // if (existedQrCode.docs.length === 0) {
    //   return NextResponse.json(
    //     { message: " UNABLE TO UPLOAD: QR Code already exists" },
    //     { status: 409 }
    //   )
    // }
    
    // Checkng if the product with item code is exists
    const productCollection = collection(db, "products").withConverter(ProductModel);
    const itemCodeQuery = query(productCollection , where('itemCode', '==', itemCode))
    const productSnapShot = await getDocs(itemCodeQuery) 
    let productId = productSnapShot.empty ? "" : productSnapShot.docs[0].id;
 
    // saving that product if it's not exists
    if (productSnapShot.empty) {  
      const productRef = await addDoc(productCollection, {
        itemCode, 
        productName: parsedBody[0].productName,
        createdAt: new Date(),
        deletedAt: null,
        updatedAt: null
      })
      productId = productRef.id
    }

    // pushing qr code data into firestore db
    for (const qrData of parsedBody) {
      await addDoc(qrCodeCollection, {
        productId: productId,
        productName: qrData.productName,
        itemCode: qrData.itemCode,
        batchNo: qrData.batchNo,
        qrcodeString: qrData.qrcodeString,
        points: qrData.points,
        isUsed: false,
        createdAt: new Date(),
        deletedAt: null,
        updatedAt: null
      });
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

