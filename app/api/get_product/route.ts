"use server"

import { addDoc, getDocs, collection } from 'firebase/firestore'
import { ProductModel } from '@/app/database/schemas/productSchemas'
import { NextResponse } from 'next/server'
import { db } from '../../../db/db'

export async function GET(request: Request) {
    // const db = await getDbInstance()
    // const productCollection = collection(db, "products")
    // const productSnapshot = await getDocs(productCollection)

    // return NextResponse.json({
    //     message: "Successfuly get products from database",
    //     data: productSnapshot.docs.map(doc => doc.data())
    // }, { status: 200 })
    try {
        const getAllProductQuery = db.prepare(`
            SELECT * FROM products;    
        `)
        const existedProducst = getAllProductQuery.all()
        // console.log("{DB RES} fetche products: ", existedProducst)
        return NextResponse.json({
            status: true,
            message: "Success",
            data: existedProducst
        }, { status: 200 })
    } catch (e) {
        return NextResponse.json({
            status: false,
            message: e
        }, { status: 500 })
    }
}

