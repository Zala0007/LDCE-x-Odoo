-- Persist geographic centers used by the interactive itinerary map.
ALTER TABLE "City"
ADD COLUMN "latitude" DOUBLE PRECISION,
ADD COLUMN "longitude" DOUBLE PRECISION;

UPDATE "City"
SET
  "latitude" = CASE "slug"
    WHEN 'ahmedabad' THEN 23.0225 WHEN 'udaipur' THEN 24.5854 WHEN 'jaipur' THEN 26.9124
    WHEN 'jodhpur' THEN 26.2389 WHEN 'mumbai' THEN 19.076 WHEN 'goa' THEN 15.4909
    WHEN 'delhi' THEN 28.6139 WHEN 'bengaluru' THEN 12.9716 WHEN 'kochi' THEN 9.9312
    WHEN 'varanasi' THEN 25.3176 WHEN 'dubai' THEN 25.2048 WHEN 'singapore' THEN 1.3521
    WHEN 'bangkok' THEN 13.7563 WHEN 'bali' THEN -8.65 WHEN 'tokyo' THEN 35.6762
    WHEN 'paris' THEN 48.8566 WHEN 'london' THEN 51.5074 WHEN 'rome' THEN 41.9028
    WHEN 'barcelona' THEN 41.3874 WHEN 'istanbul' THEN 41.0082 WHEN 'new-york' THEN 40.7128
    WHEN 'cape-town' THEN -33.9249 WHEN 'sydney' THEN -33.8688 WHEN 'kyoto' THEN 35.0116
    WHEN 'lisbon' THEN 38.7223 ELSE "latitude" END,
  "longitude" = CASE "slug"
    WHEN 'ahmedabad' THEN 72.5714 WHEN 'udaipur' THEN 73.7125 WHEN 'jaipur' THEN 75.7873
    WHEN 'jodhpur' THEN 73.0243 WHEN 'mumbai' THEN 72.8777 WHEN 'goa' THEN 73.8278
    WHEN 'delhi' THEN 77.209 WHEN 'bengaluru' THEN 77.5946 WHEN 'kochi' THEN 76.2673
    WHEN 'varanasi' THEN 82.9739 WHEN 'dubai' THEN 55.2708 WHEN 'singapore' THEN 103.8198
    WHEN 'bangkok' THEN 100.5018 WHEN 'bali' THEN 115.2167 WHEN 'tokyo' THEN 139.6503
    WHEN 'paris' THEN 2.3522 WHEN 'london' THEN -0.1278 WHEN 'rome' THEN 12.4964
    WHEN 'barcelona' THEN 2.1686 WHEN 'istanbul' THEN 28.9784 WHEN 'new-york' THEN -74.006
    WHEN 'cape-town' THEN 18.4241 WHEN 'sydney' THEN 151.2093 WHEN 'kyoto' THEN 135.7681
    WHEN 'lisbon' THEN -9.1393 ELSE "longitude" END;
