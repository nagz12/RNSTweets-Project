import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { verifyOtp } from "@/lib/otp";
import { generateToken, setSessionCookie } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // Verify OTP
    const otpResult = await verifyOtp(email.toLowerCase(), "login", otp);
    if (!otpResult.success) {
      return NextResponse.json(
        { error: otpResult.error || "Invalid OTP" },
        { status: 400 }
      );
    }

    await connectDB();

    // Fetch user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 400 }
      );
    }

    // Re-check suspension as safety measure
    if (user.isSuspended) {
      return NextResponse.json(
        { error: "Your account is suspended due to low empathy score." },
        { status: 403 }
      );
    }

    // Create session
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Set session cookie on response
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      token: token, // Also return token for client-side storage (for Authorization headers)
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
      },
    });

    setSessionCookie(token, response);
    return response;
  } catch (error: any) {
    console.error("[LOGIN/VERIFY] Error:", error);
    return NextResponse.json(
      { error: error.message || "Verification failed" },
      { status: 500 }
    );
  }
}
