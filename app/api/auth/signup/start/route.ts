import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { PendingSignup } from "@/lib/models/PendingSignup";
import { createAndSendOtp } from "@/lib/otp";
import bcryptjs from "bcryptjs";

const DOMAIN = "@rnsit.ac.in";
const MIN_PASSWORD_LENGTH = 8;

function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { valid: false, error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: "Password must contain at least one uppercase letter" };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: "Password must contain at least one lowercase letter" };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: "Password must contain at least one number" };
  }
  return { valid: true };
}

function validateUsername(username: string): { valid: boolean; error?: string } {
  if (username.length < 3 || username.length > 30) {
    return { valid: false, error: "Username must be between 3 and 30 characters" };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { valid: false, error: "Username can only contain letters, numbers, and underscores" };
  }
  return { valid: true };
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, username, password } = await request.json();

    // Validate inputs
    if (!name || !email || !username || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (!email.endsWith(DOMAIN)) {
      return NextResponse.json(
        { error: `Only ${DOMAIN} emails are allowed` },
        { status: 400 }
      );
    }

    const usernameValidation = validateUsername(username);
    if (!usernameValidation.valid) {
      return NextResponse.json({ error: usernameValidation.error }, { status: 400 });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json({ error: passwordValidation.error }, { status: 400 });
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: "Account already exists. Please log in." },
        { status: 400 }
      );
    }

    // Check if username is taken
    const existingUsername = await User.findOne({ username: username.toLowerCase() });
    if (existingUsername) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcryptjs.hash(password, 10);

    // Store pending signup
    await PendingSignup.findOneAndUpdate(
      { email: email.toLowerCase() },
      {
        email: email.toLowerCase(),
        displayName: name,
        username: username.toLowerCase(),
        passwordHash,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
      },
      { upsert: true, new: true }
    );

    // Send OTP
    const otpResult = await createAndSendOtp(email.toLowerCase(), "signup");
    if (!otpResult.success) {
      return NextResponse.json(
        { error: otpResult.error || "Failed to send OTP" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent to your email. Please verify to complete signup.",
      email: email.toLowerCase(),
    });
  } catch (error: any) {
    console.error("[SIGNUP/START] Error:", error);
    return NextResponse.json(
      { error: error.message || "Signup failed" },
      { status: 500 }
    );
  }
}
