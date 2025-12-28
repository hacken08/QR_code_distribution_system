/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import * as z from "zod";
import XLS from "xlsjs";

const payloadSchema = z.object({
  qrCodes: z.array(
    z.object({
      id: z.number().optional(),
      product_name: z.string(),
      product_id: z.number(),
      batch_no: z.number(),
      qrcode_string: z.string(),
      points: z.number(),
    })
  ),
  divideIn: z.number().min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { qrCodes, divideIn } = payloadSchema.parse(body);

    const fixedHeaders = [
      "ID",
      "Product Name",
      "Points",
      "Status",
      "Batch No.",
    ];

    const qrHeaders = Array.from(
      { length: divideIn },
      (_, i) => `QR Code ${i + 1}`
    );

    const headers = [...fixedHeaders, ...qrHeaders];

    const rows: any[][] = [];
    rows.push(headers);

    const rowsPerColumn = Math.ceil(qrCodes.length / divideIn);
    let qrIndex = 0;

    for (let r = 0; r < rowsPerColumn; r++) {
      const row: any[] = [];

      const qr = qrCodes[qrIndex];
      if (!qr) break;

      // Fixed columns
      row.push(
        qr.id ?? 0,
        qr.product_name,
        qr.points,
        "Pending",
        qr.batch_no
      );

      // QR columns
      for (let c = 0; c < divideIn; c++) {
        const qrItem = qrCodes[qrIndex];
        row.push(qrItem ? qrItem.qrcode_string : "");
        qrIndex++;
      }

      rows.push(row);
    }

    const worksheet = XLS.utils.aoa_to_sheet(rows);
    const workbook = XLS.utils.book_new();
    XLS.utils.book_append_sheet(workbook, worksheet, "QR Codes");

    const buffer = XLS.write(workbook, {
      type: "buffer",
      bookType: "xls",
    });

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.ms-excel",
        "Content-Disposition":
          'attachment; filename="QR-Codes.xls"',
      },
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { status: false, error: "Excel generation failed" },
      { status: 500 }
    );
  }
}
