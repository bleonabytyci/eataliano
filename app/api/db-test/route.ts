
import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await sql`SELECT NOW() AS server_time`;

    return NextResponse.json({
      success: true,
      message: "Database connection successful!",
      serverTime: result[0].server_time,
    });
  } catch (error) {
    console.error("Database connection error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed.",
      },
      { status: 500 }
    );
  }
}
