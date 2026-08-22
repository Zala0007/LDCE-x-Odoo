"use client";

import { useActionState } from "react";
import type { ActionState } from "@/lib/action-state";
import { initialActionState } from "@/lib/action-state";
import { FormField } from "@/components/ui/form-field";
import { SubmitButton } from "@/components/ui/submit-button";

export function ShareUserForm({ action }: { action: (state: ActionState, formData: FormData) => Promise<ActionState> }) {
  const [state, formAction] = useActionState(action, initialActionState);
  return <form action={formAction} className="share-user-form">{state.message ? <p className={state.success ? "form-success" : "form-alert"}>{state.message}</p> : null}<FormField label="Registered email" name="email" type="email" placeholder="friend@example.com" error={state.fieldErrors?.email?.[0]} required /><label className="field"><span className="field-label">Permission</span><select name="role" defaultValue="VIEWER"><option value="VIEWER">Viewer — read only</option><option value="EDITOR">Editor — can collaborate</option></select></label><SubmitButton>Share trip</SubmitButton></form>;
}
