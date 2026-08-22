import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
const email = "vkzala0007@gmail.com";

const tripFixtures = [
  {
    name: "Rajasthan Heritage Circuit",
    description:
      "Stepwells, palace courtyards, desert architecture, and regional kitchens across western India.",
    budget: 112000,
    status: "UPCOMING" as const,
    stops: [
      ["ahmedabad", "2026-09-05", "2026-09-07"],
      ["udaipur", "2026-09-08", "2026-09-10"],
      ["jodhpur", "2026-09-11", "2026-09-12"],
      ["jaipur", "2026-09-13", "2026-09-15"],
    ],
  },
  {
    name: "Golden Triangle to the Ganges",
    description:
      "A lively route through monumental Delhi, craft-rich Jaipur, and sunrise rituals in Varanasi.",
    budget: 98000,
    status: "UPCOMING" as const,
    stops: [
      ["delhi", "2026-11-02", "2026-11-05"],
      ["jaipur", "2026-11-06", "2026-11-08"],
      ["varanasi", "2026-11-09", "2026-11-12"],
    ],
  },
  {
    name: "South India Flavours",
    description:
      "Modern Bengaluru, Kerala backwaters, and a relaxed finish beside Goa's coast.",
    budget: 126000,
    status: "UPCOMING" as const,
    stops: [
      ["bengaluru", "2027-01-10", "2027-01-13"],
      ["kochi", "2027-01-14", "2027-01-17"],
      ["goa", "2027-01-18", "2027-01-21"],
    ],
  },
  {
    name: "Southeast Asia Discovery",
    description:
      "Street-food neighborhoods, contemporary city life, temples, and island landscapes.",
    budget: 248000,
    status: "DRAFT" as const,
    stops: [
      ["singapore", "2027-02-12", "2027-02-15"],
      ["bangkok", "2027-02-16", "2027-02-20"],
      ["bali", "2027-02-21", "2027-02-27"],
    ],
  },
  {
    name: "European Art Trail",
    description:
      "Galleries, architecture, neighborhood markets, and landmark evenings across four European cities.",
    budget: 465000,
    status: "UPCOMING" as const,
    stops: [
      ["london", "2027-04-04", "2027-04-07"],
      ["paris", "2027-04-08", "2027-04-11"],
      ["barcelona", "2027-04-12", "2027-04-15"],
      ["rome", "2027-04-16", "2027-04-20"],
    ],
  },
  {
    name: "Mediterranean Mosaic",
    description:
      "Atlantic light, Catalan design, Roman history, and Istanbul's meeting of continents.",
    budget: 438000,
    status: "UPCOMING" as const,
    stops: [
      ["lisbon", "2027-06-06", "2027-06-09"],
      ["barcelona", "2027-06-10", "2027-06-13"],
      ["rome", "2027-06-14", "2027-06-17"],
      ["istanbul", "2027-06-18", "2027-06-22"],
    ],
  },
] as const;

function asUtcDate(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

async function main() {
  const user = await db.user.findUnique({ where: { email } });
  if (!user) throw new Error(`No user found for ${email}.`);

  const slugs = [
    ...new Set(
      tripFixtures.flatMap((trip) => trip.stops.map(([slug]) => slug)),
    ),
  ];
  const cities = await db.city.findMany({
    where: { slug: { in: slugs } },
    include: { activities: { orderBy: { popularity: "desc" }, take: 2 } },
  });
  const cityBySlug = new Map(cities.map((city) => [city.slug, city]));
  const missingCities = slugs.filter((slug) => !cityBySlug.has(slug));
  if (missingCities.length)
    throw new Error(
      `Missing catalog cities: ${missingCities.join(", ")}. Run npm run db:seed first.`,
    );

  await db.$transaction(async (tx) => {
    await tx.trip.deleteMany({
      where: {
        ownerId: user.id,
        name: { in: tripFixtures.map((trip) => trip.name) },
      },
    });

    for (const trip of tripFixtures) {
      const firstCity = cityBySlug.get(trip.stops[0][0])!;
      await tx.trip.create({
        data: {
          ownerId: user.id,
          name: trip.name,
          description: trip.description,
          startDate: asUtcDate(trip.stops[0][1]),
          endDate: asUtcDate(trip.stops.at(-1)![2]),
          budget: trip.budget,
          status: trip.status,
          coverImage: firstCity.image,
          stops: {
            create: trip.stops.map(([slug, startDate, endDate], position) => {
              const city = cityBySlug.get(slug)!;
              const nights = Math.max(
                1,
                Math.round(
                  (asUtcDate(endDate).getTime() -
                    asUtcDate(startDate).getTime()) /
                    86400000,
                ),
              );
              return {
                cityId: city.id,
                startDate: asUtcDate(startDate),
                endDate: asUtcDate(endDate),
                position,
                transportCost: position === 0 ? 0 : 6500 + city.costIndex * 180,
                stayCost: city.estimatedStayCost * nights,
                itineraryActivities: {
                  create: city.activities.map((activity, activityIndex) => ({
                    activityId: activity.id,
                    date: asUtcDate(startDate),
                    startTime: activityIndex === 0 ? "09:00" : "15:30",
                    position: activityIndex,
                    cost: activity.estimatedCost,
                  })),
                },
              };
            }),
          },
        },
      });
    }
  });

  console.log(
    `Prepared ${tripFixtures.length} multi-city trips for ${user.name} (${email}).`,
  );
}

main().finally(() => db.$disconnect());
