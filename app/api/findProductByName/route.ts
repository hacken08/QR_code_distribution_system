// app/api/product_by_name/route.ts
"use server";

import { db } from "@/db/db";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";

// Schema for search params
const searchParamsSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(100, "Product name too long"),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const paramsObject = Object.fromEntries(searchParams.entries());

    console.log("{DEBUG} Received params: ", paramsObject);
    const parsed = searchParamsSchema.safeParse(paramsObject);

    if (!parsed.success) {
      console.log("{BAD REQ ERROR} At api/product_by_name -> ", parsed.error);
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed for search parameters",
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const { name } = parsed.data;
    const stmt = db.prepare(`
      SELECT *
      FROM products
      WHERE LOWER(product_name) LIKE LOWER(?)
    `);

    const products = stmt.all(`%${name.toLowerCase()}%`);
    return NextResponse.json( {
        success: true,
        data: {
          count: products.length,
          products,
        },
      }, { status: 200 }
    );
  } catch (error) {
    console.error("[API ERROR] /api/product_by_name:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
