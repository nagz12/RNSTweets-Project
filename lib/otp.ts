import bcryptjs from "bcryptjs";
import { EmailOtp } from "./models/EmailOtp";
import { connectDB } from "./db";
import { sendOtpEmail } from "./sendMail";

const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

/**
 * Generate a random 6-digit OTP (100000-999999)
 */
export function generateOtpCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Hash an OTP code using bcrypt
 */
export async function hashOtpCode(code: string): Promise<string> {
  return bcryptjs.hash(code, 10);
}

/**
 * Compare OTP code with hash
 */
export async function compareOtpCode(code: string, hash: string): Promise<boolean> {
  return bcryptjs.compare(code, hash);
}

/**
 * Create and send OTP to email
 */
export async function createAndSendOtp(
  email: string,
  purpose: "signup" | "login"
): Promise<{ success: boolean; error?: string }> {
  try {
    await connectDB();

    const code = generateOtpCode();
    const codeHash = await hashOtpCode(code);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP
    await EmailOtp.create({
      email: email.toLowerCase(),
      codeHash,
      purpose,
      expiresAt,
      used: false,
    });

    // Send email
    await sendOtpEmail(email, code, purpose);

    console.log(`[OTP] Sent ${purpose} OTP to ${email}`);
    return { success: true };
  } catch (error: any) {
    console.error(`[OTP] Error creating/sending OTP: ${error.message}`);
    return { success: false, error: error.message || "Failed to send OTP" };
  }
}

/**
 * Verify OTP code
 */
export async function verifyOtp(
  email: string,
  purpose: "signup" | "login",
  code: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await connectDB();

    const otp = (await EmailOtp.findOne({
      email: email.toLowerCase(),
      purpose,
      used: false,
    })
      .sort({ createdAt: -1 })
      .lean()) as any;

    if (!otp) {
      return { success: false, error: "OTP not found or already used" };
    }

    if (new Date() > new Date(otp.expiresAt)) {
      return { success: false, error: "OTP has expired" };
    }

    const isValid = await compareOtpCode(code, otp.codeHash);
    if (!isValid) {
      return { success: false, error: "Invalid OTP code" };
    }

    // Mark as used
    await EmailOtp.updateOne({ _id: otp._id }, { used: true });

    console.log(`[OTP] Verified ${purpose} OTP for ${email}`);
    return { success: true };
  } catch (error: any) {
    console.error(`[OTP] Error verifying OTP: ${error.message}`);
    return { success: false, error: error.message || "Failed to verify OTP" };
  }
}

/**
 * Resend OTP (invalidate old ones and create new)
 */
export async function resendOtp(
  email: string,
  purpose: "signup" | "login"
): Promise<{ success: boolean; error?: string }> {
  try {
    await connectDB();

    // Invalidate old unused OTPs
    await EmailOtp.updateMany(
      { email: email.toLowerCase(), purpose, used: false },
      { used: true }
    );

    // Create and send new one
    return createAndSendOtp(email, purpose);
  } catch (error: any) {
    console.error(`[OTP] Error resending OTP: ${error.message}`);
    return { success: false, error: error.message || "Failed to resend OTP" };
  }
}
