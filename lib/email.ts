
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderStatusEmail(
  customerEmail: string,
  customerName: string,
  orderId: number,
  status: "completed" | "cancelled"
) {
  const isReady = status === "completed";

  const subject = isReady
    ? `Your Eataliano Order #${orderId} Is Ready!`
    : `Your Eataliano Order #${orderId} Has Been Cancelled`;

  const message = isReady
    ? "Great news! Your order is ready. Thank you for choosing Eataliano!"
    : "Unfortunately, your order has been cancelled. Please contact Eataliano if you have any questions.";

  try {
    const { data, error } = await resend.emails.send({
      from: "Eataliano <onboarding@resend.dev>",
      to: [customerEmail],
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; color: #284b36; background: #f0eee7; border-radius: 16px;">
          <h1 style="color: #284b36;">Eataliano</h1>
          <h2>Hello ${customerName},</h2>
          <p>${message}</p>
          <p><strong>Order Number: #${orderId}</strong></p>
          <p>Thank you for choosing Eataliano!</p>
          <p style="margin-top: 30px;">Eataliano Team</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend email error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, error };
  }
}
