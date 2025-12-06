import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { createAndSendOtp } from "@/lib/otp";
import bcryptjs from "bcryptjs";

const DOMAIN = "@rnsit.ac.in";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (!email.endsWith(DOMAIN)) {
      return NextResponse.json(
        { error: `Only ${DOMAIN} emails are allowed` },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { error: "Account not found. Please sign up first." },
        { status: 400 }
      );
    }

    // Check if email verified
    if (!user.isVerified) {
      return NextResponse.json(
        { error: "Please verify your email via signup first" },
        { status: 400 }
      );
    }

    // Check if suspended
    if (user.isSuspended) {
      return NextResponse.json(
        { error: "Your account is suspended due to low empathy score." },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Send OTP
    const otpResult = await createAndSendOtp(email.toLowerCase(), "login");
    if (!otpResult.success) {
      return NextResponse.json(
        { error: otpResult.error || "Failed to send OTP" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent to your email",
      email: email.toLowerCase(),
    });
  } catch (error: any) {
    console.error("[LOGIN/START] Error:", error);
    return NextResponse.json(
      { error: error.message || "Login failed" },
      { status: 500 }
    );
  }
}
