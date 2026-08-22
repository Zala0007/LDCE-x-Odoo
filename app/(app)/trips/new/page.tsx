import { createTripAction } from "@/app/actions/trip-actions";
import { PageHeader } from "@/components/page-header";
import { TripForm } from "@/components/trips/trip-form";
import { db } from "@/lib/db";

export default async function NewTripPage() {
  const suggestedCities = await db.city.findMany({
    orderBy: [{ popularityScore: "desc" }, { name: "asc" }],
    take: 6,
    select: {
      id: true,
      name: true,
      country: true,
      image: true,
      estimatedStayCost: true,
    },
  });
  return (
    <div className="form-page">
      <PageHeader
        eyebrow="A fresh adventure"
        title="Plan a new trip"
        description="Start with the big picture, choose a first place, and shape the details next."
      />
      <TripForm action={createTripAction} suggestedCities={suggestedCities} />
    </div>
  );
}
