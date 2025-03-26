import { resend } from "@/lib/resend";

import verificationEmail  from "../../emails/VerificationEmail";
import { apiResponse } from "@/types/apiResponseType";

export const sendVerificationEmail = async (
  email: string,
  username: string,
  verifyCode: string
): Promise<apiResponse> => {
  try {
    await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: [email],
      subject: "Mystry message | Verification Code",
      react: verificationEmail({username , otp : verifyCode}),
    });

    return { success: true, message: 'Verification email sent successfully.' };
  } catch (error) {
    console.log("error sending verification email", error);
    return {
      success: false,
      message: "Failed to send email verification email",
    };
  }
};

// "use server";

// import nodemailer from "nodemailer";
// import { renderToStaticMarkup } from "react-dom/server";
// import verificationEmail  from "../../emails/VerificationEmail";

// export async function sendVerificationEmail(email: string, username: string, verifyCode: string) {
//   const transporter = nodemailer.createTransport({
//     host: "smtp.ethereal.email",
//     port: 587,
//     secure: false,
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   try {
//     // Convert JSX template to an HTML string
//     const emailHTML = renderToStaticMarkup(verificationEmail({ username, otp: verifyCode }));

//     await transporter.sendMail({
//       from: '"Maddison Foo Koch 👻" <krishnasingh296855925@gmail.com>',
//       to: email,
//       subject: "Mystery Message | Verification Code",
//       html: emailHTML,
//     });

//     return { success: true, message: "Verification email sent successfully." };
//   } catch (error) {
//     console.error("Error sending email:", error);
//     return { success: false, message: "Failed to send verification email" };
//   }
// }

