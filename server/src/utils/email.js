import nodemailer from "nodemailer";

export const sendMail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,   // your gmail
      pass: process.env.MAIL_PASS,   // app password
    },
  });

  await transporter.sendMail({
    from: `"Job Portal" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
  });

  console.log("Email sent to:", to);
};
