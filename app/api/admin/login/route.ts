
import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

function krijoToken(password: string) {
  return createHmac("sha256", password)
    .update("eataliano-admin-session")
    .digest("hex");
}

export async function POST(request: Request) {
  try {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ipAddress =
      forwardedFor?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip")?.trim() ||
      (process.env.NODE_ENV === "development" ? "local-development" : null);

    if (!ipAddress) {
      return NextResponse.json(
        { success: false, message: "Unable to verify login request." },
        { status: 503 }
      );
    }

    const lockRows = await sql`
      SELECT locked_until
      FROM admin_login_attempts
      WHERE ip_address = ${ipAddress}
        AND locked_until > NOW()
      LIMIT 1
    `;

    if (lockRows.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many failed attempts. Try again in 15 minutes.",
        },
        { status: 429 }
      );
    }

    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { success: false, message: "Admin password is not configured." },
        { status: 500 }
      );
    }

    if (typeof password !== "string") {
      return NextResponse.json(
        { success: false, message: "Invalid password." },
        { status: 401 }
      );
    }

    const passwordBuffer = Buffer.from(password);
    const adminBuffer = Buffer.from(adminPassword);

    const passwordIsCorrect =
      passwordBuffer.length === adminBuffer.length &&
      timingSafeEqual(passwordBuffer, adminBuffer);

    if (!passwordIsCorrect) {
      const attempts = await sql`
        INSERT INTO admin_login_attempts (
          ip_address,
          failed_attempts,
          window_started_at,
          updated_at
        )
        VALUES (${ipAddress}, 1, NOW(), NOW())
        ON CONFLICT (ip_address)
        DO UPDATE SET
          failed_attempts = CASE
            WHEN admin_login_attempts.window_started_at
              <= NOW() - INTERVAL '15 minutes'
            THEN 1
            ELSE admin_login_attempts.failed_attempts + 1
          END,
          window_started_at = CASE
            WHEN admin_login_attempts.window_started_at
              <= NOW() - INTERVAL '15 minutes'
            THEN NOW()
            ELSE admin_login_attempts.window_started_at
          END,
          locked_until = CASE
            WHEN admin_login_attempts.locked_until > NOW()
            THEN admin_login_attempts.locked_until
            WHEN (
              CASE
                WHEN admin_login_attempts.window_started_at
                  <= NOW() - INTERVAL '15 minutes'
                THEN 1
                ELSE admin_login_attempts.failed_attempts + 1
              END
            ) >= 5
            THEN NOW() + INTERVAL '15 minutes'
            ELSE NULL
          END,
          updated_at = NOW()
        RETURNING failed_attempts, locked_until
      `;

      const failedAttempts = Number(attempts[0].failed_attempts);

      return NextResponse.json(
        {
          success: false,
          message:
            failedAttempts >= 5
              ? "Too many failed attempts. Login is locked for 15 minutes."
              : "Incorrect password.",
        },
        { status: failedAttempts >= 5 ? 429 : 401 }
      );
    }

    await sql`
      DELETE FROM admin_login_attempts
      WHERE ip_address = ${ipAddress}
    `;

    const token = krijoToken(adminPassword);

    const response = NextResponse.json({
      success: true,
      message: "Admin login successful.",
    });

    response.cookies.set("eataliano_admin", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);

    return NextResponse.json(
      { success: false, message: "Login failed." },
      { status: 500 }
    );
  }
}
