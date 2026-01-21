/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import * as z from "zod";
import XLS from "xlsjs";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";

const payloadSchema = z.object({
  qrCodes: z.array(
    z.object({
      id: z.number().optional(),
      product_name: z.string(),
      product_id: z.number().min(1, 'Product id not defined'),
      batch_no: z.number().gt(0, 'batch_no should be positive integer'),
      qrcode_string: z.string(),
      points: z.number(),
    })
  ),
  divideIn: z.number().min(1, "'divideIn' is required and must be at least 1"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const payloadData = payloadSchema.parse(body);

    const { qrCodes, divideIn } = payloadData;

    // Dynamic import to avoid Turbopack issues
    const excel4node = await import('excel4node') as any;
    const { Workbook } = excel4node;

    const wb = new Workbook();
    const ws = wb.addWorksheet('QR Codes');

    // Header style
    // const headerStyle = wb.createStyle({
    //   font: { bold: true, color: '#FFFFFF', size: 14 },
    //   fill: { type: 'pattern', patternType: 'solid', fgColor: '#4F46E5' },
    //   alignment: { horizontal: 'center', vertical: 'middle' },
    // });

    // Fixed columns on the left
    const fixedHeaders = ['ID', 'Product Name', 'Points', 'Status', 'Batch No.'];
    const qrCodeHeaders = Array.from({ length: divideIn }, (_, i) => `QR Code ${i + 1}`);

    const allHeaders = [...fixedHeaders, ...qrCodeHeaders];

    allHeaders.forEach((header, index) => {
      ws.cell(1, index + 1).string(header)
    });

    const FIXED_COLUMNS = fixedHeaders.length; 
    const QR_START_COLUMN = FIXED_COLUMNS + 1;

    const rowsPerColumn = Math.ceil(qrCodes.length / divideIn);
    let qrIndex = 0;

    for (let col = 0; col < divideIn; col++) {
      const qrColumn = QR_START_COLUMN + col;

      for (let r = 0; r < rowsPerColumn; r++) {
        const row = r + 2;
        const qr = qrCodes[qrIndex];

        if (qr) {
          ws.cell(row, qrColumn)
            .string(qr.qrcode_string)
            .style({
              alignment: { horizontal: 'center', vertical: 'center' },
              font: { size: 11 },
            });

          ws.cell(row, 1).number(qr.id ?? 0);
          ws.cell(row, 2).string(qr.product_name);
          ws.cell(row, 3).number(qr.points);
          ws.cell(row, 4).string('Pending');
          ws.cell(row, 5).number(qr.batch_no);
          qrIndex++;
        }
      }
    }

    const buffer = await wb.writeToBuffer();
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.ms-excel',
        'Content-Disposition': `attachment; filename="QR-Codes-${divideIn}-Columns.xls"`,
      },
    });
  } catch (error: any) {
    console.error('Excel API Error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { status: false, error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { status: false, error: 'Failed to generate Excel file' },
      { status: 500 }
    );
  }
}
