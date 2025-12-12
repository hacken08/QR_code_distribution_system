
import { db } from '../../../db/db'
import {NextResponse} from 'next/server'
import { qrcodeSchemas } from '@/app/database/schemas/qrcodeSchemas'
import z from 'zod'
import { error } from 'console'

const payloadSchema = z.object({
    qrQty: z.number().min(1, "QR Qty to download should be greater than 0"),
    productId: z.number().min(1, "Required argument 'product id' not supply to 'api/download_qr/ api"),
})


export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { qrQty, productId } = payloadSchema.parse(body)
        
        const claimQRCodeQuery = db.prepare(`
            UPDATE qrcodes
                SET is_used = 1,
                    updated_at = datetime('now')
                WHERE id IN (
                    SELECT id 
                    FROM qrcodes 
                    WHERE product_id = ?
                    AND is_used = 0 
                    LIMIT ?
                )
                RETURNING 
                    id, 
                    qrcode_string, 
                    product_name,
                    product_id,
                    points,
                    item_code,
                    batch_no
        `)

        const claimedQr = claimQRCodeQuery.all(productId, qrQty)
        const qrCodesParsed = z.array(qrcodeSchemas).safeParse(claimedQr)
        if (!qrCodesParsed.success) {
            console.log("{API ERROR} Database Query fail at api/download_qr line: 43  -> ", qrCodesParsed.error)
            return NextResponse.json({
                success: false,
                message: "unable to parse QR codes fetched from DB",
                error: "ZOD VALIDATION ERROR"
            }, { status: 409 })
        }

        const { data: qrCode } = qrCodesParsed;
        const qrCodesCount = qrCode.length

        if (qrCodesCount === 0) {
            return NextResponse.json({
                success: false,
                message: "There no qr code to return", 
            }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: "QR code downloaded successfully",
            data: qrCode,
        }, { status: 200 })
    } catch (error:unknown) {
        console.error("API ERROR:", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json(
            { message: "Validation failed: Payload", errors: error.errors },
            { status: 400 }
            );
        }
        return NextResponse.json(
            { message: "Internal server error", error: error },
            { status: 500 }
        );
    } 
}
