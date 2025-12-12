/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiResponse } from '@/app/apiServices/apiResponseStruct'
import { productSchemas } from '@/app/database/schemas/productSchemas'
import { qrCodeSchemaList } from '@/app/database/schemas/qrcodeSchemas'
import excel4node from 'excel4node'
import { NextResponse } from 'next/server'
import * as z from 'zod'

const payloadSchema = z.object({
    qrCodes: z.array(z.object({
        id: z.number().optional(),
        product_name: z.string(),
        product_id: z.number().min(1, "Product id not defined"),
        batch_no: z.number().gt(0, "batch_no should be positive integer"),
        qrcode_string: z.string(),
        points: z.number(),
    })),
})

export async function POST(req: Request) {
    try {
        const body = await req.json()
        console.log("{DEUBG INF} excel4node isinstanceof ", typeof excel4node)
        const payloadData = payloadSchema.parse(body)

        // generating excel file
        const wb = new excel4node.WorkBook()
        const wsheet1 = wb.addWorksheet("sheet 1")

        const headerStyle = wb.createStyle({
            font: {
                color: "FF0800",
                size: 14
            }
        })

        // creating headers
        const headers: string[] = [
            "Id", "Item Code",
            "Product Name", "QR Code",
            "Points", "Status", "Batch No."
        ]

        for (let i = 1; i <= headers.length; i++) {
            wsheet1.cell(1, i).string(headers[i]).style(headerStyle)
        }

        // writing the excel into buffer memory
        const buffer = await wb.writeToBuffer()
        return NextResponse.json<ApiResponse<any>>({
            status: true,
            data: buffer,
        }, { status: 201 })
        
    } catch (error: any) {
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
