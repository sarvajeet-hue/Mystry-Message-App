import { resend } from "@/lib/resend";
import {
  Font,
  Head,
  Heading,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

interface verificationEmailProps {
  username: string;
  otp: string;
}

export const verificationEmail = ({
  username,
  otp,
}: verificationEmailProps) => {
  return (
    <Html lang="en">
      <Head>
        <title>Verification Code</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
        />
      </Head>
      <Preview>Here is your Verification Code : {otp}</Preview>
      <Section>
        <Row>
          <Heading as="h2">Hello {username}</Heading>
        </Row>
        <Row>
          <Text>Thank you for registering. Please use the following verification code to complete your registrations.</Text>
        </Row>
        <Row>
          <Text>{otp}</Text>
        </Row>

      </Section>
    </Html>
  );
};
