"use server"

import { getDbInstance } from '../../database/firebase-config'
import { addDoc, getDocs, collection, query } from 'firebase/firestore'
import { ProductModel } from '@/app/database/schemas/productSchemas'
import { qrcodeModel } from '@/app/database/schemas/qrcodeSchemas'
import { NextResponse } from 'next/server'


export async function GET(request: Request) {
    const db = await getDbInstance()
    const qrCodeCollection = collection(db, "qrcodes").withConverter(qrcodeModel)
    
    const qrCodeFetchQuery =  query(qrCodeCollection)

}

