"use client";

import { useActionState } from "react";
import type { ActionState } from "@/lib/action-state";
import { initialActionState } from "@/lib/action-state";
import { FormField, TextAreaField } from "@/components/ui/form-field";
import { SubmitButton } from "@/components/ui/submit-button";

export function CommunityPostForm({ trips, action }: { trips: Array<{ id: string; name: string }>; action: (state: ActionState, formData: FormData) => Promise<ActionState> }) {
  const [state, formAction] = useActionState(action, initialActionState);
  return <form action={formAction} className="community-form">{state.message ? <p className={state.success ? "form-success" : "form-alert"}>{state.message}</p> : null}<FormField label="Story title" name="title" placeholder="What I learned from three days in Udaipur" error={state.fieldErrors?.title?.[0]} required /><TextAreaField label="Share an experience or helpful tip" name="content" rows={5} placeholder="Tell travelers what made the place special, what to plan ahead, and what you would do differently…" error={state.fieldErrors?.content?.[0]} required /><FormField label="Photo URL (optional)" name="image" type="url" placeholder="https://images.example.com/memory.jpg" error={state.fieldErrors?.image?.[0]} /><label className="field"><span className="field-label">Related trip (optional)</span><select name="tripId" defaultValue=""><option value="">No linked trip</option>{trips.map((trip) => <option key={trip.id} value={trip.id}>{trip.name}</option>)}</select></label><SubmitButton>Publish story</SubmitButton></form>;
}
