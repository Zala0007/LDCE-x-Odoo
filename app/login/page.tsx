import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { loginAction } from "@/app/actions/auth-actions";
import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/auth-form";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ reset?: string }> }) {
  if (await auth()) redirect("/trips");
  const { reset } = await searchParams;
  return (
    <AuthCard eyebrow="Welcome back" title="Your next story starts here." description="Log in to continue planning your journeys." footer={<p>New to GlobeTrotter? <Link href="/signup">Create an account</Link></p>}>
      {reset === "success" ? <p className="form-success">Password updated. You can log in now.</p> : null}
      <LoginForm action={loginAction} />
    </AuthCard>
  );
}
