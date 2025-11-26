import { getFirestore, doc, addDoc, collection } from 'firebase/firestore'
import { getDbInstance } from '../../database/firebase-config'
import {  qrcodeModel, qrCodeSchemaList  } from '../../database/schemas/qrcodeSchemas'
import { NextResponse } from 'next/server';
import {z } from 'zod'



export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log(body)
    const parsedData = qrCodeSchemaList.parse(body);
    const db = await getDbInstance();

    for (const qrData of parsedData) {
      await addDoc(collection(db, "qrcodes").withConverter(qrcodeModel), {
        productName: qrData.productName,
        itemCode: qrData.itemCode,
        batchNo: qrData.batchNo,
        qrcodeString: qrData.qrcodeString,
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

