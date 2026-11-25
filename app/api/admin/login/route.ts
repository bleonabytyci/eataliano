
import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";

function krijoToken(password: string) {
  return createHmac("sha256", password)
    .update("eataliano-admin-session")
    .digest("hex");
}

export async function POST(request: Request) {
  try {
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
      return NextResponse.json(
        { success: false, message: "Incorrect password." },
        { status: 401 }
      );
    }

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
