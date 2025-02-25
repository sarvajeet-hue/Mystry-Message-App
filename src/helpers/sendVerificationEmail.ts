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
