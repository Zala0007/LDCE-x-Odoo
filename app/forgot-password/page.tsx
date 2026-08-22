import Link from "next/link";
import { forgotPasswordAction } from "@/app/actions/auth-actions";
import { AuthCard } from "@/components/auth/auth-card";
import { ForgotPasswordForm } from "@/components/auth/auth-form";

export default function ForgotPasswordPage() {
  return (
    <AuthCard eyebrow="Account recovery" title="Find your way back." description="Enter your email and we'll prepare a secure, time-limited reset link." footer={<p>Remembered it? <Link href="/login">Back to login</Link></p>}>
      <ForgotPasswordForm action={forgotPasswordAction} />
    </AuthCard>
  );
}
