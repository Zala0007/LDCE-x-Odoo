import Link from "next/link";
import { resetPasswordAction } from "@/app/actions/auth-actions";
import { AuthCard } from "@/components/auth/auth-card";
import { ResetPasswordForm } from "@/components/auth/auth-form";

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = "" } = await searchParams;
  return (
    <AuthCard eyebrow="Secure reset" title="Choose a new password." description="Your reset link can be used only once and expires after 30 minutes." footer={<p><Link href="/login">Back to login</Link></p>}>
      {token ? <ResetPasswordForm action={resetPasswordAction} token={token} /> : <p className="form-alert">This reset link is incomplete. Request a new one.</p>}
    </AuthCard>
  );
}
