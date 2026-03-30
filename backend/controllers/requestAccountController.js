export const createRequestAccount = async (req, res) => {
  const { name, email, quickReply } = req.body;

  try {
    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      replyTo: email, // IMPORTANT: lets admin reply directly to user
      subject: "New Account Request",
      html: `
        <h2>New User Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p><strong>Quick Reply:</strong> ${quickReply ? "Yes" : "No"}</p>
      `,
    });
    res.status(200).json({ message: "Request sent successfully" });
  } catch (error) {
    console.error("Error sending request email:", error);
    res.status(500).json({ message: "Failed to send request" });
  }
};


// controllers/contactController.js (same file)

export const sendAccountCreatedEmail = async (userEmail, username) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Your Account Has Been Created",
    html: `
      <h2>Welcome ${username} 🎉</h2>
      <p>Your account has been created successfully.</p>
      <p>You can now log in.</p>
    `,
  });
};