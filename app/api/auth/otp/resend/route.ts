import { NextRequest, NextResponse } from "next/server";
import { resendOtp } from "@/lib/otp";

export async function POST(request: NextRequest) {
  try {
    const { email, purpose } = await request.json();

    if (!email || !purpose) {
      return NextResponse.json(
        { error: "Email and purpose are required" },
        { status: 400 }
      );
    }

    if (!["signup", "login"].includes(purpose)) {
      return NextResponse.json(
        { error: "Invalid purpose" },
        { status: 400 }
      );
    }

    const result = await resendOtp(email, purpose as "signup" | "login");

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to resend OTP" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "OTP resent successfully",
      email,
    });
  } catch (error) {
    console.error("OTP resend error:", error);
    return NextResponse.json(
      { error: "Failed to resend OTP" },
      { status: 500 }
    );
  }
}
