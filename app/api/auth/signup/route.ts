import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { generateToken } from "@/lib/auth";
import bcryptjs from "bcryptjs";
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, username, displayName } = body;
    if (!email.endsWith("@rnsit.ac.in")) {
      return NextResponse.json(
        { error: "Only @rnsit.ac.in emails are allowed" },
        { status: 400 }
      );
    }
    await connectDB();
    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 400 }
      );
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      username,
      displayName,
      isVerified: true,
    });
    const token = generateToken({
      userId: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role,
    });
    return NextResponse.json({
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        username: newUser.username,
        displayName: newUser.displayName,
      },
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: error.message || "Signup failed" },
      { status: 500 }
    );
  }
}
