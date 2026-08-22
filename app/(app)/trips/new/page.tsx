import { createTripAction } from "@/app/actions/trip-actions";
import { PageHeader } from "@/components/page-header";
import { TripForm } from "@/components/trips/trip-form";

export default function NewTripPage() { return <div className="form-page"><PageHeader eyebrow="A fresh adventure" title="Plan a new trip" description="Start with the big picture. The beautiful details come next." /><TripForm action={createTripAction} /></div>; }
