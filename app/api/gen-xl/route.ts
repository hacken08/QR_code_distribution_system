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

    /* ---------------- Build Excel Data ---------------- */
    const fixedHeaders = [
      "Id",
      "Product Name",
      "Points",
      "Status",
      "Batch No.",
    ];

    const qrHeaders = Array.from(
      { length: divideIn },
      (_, i) => `QR Code ${i + 1}`
    );

    const rows: any[][] = [[...fixedHeaders, ...qrHeaders]];
    const rowsPerColumn = Math.ceil(qrCodes.length / divideIn);
    let qrIndex = 0;

    for (let r = 0; r < rowsPerColumn; r++) {
      const qr = qrCodes[qrIndex];
      if (!qr) break;

      const row: any[] = [
        qr.id ?? 0,
        qr.product_name,
        qr.points,
        "Pending",
        qr.batch_no,
      ];

      for (let c = 0; c < divideIn; c++) {
        const q = qrCodes[qrIndex];
        row.push(q ? q.qrcode_string : "");
        qrIndex++;
      }

      rows.push(row);
    }

    /* ---------------- Create XLS ---------------- */
    const sheet = XLS.utils.aoa_to_sheet(rows);
    const book = XLS.utils.book_new();
    XLS.utils.book_append_sheet(book, sheet, "QR Codes");

    const buffer = XLS.write(book, {
      type: "buffer",
      bookType: "xls",
    });

    /* ---------------- Temp Files ---------------- */
    const tempDir = path.join(process.cwd(), "public");
    fs.mkdirSync(tempDir, { recursive: true });
    const rawFile = path.join(tempDir, "qr.xls");
    fs.writeFileSync(rawFile, buffer);

    /* ---------------- FORCE SAVE (CRITICAL PART) ---------------- */
    execSync(
      `soffice --headless --invisible "macro:///Standard.Module1.SaveAndClose(${rawFile.replace(
        /\\/g,
        "/"
      )})"`,
      { stdio: "ignore" }
    );

    /* ---------------- Return File ---------------- */
    const finalBuffer = fs.readFileSync(rawFile);
    return new NextResponse(finalBuffer, {
      headers: {
        "Content-Type": "application/vnd.ms-excel",
        "Content-Disposition": 'attachment; filename="QR-Codes.xls"',
      },
    });
  } catch (err: any) {
    console.error("Excel Error:", err);
    return NextResponse.json(
      { status: false, error: "Excel generation failed" },
      { status: 500 }
    );
  }
}
