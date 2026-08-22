"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { ActionState } from "@/lib/action-state";
import { initialActionState } from "@/lib/action-state";
import { FormField, TextAreaField } from "@/components/ui/form-field";
import { SubmitButton } from "@/components/ui/submit-button";

type AuthAction = (state: ActionState, formData: FormData) => Promise<ActionState>;

export function LoginForm({ action }: { action: AuthAction }) {
  const [state, formAction] = useActionState(action, initialActionState);
  return (
    <form action={formAction} className="auth-form" noValidate>
      {state.message ? <p className="form-alert" role="alert">{state.message}</p> : null}
      <FormField label="Email address" name="email" type="email" autoComplete="email" placeholder="you@example.com" error={state.fieldErrors?.email?.[0]} required />
      <FormField label="Password" name="password" type="password" autoComplete="current-password" placeholder="Your password" error={state.fieldErrors?.password?.[0]} required />
      <div className="auth-form-row"><Link href="/forgot-password">Forgot password?</Link></div>
      <SubmitButton className="button-block">Log in</SubmitButton>
    </form>
  );
}

export function SignupForm({ action }: { action: AuthAction }) {
  const [state, formAction] = useActionState(action, initialActionState);
  return (
    <form action={formAction} className="auth-form" noValidate>
      {state.message ? <p className="form-alert" role="alert">{state.message}</p> : null}
      <div className="form-grid">
        <FormField label="First name" name="firstName" autoComplete="given-name" placeholder="Aarav" error={state.fieldErrors?.firstName?.[0]} required />
        <FormField label="Last name" name="lastName" autoComplete="family-name" placeholder="Patel" error={state.fieldErrors?.lastName?.[0]} required />
      </div>
      <FormField label="Email address" name="email" type="email" autoComplete="email" placeholder="you@example.com" error={state.fieldErrors?.email?.[0]} required />
      <FormField label="Phone number (optional)" name="phone" type="tel" autoComplete="tel" placeholder="+91 98765 43210" error={state.fieldErrors?.phone?.[0]} />
      <div className="form-grid">
        <FormField label="City (optional)" name="city" autoComplete="address-level2" placeholder="Ahmedabad" error={state.fieldErrors?.city?.[0]} />
        <FormField label="Country (optional)" name="country" autoComplete="country-name" placeholder="India" error={state.fieldErrors?.country?.[0]} />
      </div>
      <FormField label="Profile photo URL (optional)" name="image" type="url" placeholder="https://images.example.com/me.jpg" error={state.fieldErrors?.image?.[0]} />
      <TextAreaField label="Additional information (optional)" name="bio" rows={3} placeholder="Tell us a little about how you like to travel." error={state.fieldErrors?.bio?.[0]} />
      <FormField label="Password" name="password" type="password" autoComplete="new-password" placeholder="8+ characters" hint="Use uppercase, lowercase and a number." error={state.fieldErrors?.password?.[0]} required />
      <FormField label="Confirm password" name="confirmPassword" type="password" autoComplete="new-password" placeholder="Repeat your password" error={state.fieldErrors?.confirmPassword?.[0]} required />
      <SubmitButton className="button-block">Create my account</SubmitButton>
    </form>
  );
}

export function ForgotPasswordForm({ action }: { action: AuthAction }) {
  const [state, formAction] = useActionState(action, initialActionState);
  return (
    <form action={formAction} className="auth-form" noValidate>
      {state.message ? <p className={state.success ? "form-success" : "form-alert"} role="status">{state.message}</p> : null}
      {state.resetPath ? <Link className="dev-reset-link" href={state.resetPath}>Open development reset link →</Link> : null}
      <FormField label="Email address" name="email" type="email" autoComplete="email" placeholder="you@example.com" error={state.fieldErrors?.email?.[0]} required />
      <SubmitButton className="button-block">Prepare reset link</SubmitButton>
    </form>
  );
}

export function ResetPasswordForm({ action, token }: { action: AuthAction; token: string }) {
  const [state, formAction] = useActionState(action, initialActionState);
  return (
    <form action={formAction} className="auth-form" noValidate>
      <input type="hidden" name="token" value={token} />
      {state.message ? <p className="form-alert" role="alert">{state.message}</p> : null}
      <FormField label="New password" name="password" type="password" autoComplete="new-password" placeholder="8+ characters" error={state.fieldErrors?.password?.[0]} required />
      <FormField label="Confirm password" name="confirmPassword" type="password" autoComplete="new-password" placeholder="Repeat your password" error={state.fieldErrors?.confirmPassword?.[0]} required />
      <SubmitButton className="button-block">Set new password</SubmitButton>
    </form>
  );
}
