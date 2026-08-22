import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { signupAction } from "@/app/actions/auth-actions";
import { AuthCard } from "@/components/auth/auth-card";
import { SignupForm } from "@/components/auth/auth-form";

export default async function SignupPage() {
  if (await auth()) redirect("/trips");
  return (
    <AuthCard eyebrow="Join the journey" title="Make the world your own." description="Create an account and turn travel ideas into thoughtful itineraries." footer={<p>Already have an account? <Link href="/login">Log in</Link></p>}>
      <SignupForm action={signupAction} />
    </AuthCard>
  );
}
