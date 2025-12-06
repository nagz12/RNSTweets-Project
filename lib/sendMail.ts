import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    const host = process.env.EMAIL_HOST;
    const port = Number(process.env.EMAIL_PORT || "587");
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!host || !user || !pass) {
      throw new Error("Email credentials are not configured on the server");
    }

    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }
  return transporter;
}

export async function sendOtpEmail(
  to: string,
  otp: string,
  purpose: "signup" | "login"
): Promise<void> {
  const subject =
    purpose === "signup"
      ? "Verify your RNSTweets account"
      : "Login to RNSTweets";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>${subject}</h2>
      <p>Your one-time password is:</p>
      <h1 style="font-size: 32px; letter-spacing: 2px; color: #1DA1F2; font-weight: bold;">
        ${otp}
      </h1>
      <p>This code expires in 10 minutes.</p>
      <p style="color: #666; font-size: 12px;">
        If you did not request this code, please ignore this email.
      </p>
    </div>
  `;

  const emailFrom = process.env.EMAIL_FROM || process.env.EMAIL_USER;
  const transporterInstance = getTransporter();

  await transporterInstance.sendMail({
    from: emailFrom,
    to,
    subject,
    html,
  });
}

export default sendOtpEmail;
