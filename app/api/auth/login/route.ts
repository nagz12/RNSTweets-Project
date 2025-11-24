import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { generateToken } from "@/lib/auth";
import bcryptjs from "bcryptjs";
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
    await connectDB();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
    if (!user.isVerified) {
      return NextResponse.json(
        { error: "Email not verified" },
        { status: 403 }
      );
    }
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });
    return NextResponse.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: error.message || "Login failed" },
      { status: 500 }
    );
  }
}
