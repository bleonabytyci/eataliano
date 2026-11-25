
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

const allowedStatuses = [
  "pending",
  "preparing",
  "completed",
  "cancelled",
];

export async function PATCH(request: Request) {
  try {
    // Kontrollimi i konfigurimit te adminit
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { success: false, message: "Admin password is not configured." },
        { status: 500 }
      );
    }

    // Verifikimi i sesionit te administratorit
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

    // Leximi dhe validimi i te dhenave
    const body = await request.json();
    const orderId = Number(body.orderId);
    const status = body.status;

    if (!Number.isInteger(orderId) || orderId <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid order ID." },
        { status: 400 }
      );
    }

    if (
      typeof status !== "string" ||
      !allowedStatuses.includes(status)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid order status." },
        { status: 400 }
      );
    }

    // Ruajtja e statusit te ri ne databaze
    const result = await sql`
      UPDATE orders
      SET status = ${status}
      WHERE id = ${orderId}
      RETURNING id, status
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order status updated successfully.",
      order: result[0],
    });
  } catch (error) {
    console.error("Order status update error:", error);

    return NextResponse.json(
      { success: false, message: "Could not update order status." },
      { status: 500 }
    );
  }
}
