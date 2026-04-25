import transporter from "../config/mailer.js";

export const createRequestAccount = async (req, res) => {
  const { name, email, message, quickReply } = req.body;

 
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    console.log("Incoming request:", { name, email, message, quickReply });

    // ✅ 1. Send email to ADMIN
    const adminMail = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      replyTo: email,
      subject: "New Account Request",
      html: `
        <h2>New User Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p><strong>Quick Reply:</strong> ${quickReply ? "Yes" : "No"}</p>
      `,
    });

    console.log("Admin email sent:", adminMail.response);

  
    const userMail = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Account Request Received",
      html: `
      <div style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial, sans-serif;">
        <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:auto;background:#ffffff;border-radius:8px;overflow:hidden;">
          
          <tr>
            <td style="background:#0f172a;padding:20px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:22px;">Clinic Management System</h1>
            </td>
          </tr>

          <tr>
            <td style="padding:30px;">
              <h2>Hello ${name},</h2>

              <p style="color:#374151;">
                Thank you for requesting an account. We’ve received your request and will review it shortly.
              </p>

              <p style="color:#374151;">
                You’ll receive another email once your account is approved.
              </p>

              <div style="background:#f1f5f9;padding:15px;border-radius:6px;margin:20px 0;">
                📩 Contact email: <strong>${email}</strong>
              </div>

              <p>If this wasn’t you, just ignore this email.</p>

              <br/>

              <p>
                Best regards,<br/>
                <strong>Clinic Management Team</strong>
              </p>
            </td>
          </tr>

          <tr>
            <td style="background:#f9fafb;padding:15px;text-align:center;font-size:12px;color:#6b7280;">
              © ${new Date().getFullYear()} Clinic Management System
            </td>
          </tr>

        </table>
      </div>
      `,
    });

    console.log("User email sent:", userMail.response);

    // ✅ Final response
    res.status(200).json({
      success: true,
      message: "Request sent successfully",
    });

  } catch (error) {
    console.error("FULL EMAIL ERROR:", error); // 🔥 shows real issue

    res.status(500).json({
      success: false,
      message: "Failed to send request",
      error: error.message,
    });
  }
};