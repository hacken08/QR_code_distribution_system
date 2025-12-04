
import { NextResponse } from 'next/server'
import { db } from '../../../lib/db'


async function POST(req: Request) {

    const userCreateQuery = db.exec(`
        INSERT INTO users (id, name, email) 
        VALUES (21, 'ME GOYAL', 'mesda.code@gmail.com')
    `)

    return NextResponse.json({
        message: "Test query executed in success",
    }, { status: 200 })
}

export { POST }


