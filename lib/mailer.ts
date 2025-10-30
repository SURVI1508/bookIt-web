import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ===== Types =====
export interface ProductDetails {
  title: string;
  slug?: string;
  price: {
    basePrice: number;
    currency: string;
  };
}

export async function sendOTP(to: string, otp: string): Promise<void> {
  const mailOptions = {
    from: `"Blog Platform" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your OTP Code",
    html: `
      <div style="font-family: sans-serif;">
        <h2>Verify Your Email</h2>
        <p>Your OTP is:</p>
        <h1 style="color: #2c3e50;">${otp}</h1>
        <p>This OTP will expire in 10 minutes.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ OTP email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Error sending OTP email:", error);
    throw new Error("Could not send OTP email");
  }
}

export async function sendOrderConfirmation(
  to: string,
  product: ProductDetails,
  name: string,
  date: string,
  time: string,
  qty: number
): Promise<void> {
  const mailOptions = {
    from: `"BookIt: Experiences & Slots" <${process.env.EMAIL_USER}>`,
    to,
    subject: "🎉 Your Booking is Confirmed!",
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f7f7f7; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div style="background: #2c3e50; color: #fff; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Booking Confirmed 🎟️</h1>
          </div>
          <div style="padding: 25px;">
            <h2 style="color: #2c3e50;">Hi ${name || "there"}!</h2>
            <p>Thank you for booking with <strong>BookIt</strong>. Your booking has been successfully confirmed.</p>

            <h3 style="margin-top: 25px; color: #16a085;">Booking Details:</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Experience:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${
                  product.title
                }</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Date:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${new Date(
                  date
                ).toDateString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Time Slot:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${time}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Price:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">
                  ${product.price.currency} ${(
      product.price.basePrice * qty
    ).toFixed(2)}
                </td>
              </tr>
            </table>

            <p style="margin-top: 20px;">Please arrive at least <strong>15 minutes</strong> before your scheduled slot. If you have any questions, feel free to reply to this email.</p>
            <p>We look forward to hosting you!</p>

            <div style="margin-top: 30px; text-align: center;">
              <a href="${product.slug ? product.slug : "#"}" 
                 style="background: #16a085; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 5px;">
                View Booking
              </a>
            </div>
          </div>
          <div style="background: #f1f1f1; padding: 15px; text-align: center; color: #888; font-size: 13px;">
            © ${new Date().getFullYear()} BookIt. All rights reserved.
          </div>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Booking confirmation sent:", info.messageId);
  } catch (error) {
    console.error("❌ Error sending booking email:", error);
    throw new Error("Could not send booking confirmation email");
  }
}

// ✅ Used only in dev/test mode
export function isMasterOTP(entered: string): boolean {
  return entered === process.env.MASTER_OTP;
}
