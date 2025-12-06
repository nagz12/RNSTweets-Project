"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

const DOMAIN = "@rnsit.ac.in";

type Step = "credentials" | "otp";

interface FormErrors {
  name?: string;
  email?: string;
  username?: string;
  password?: string;
  otp?: string;
  general?: string;
}

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("credentials");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Credentials step
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // OTP step
  const [otp, setOtp] = useState("");
  const [otpEmail, setOtpEmail] = useState("");

  const validateEmail = (e: string) => {
    if (!e.endsWith(DOMAIN)) {
      return `Only ${DOMAIN} emails allowed`;
    }
    return "";
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Client-side validation
    const newErrors: FormErrors = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else {
      const emailError = validateEmail(email);
      if (emailError) newErrors.email = emailError;
    }
    if (!username.trim()) newErrors.username = "Username is required";
    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          username: username.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ general: data.error || "Signup failed" });
        return;
      }

      setOtpEmail(data.email);
      setStep("otp");
    } catch (err) {
      setErrors({ general: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!otp || otp.length !== 6) {
      setErrors({ otp: "Please enter a 6-digit code" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: otpEmail,
          otp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ general: data.error || "Verification failed" });
        return;
      }

      // Store token in localStorage for API calls (session cookie is HTTP-only)
      if (data.token) {
        localStorage.setItem("auth-token", data.token);
      }
      
      
      router.push("/feed");
    } catch (err) {
      setErrors({ general: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: otpEmail,
          purpose: "signup",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setErrors({ general: "OTP resent successfully" });
      } else {
        setErrors({ general: data.error || "Failed to resend OTP" });
      }
    } catch (err) {
      setErrors({ general: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800 rounded-lg shadow-2xl p-8 border border-slate-700">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">RNSTweets</h1>
          <p className="text-slate-400">Join the community</p>
        </div>

        {/* Credentials Step */}
        {step === "credentials" && (
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                placeholder="John Doe"
                className={`w-full px-4 py-2 border rounded-lg bg-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${
                  errors.name
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-600 focus:ring-blue-500"
                }`}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                placeholder={`your.name${DOMAIN}`}
                className={`w-full px-4 py-2 border rounded-lg bg-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-600 focus:ring-blue-500"
                }`}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errors.username) setErrors({ ...errors, username: undefined });
                }}
                placeholder="john_doe"
                className={`w-full px-4 py-2 border rounded-lg bg-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${
                  errors.username
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-600 focus:ring-blue-500"
                }`}
              />
              {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: undefined });
                  }}
                  placeholder="At least 8 characters"
                  className={`w-full px-4 py-2 border rounded-lg bg-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 pr-10 ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-slate-600 focus:ring-blue-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              <p className="text-xs text-slate-400 mt-2">
                • At least 8 characters<br/>
                • Uppercase & lowercase letters<br/>
                • At least one number
              </p>
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-700 rounded-lg">
                <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-400">{errors.general}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Sending OTP..." : "Continue"}
            </button>
          </form>
        )}

        {/* OTP Step */}
        {step === "otp" && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div className="mb-6 text-center">
                <p className="text-sm text-slate-300 mb-2">OTP sent to <strong className="text-white">{otpEmail}</strong></p>
                <p className="text-xs text-slate-400">Check your email for a 6-digit code (valid for 10 minutes)</p>
              </div>

            {/* OTP Input */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">Enter OTP Code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setOtp(val);
                  if (errors.otp) setErrors({ ...errors, otp: undefined });
                }}
                placeholder="000000"
                maxLength={6}
                className={`w-full px-4 py-2 border rounded-lg text-center text-2xl tracking-widest font-mono bg-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${
                  errors.otp
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-600 focus:ring-blue-500"
                }`}
              />
              {errors.otp && <p className="text-xs text-red-500 mt-1">{errors.otp}</p>}
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-700 rounded-lg">
                <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-400">{errors.general}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Verifying..." : "Verify & Sign Up"}
            </button>

            {/* Resend OTP */}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={loading}
              className="w-full text-blue-400 hover:text-blue-300 text-sm font-medium disabled:opacity-50"
            >
              Resend OTP
            </button>

            {/* Back Button */}
            <button
              type="button"
              onClick={() => {
                setStep("credentials");
                setOtp("");
                setErrors({});
              }}
              className="w-full text-slate-400 hover:text-slate-200 text-sm font-medium"
            >
              ← Back
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
