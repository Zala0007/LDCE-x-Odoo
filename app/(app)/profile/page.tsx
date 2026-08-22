import Link from "next/link";
import { Bookmark, Map, Trash2 } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  deleteAccountAction,
  updateProfileAction,
} from "@/app/actions/product-actions";
import { DashboardTripCard } from "@/components/dashboard/dashboard-trip-card";
import { PageHeader } from "@/components/page-header";
import { ProfileForm } from "@/components/profile/profile-form";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { getProfile } from "@/lib/repositories/product-repository";
import { initials } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const profile = await getProfile(session.user.id);
  if (!profile) redirect("/login");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const plannedTrips = profile.ownedTrips.filter(
    (trip) => trip.endDate >= today,
  );
  const previousTrips = profile.ownedTrips.filter(
    (trip) => trip.endDate < today,
  );
  return (
    <>
      <PageHeader
        eyebrow="Your corner of the world"
        title="Profile & settings"
        description="Keep your identity, travel preferences, and saved inspiration up to date."
      />
      <div className="profile-layout">
        <aside className="profile-summary">
          <div
            className="profile-avatar"
            style={
              profile.image
                ? { backgroundImage: `url(${profile.image})` }
                : undefined
            }
          >
            {profile.image ? null : initials(profile.name)}
          </div>
          <h2>{profile.name}</h2>
          <p>{profile.bio || "Curious traveler, thoughtful planner."}</p>
          <span>
            {[profile.city, profile.country].filter(Boolean).join(", ") ||
              "Location not set"}
          </span>
          <div className="profile-counts">
            <article>
              <Map />
              <strong>{profile.ownedTrips.length}</strong>
              <small>Recent trips</small>
            </article>
            <article>
              <Bookmark />
              <strong>{profile.savedDestinations.length}</strong>
              <small>Saved places</small>
            </article>
          </div>
        </aside>
        <section className="profile-settings">
          <h2>Personal details</h2>
          <ProfileForm profile={profile} action={updateProfileAction} />
        </section>
      </div>
      {profile.ownedTrips.length ? (
        <section className="profile-trips" id="trip-collections">
          {plannedTrips.length ? (
            <div>
              <div className="section-heading">
                <div>
                  <p className="eyebrow">On your horizon</p>
                  <h2>Preplanned trips</h2>
                </div>
                <Link href="/trips?status=upcoming">View all →</Link>
              </div>
              <div className="profile-trip-grid">
                {plannedTrips.map((trip) => (
                  <DashboardTripCard key={trip.id} trip={trip} />
                ))}
              </div>
            </div>
          ) : null}
          {previousTrips.length ? (
            <div>
              <div className="section-heading">
                <div>
                  <p className="eyebrow">From your journal</p>
                  <h2>Previous trips</h2>
                </div>
                <Link href="/trips?status=completed">View all →</Link>
              </div>
              <div className="profile-trip-grid">
                {previousTrips.map((trip) => (
                  <DashboardTripCard key={trip.id} trip={trip} />
                ))}
              </div>
            </div>
          ) : null}
        </section>
      ) : null}
      {profile.savedDestinations.length ? (
        <section className="profile-saved">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Close at hand</p>
              <h2>Saved destinations</h2>
            </div>
            <Link href="/saved">View all →</Link>
          </div>
          <div>
            {profile.savedDestinations.slice(0, 5).map(({ city }) => (
              <Link
                href="/saved"
                key={city.id}
                style={{
                  backgroundImage: `linear-gradient(0deg,rgba(10,35,28,.7),transparent),url(${city.image})`,
                }}
              >
                <span>{city.country}</span>
                <strong>{city.name}</strong>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
      <section className="danger-zone">
        <div>
          <h2>Delete account</h2>
          <p>
            Permanently remove your profile, trips, itineraries, shares, and
            saved destinations.
          </p>
        </div>
        <ConfirmDialog
          title="Delete your GlobeTrotter account?"
          description="All of your data will be permanently removed. This cannot be undone."
          action={deleteAccountAction}
          trigger={
            <span>
              <Trash2 size={16} />
              Delete account
            </span>
          }
        />
      </section>
    </>
  );
}
