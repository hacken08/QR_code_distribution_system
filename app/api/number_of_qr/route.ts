// app/api/number_of_qr/route.ts
"use server";

import { db } from "@/db/db";
import { NextResponse, NextRequest } from "next/server"; // Import NextRequest
import { z } from "zod";

// Schema for search parameters (we use z.coerce.number() because URL params are strings)
const searchParamsSchema = z.object({
    // Coerce the string param to a number, then validate it
    id: z.coerce.number().int().positive("Item code must be a positive number"),
});

export async function GET(request: NextRequest) { 
    try {
        const { searchParams } = request.nextUrl;
        const paramsObject = Object.fromEntries(searchParams.entries());
        console.log("{DEBUG} Received params: ", paramsObject);

        const parsed = searchParamsSchema.safeParse(paramsObject);
        if (!parsed.success) {
            console.log("{BAD REQ ERROR} At api/number_of_qr/ -> ", parsed.error);
            return NextResponse.json(
                {
                    error: "Validation failed for search parameters",
                    details: parsed.error.format(),
                },
                { status: 400 }
            );
        }
        const { id } = parsed.data;

        const stmt = db.prepare(`
            SELECT COUNT(*) as count
            FROM qrcodes
            WHERE product_id = ?
            AND is_used = 0
        `);

        // Assuming stmt.get works synchronously or within an appropriate context
        const result = stmt.get(id) as { count: number };

        // 4. Return clean response
        return NextResponse.json({
            success: true,
            data: { count: result.count, id  },
        }, { status: 200 });
    } catch (error) {
        console.error("[API ERROR] /api/get_available_qrcodes:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Internal server error",
            },
            { status: 500 }
        );
    }
}

