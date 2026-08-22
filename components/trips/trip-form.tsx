"use client";

import Link from "next/link";
import {
  CalendarDays,
  Compass,
  Image as ImageIcon,
  IndianRupee,
  Sparkles,
} from "lucide-react";
import { useActionState } from "react";
import { useState } from "react";
import type { ActionState } from "@/lib/action-state";
import { initialActionState } from "@/lib/action-state";
import { FormField, TextAreaField } from "@/components/ui/form-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { formatCurrency } from "@/lib/utils";

type FormTrip = {
  name: string;
  description: string | null;
  startDate: Date;
  endDate: Date;
  coverImage: string | null;
  budget: number | null;
};
type TripAction = (
  state: ActionState,
  formData: FormData,
) => Promise<ActionState>;
type SuggestedCity = {
  id: string;
  name: string;
  country: string;
  image: string;
  estimatedStayCost: number;
};

function inputDate(date?: Date) {
  return date ? date.toISOString().slice(0, 10) : "";
}

export function TripForm({
  action,
  trip,
  suggestedCities = [],
}: {
  action: TripAction;
  trip?: FormTrip;
  suggestedCities?: SuggestedCity[];
}) {
  const [state, formAction] = useActionState(action, initialActionState);
  const [initialCityId, setInitialCityId] = useState("");
  return (
    <form action={formAction} className="trip-form" noValidate>
      {state.message ? (
        <p className="form-alert trip-form-alert" role="alert">
          {state.message}
        </p>
      ) : null}
      <section className="form-section">
        <div className="form-section-heading">
          <span>
            <Sparkles size={19} />
          </span>
          <div>
            <h2>Give your journey a name</h2>
            <p>Something that brings the adventure to life.</p>
          </div>
        </div>
        <FormField
          label="Trip name"
          name="name"
          defaultValue={trip?.name}
          placeholder="Monsoon roads & mountain mornings"
          error={state.fieldErrors?.name?.[0]}
          required
        />
        <TextAreaField
          label="Description (optional)"
          name="description"
          defaultValue={trip?.description ?? ""}
          rows={4}
          placeholder="What are you hoping to discover?"
          error={state.fieldErrors?.description?.[0]}
        />
      </section>
      {!trip && suggestedCities.length ? (
        <section className="form-section starting-city-section">
          <div className="form-section-heading">
            <span>
              <Compass size={19} />
            </span>
            <div>
              <h2>Choose a starting place</h2>
              <p>
                Optional. We will create the first itinerary section for you.
              </p>
            </div>
          </div>
          <label className="field">
            <span className="field-label">Starting city</span>
            <select
              name="initialCityId"
              value={initialCityId}
              onChange={(event) => setInitialCityId(event.target.value)}
            >
              <option value="">I will choose later</option>
              {suggestedCities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}, {city.country}
                </option>
              ))}
            </select>
            {state.fieldErrors?.initialCityId?.[0] ? (
              <span className="field-error">
                {state.fieldErrors.initialCityId[0]}
              </span>
            ) : null}
          </label>
          <div className="starting-city-grid">
            {suggestedCities.map((city) => (
              <button
                aria-pressed={initialCityId === city.id}
                className={
                  initialCityId === city.id
                    ? "starting-city-card selected"
                    : "starting-city-card"
                }
                key={city.id}
                onClick={() => setInitialCityId(city.id)}
                type="button"
                style={{
                  backgroundImage: `linear-gradient(0deg,rgba(8,31,25,.78),transparent),url(${city.image})`,
                }}
              >
                <span>{city.country}</span>
                <strong>{city.name}</strong>
                <small>
                  Stay from {formatCurrency(city.estimatedStayCost)}
                </small>
              </button>
            ))}
          </div>
        </section>
      ) : null}
      <section className="form-section">
        <div className="form-section-heading">
          <span>
            <CalendarDays size={19} />
          </span>
          <div>
            <h2>When are you going?</h2>
            <p>Choose the outer dates; stops come next.</p>
          </div>
        </div>
        <div className="form-grid">
          <FormField
            label="Start date"
            name="startDate"
            type="date"
            defaultValue={inputDate(trip?.startDate)}
            error={state.fieldErrors?.startDate?.[0]}
            required
          />
          <FormField
            label="End date"
            name="endDate"
            type="date"
            defaultValue={inputDate(trip?.endDate)}
            error={state.fieldErrors?.endDate?.[0]}
            required
          />
        </div>
      </section>
      <section className="form-section">
        <div className="form-section-heading">
          <span>
            <IndianRupee size={19} />
          </span>
          <div>
            <h2>Set a comfortable budget</h2>
            <p>Optional now. You can refine the breakdown later.</p>
          </div>
        </div>
        <FormField
          label="Total budget (INR)"
          name="budget"
          type="number"
          min="1"
          step="1"
          defaultValue={trip?.budget ?? ""}
          placeholder="75000"
          error={state.fieldErrors?.budget?.[0]}
        />
      </section>
      <section className="form-section">
        <div className="form-section-heading">
          <span>
            <ImageIcon size={19} />
          </span>
          <div>
            <h2>Add a cover moment</h2>
            <p>Use a hosted photo URL to make this trip unmistakably yours.</p>
          </div>
        </div>
        <FormField
          label="Cover photo URL (optional)"
          name="coverImage"
          type="url"
          defaultValue={trip?.coverImage ?? ""}
          placeholder="https://images.example.com/your-trip.jpg"
          error={state.fieldErrors?.coverImage?.[0]}
        />
      </section>
      <div className="form-actions">
        <Link
          className="button button-secondary"
          href={trip ? `/trips` : "/trips"}
        >
          Cancel
        </Link>
        <SubmitButton>{trip ? "Save changes" : "Create trip"}</SubmitButton>
      </div>
    </form>
  );
}
