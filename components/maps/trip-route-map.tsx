"use client";

import { differenceInCalendarDays, format } from "date-fns";
import {
  CalendarDays,
  LocateFixed,
  MapPin,
  MapPinned,
  Route,
  Sparkles,
  WalletCards,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Map as MapLibreMap, Marker } from "maplibre-gl";
import { routeDistanceKm, segmentDistancesKm } from "@/lib/maps/route-geometry";
import { formatCurrency } from "@/lib/utils";

export type RouteMapStop = {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  startDate: string;
  endDate: string;
  image: string;
  activityCount: number;
  estimatedCost: number;
};

export function TripRouteMap({
  tripName,
  stops,
}: {
  tripName: string;
  stops: RouteMapStop[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markerRefs = useRef<
    Array<{ marker: Marker; element: HTMLButtonElement }>
  >([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mapStatus, setMapStatus] = useState<
    "loading" | "ready" | "unavailable"
  >("loading");
  const points = useMemo(
    () => stops.map(({ latitude, longitude }) => ({ latitude, longitude })),
    [stops],
  );
  const segmentDistances = useMemo(() => segmentDistancesKm(points), [points]);
  const totalDistance = useMemo(() => routeDistanceKm(points), [points]);

  const fitRoute = useCallback(() => {
    const map = mapRef.current;
    if (!map || !stops.length) return;
    if (stops.length === 1) {
      map.flyTo({
        center: [stops[0].longitude, stops[0].latitude],
        zoom: 7,
        duration: 900,
      });
      return;
    }
    void import("maplibre-gl").then(({ LngLatBounds }) => {
      const bounds = stops.reduce(
        (result, stop) => result.extend([stop.longitude, stop.latitude]),
        new LngLatBounds(
          [stops[0].longitude, stops[0].latitude],
          [stops[0].longitude, stops[0].latitude],
        ),
      );
      map.fitBounds(bounds, {
        padding: { top: 90, right: 90, bottom: 90, left: 90 },
        maxZoom: 8,
        duration: 1000,
      });
    });
  }, [stops]);

  const focusStop = useCallback(
    (index: number) => {
      const stop = stops[index];
      if (!stop) return;
      setSelectedIndex(index);
      mapRef.current?.flyTo({
        center: [stop.longitude, stop.latitude],
        zoom: Math.max(mapRef.current.getZoom(), 6),
        duration: 950,
      });
    },
    [stops],
  );

  useEffect(() => {
    let disposed = false;
    if (!containerRef.current || !stops.length) return;
    setMapStatus("loading");
    const loadingTimeout = window.setTimeout(() => {
      if (!disposed) setMapStatus("unavailable");
    }, 12000);
    void import("maplibre-gl").then((maplibre) => {
      if (disposed || !containerRef.current) return;
      const map = new maplibre.Map({
        container: containerRef.current,
        style: "https://tiles.openfreemap.org/styles/liberty",
        center: [stops[0].longitude, stops[0].latitude],
        zoom: stops.length === 1 ? 7 : 2.2,
        pitch: 24,
        bearing: -8,
        attributionControl: false,
        cooperativeGestures: true,
      });
      mapRef.current = map;
      map.addControl(
        new maplibre.NavigationControl({ visualizePitch: true }),
        "top-right",
      );
      map.addControl(
        new maplibre.AttributionControl({ compact: true }),
        "bottom-right",
      );
      map.on("load", () => {
        if (disposed) return;
        window.clearTimeout(loadingTimeout);
        setMapStatus("ready");
        if (stops.length > 1) {
          map.addSource("trip-route", {
            type: "geojson",
            lineMetrics: true,
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: stops.map((stop) => [
                  stop.longitude,
                  stop.latitude,
                ]),
              },
            },
          });
          map.addLayer({
            id: "trip-route-shadow",
            type: "line",
            source: "trip-route",
            layout: { "line-cap": "round", "line-join": "round" },
            paint: {
              "line-color": "rgba(12,44,35,.22)",
              "line-width": 10,
              "line-blur": 4,
            },
          });
          map.addLayer({
            id: "trip-route-line",
            type: "line",
            source: "trip-route",
            layout: { "line-cap": "round", "line-join": "round" },
            paint: {
              "line-width": 5,
              "line-gradient": [
                "interpolate",
                ["linear"],
                ["line-progress"],
                0,
                "#1e5948",
                0.55,
                "#ea735c",
                1,
                "#f2b546",
              ],
            },
          });
        }
        fitRoute();
      });
      markerRefs.current = stops.map((stop, index) => {
        const element = document.createElement("button");
        element.type = "button";
        element.className = `route-map-marker${index === 0 ? " active" : ""}`;
        element.setAttribute(
          "aria-label",
          `Show stop ${index + 1}: ${stop.name}`,
        );
        const number = document.createElement("span");
        number.textContent = String(index + 1);
        const pin = document.createElement("i");
        element.append(number, pin);
        element.addEventListener("click", () => focusStop(index));
        const marker = new maplibre.Marker({ element, anchor: "bottom" })
          .setLngLat([stop.longitude, stop.latitude])
          .addTo(map);
        return { marker, element };
      });
    });
    return () => {
      disposed = true;
      window.clearTimeout(loadingTimeout);
      markerRefs.current.forEach(({ marker }) => marker.remove());
      markerRefs.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [fitRoute, focusStop, stops]);

  useEffect(() => {
    markerRefs.current.forEach(({ element }, index) =>
      element.classList.toggle("active", index === selectedIndex),
    );
  }, [selectedIndex]);

  const selected = stops[selectedIndex];
  const tripDays =
    differenceInCalendarDays(
      new Date(stops.at(-1)?.endDate ?? stops[0].endDate),
      new Date(stops[0].startDate),
    ) + 1;
  const totalCost = stops.reduce((sum, stop) => sum + stop.estimatedCost, 0);

  return (
    <section
      className="route-map-shell"
      aria-label={`Interactive route for ${tripName}`}
    >
      <div className="route-map-stage">
        <div
          className="route-map-canvas"
          ref={containerRef}
          aria-label={`Map showing ${stops.length} stops for ${tripName}`}
        />
        {mapStatus !== "ready" ? (
          <div
            className={`route-map-loading${mapStatus === "unavailable" ? " unavailable" : ""}`}
            role="status"
          >
            {mapStatus === "loading" ? <span /> : <MapPinned size={38} />}
            <strong>
              {mapStatus === "loading"
                ? "Drawing your journey"
                : "The live map is taking a detour"}
            </strong>
            <small>
              {mapStatus === "loading"
                ? "Loading the map and route…"
                : "Your route details are still available alongside the map."}
            </small>
          </div>
        ) : null}
        <div className="route-map-overview">
          <span>
            <Route size={16} />
            {Math.round(totalDistance).toLocaleString()} km
          </span>
          <span>
            <CalendarDays size={16} />
            {tripDays} days
          </span>
          <span>
            <MapPin size={16} />
            {stops.length} stops
          </span>
        </div>
        <button className="route-map-fit" type="button" onClick={fitRoute}>
          <LocateFixed size={16} />
          See full route
        </button>
      </div>
      <aside className="route-map-panel">
        <header>
          <p className="eyebrow">Journey sequence</p>
          <h2>{tripName}</h2>
          <p>Select a stop to fly across the route.</p>
        </header>
        <ol>
          {stops.map((stop, index) => {
            const days =
              differenceInCalendarDays(
                new Date(stop.endDate),
                new Date(stop.startDate),
              ) + 1;
            return (
              <li
                key={stop.id}
                className={index === selectedIndex ? "active" : ""}
              >
                <button
                  type="button"
                  onClick={() => focusStop(index)}
                  aria-current={
                    index === selectedIndex ? "location" : undefined
                  }
                >
                  <span className="route-stop-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="route-stop-image"
                    style={{
                      backgroundImage: `linear-gradient(0deg,rgba(9,35,28,.28),transparent),url(${stop.image})`,
                    }}
                  />
                  <span className="route-stop-copy">
                    <small>{stop.country}</small>
                    <strong>{stop.name}</strong>
                    <em>
                      {format(new Date(stop.startDate), "MMM d")} –{" "}
                      {format(new Date(stop.endDate), "MMM d")} · {days}{" "}
                      {days === 1 ? "day" : "days"}
                    </em>
                  </span>
                  {index ? (
                    <span className="route-segment">
                      +{Math.round(segmentDistances[index]).toLocaleString()} km
                    </span>
                  ) : (
                    <span className="route-segment origin">Start</span>
                  )}
                </button>
              </li>
            );
          })}
        </ol>
        <div className="route-map-selection">
          <div>
            <span>{String(selectedIndex + 1).padStart(2, "0")}</span>
            <div>
              <small>Now viewing</small>
              <strong>{selected.name}</strong>
            </div>
          </div>
          <p>
            <Sparkles size={15} />
            {selected.activityCount} planned{" "}
            {selected.activityCount === 1 ? "activity" : "activities"}
          </p>
          <p>
            <WalletCards size={15} />
            {formatCurrency(selected.estimatedCost)} planned here
          </p>
        </div>
        <footer>
          <span>
            <small>Route distance</small>
            <strong>{Math.round(totalDistance).toLocaleString()} km</strong>
          </span>
          <span>
            <small>Planned cost</small>
            <strong>{formatCurrency(totalCost)}</strong>
          </span>
        </footer>
      </aside>
    </section>
  );
}
