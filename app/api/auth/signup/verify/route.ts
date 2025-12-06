import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { PendingSignup } from "@/lib/models/PendingSignup";
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
    const otpResult = await verifyOtp(email.toLowerCase(), "signup", otp);
    if (!otpResult.success) {
      return NextResponse.json(
        { error: otpResult.error || "Invalid OTP" },
        { status: 400 }
      );
    }

    await connectDB();

    // Get pending signup data
    const pending = await PendingSignup.findOne({ email: email.toLowerCase() });
    if (!pending) {
      return NextResponse.json(
        { error: "Signup session expired. Please start over." },
        { status: 400 }
      );
    }

    // Create user
    const newUser = await User.create({
      email: pending.email,
      password: pending.passwordHash,
      username: pending.username,
      displayName: pending.displayName,
      isVerified: true,
      emailVerified: true,
      empathyScore: 100,
      totalDemerits: 0,
      demeritPoints: 0,
      isSuspended: false,
    });

    // Delete pending signup
    await PendingSignup.deleteOne({ _id: pending._id });

    // Create session
    const token = generateToken({
      userId: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role,
    });

    // Set session cookie on response
    const response = NextResponse.json({
      success: true,
      message: "Account created successfully",
      token: token, // Also return token for client-side storage (for Authorization headers)
      user: {
        id: newUser._id,
        email: newUser.email,
        username: newUser.username,
        displayName: newUser.displayName,
      },
    });

    setSessionCookie(token, response);
    return response;
  } catch (error: any) {
    console.error("[SIGNUP/VERIFY] Error:", error);
    return NextResponse.json(
      { error: error.message || "Verification failed" },
      { status: 500 }
    );
  }
}
