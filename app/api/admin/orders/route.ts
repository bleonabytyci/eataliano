
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { success: false, message: "Admin password is not configured." },
        { status: 500 }
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("eataliano_admin")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access." },
        { status: 401 }
      );
    }

    const expectedToken = createHmac("sha256", adminPassword)
      .update("eataliano-admin-session")
      .digest("hex");

    const tokenBuffer = Buffer.from(token);
    const expectedBuffer = Buffer.from(expectedToken);

    const tokenIsValid =
      tokenBuffer.length === expectedBuffer.length &&
      timingSafeEqual(tokenBuffer, expectedBuffer);

    if (!tokenIsValid) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access." },
        { status: 401 }
      );
    }

    const orders = await sql`
      SELECT
        o.id,
        o.customer_name,
        o.customer_email,
        o.customer_phone,
        o.delivery_address,
        o.order_notes,
        o.total_amount,
        o.status,
        o.created_at,
        COALESCE(
          json_agg(
            json_build_object(
              'food_name', oi.food_name,
              'quantity', oi.quantity,
              'unit_price', oi.unit_price
            )
          ) FILTER (WHERE oi.id IS NOT NULL),
          '[]'::json
        ) AS items
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `;

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Admin orders error:", error);

    return NextResponse.json(
      { success: false, message: "Could not load orders." },
      { status: 500 }
    );
  }
}
