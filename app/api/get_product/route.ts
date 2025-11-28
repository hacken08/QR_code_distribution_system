"use server"

import { getDbInstance } from '../../database/firebase-config'
import { addDoc, getDocs, collection } from 'firebase/firestore'
import { ProductModel } from '@/app/database/schemas/productSchemas'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const db = await getDbInstance()
    const productCollection = collection(db, "products")
    const productSnapshot = await getDocs(productCollection)
    
    return NextResponse.json({
        message: "Successfuly get products from database",
        data: productSnapshot.docs.map(doc => doc.data())
    }, { status: 200 })
}

