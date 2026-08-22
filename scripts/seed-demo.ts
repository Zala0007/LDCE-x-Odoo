import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
const email = "he.demo@globetrotter.local";

async function main() {
  const cities = await db.city.findMany({
    where: {
      slug: {
        in: ["tokyo", "kyoto", "jaipur", "lisbon", "paris", "goa", "dubai"],
      },
    },
    include: { activities: { orderBy: { popularity: "desc" }, take: 3 } },
  });
  if (cities.length < 7)
    throw new Error(
      "Run npm run db:seed before preparing documentation fixtures.",
    );

  const passwordHash = await bcrypt.hash("DemoTravel2027", 12);
  const user = await db.user.upsert({
    where: { email },
    update: {
      passwordHash,
      name: "V K Zala",
      firstName: "V K",
      lastName: "Zala",
      phone: "+91 98765 43210",
      city: "Ahmedabad",
      country: "India",
      bio: "Slow-travel planner collecting neighborhood walks, local kitchens, and quiet mornings.",
      role: "ADMIN",
      isActive: true,
      preferences: {
        upsert: {
          create: { language: "en", currency: "INR", emailNotifications: true },
          update: { language: "en", currency: "INR", emailNotifications: true },
        },
      },
    },
    create: {
      email,
      passwordHash,
      name: "V K Zala",
      firstName: "V K",
      lastName: "Zala",
      phone: "+91 98765 43210",
      city: "Ahmedabad",
      country: "India",
      bio: "Slow-travel planner collecting neighborhood walks, local kitchens, and quiet mornings.",
      role: "ADMIN",
      preferences: {
        create: { language: "en", currency: "INR", emailNotifications: true },
      },
    },
  });

  await db.communityPost.deleteMany({ where: { authorId: user.id } });
  await db.savedDestination.deleteMany({ where: { userId: user.id } });
  await db.trip.deleteMany({ where: { ownerId: user.id } });

  const bySlug = Object.fromEntries(cities.map((city) => [city.slug, city]));
  const tokyo = bySlug.tokyo;
  const kyoto = bySlug.kyoto;
  const jaipur = bySlug.jaipur;
  const lisbon = bySlug.lisbon;
  const paris = bySlug.paris;
  const goa = bySlug.goa;
  const dubai = bySlug.dubai;

  const japan = await db.trip.create({
    data: {
      ownerId: user.id,
      name: "Japan Spring Stories",
      description:
        "A balanced journey through Tokyo energy and Kyoto calm, planned around food, gardens, and unhurried neighborhoods.",
      startDate: new Date("2027-03-18T00:00:00.000Z"),
      endDate: new Date("2027-03-25T00:00:00.000Z"),
      budget: 285000,
      status: "UPCOMING",
      coverImage: tokyo.image,
      publicLink: { create: { slug: "japan-spring-stories", isActive: true } },
      stops: {
        create: [
          {
            cityId: tokyo.id,
            startDate: new Date("2027-03-18T00:00:00.000Z"),
            endDate: new Date("2027-03-21T00:00:00.000Z"),
            position: 0,
            transportCost: 42000,
            stayCost: 54000,
            itineraryActivities: {
              create: tokyo.activities.map((activity, index) => ({
                activityId: activity.id,
                date: new Date(`2027-03-${18 + index}T00:00:00.000Z`),
                startTime: ["09:00", "13:30", "18:00"][index],
                position: index,
                cost: activity.estimatedCost,
                notes:
                  index === 0
                    ? "Begin early and leave room for a neighborhood lunch."
                    : null,
              })),
            },
          },
          {
            cityId: kyoto.id,
            startDate: new Date("2027-03-22T00:00:00.000Z"),
            endDate: new Date("2027-03-25T00:00:00.000Z"),
            position: 1,
            transportCost: 14500,
            stayCost: 48000,
            itineraryActivities: {
              create: kyoto.activities.map((activity, index) => ({
                activityId: activity.id,
                date: new Date(`2027-03-${22 + index}T00:00:00.000Z`),
                startTime: ["08:30", "12:00", "16:30"][index],
                position: index,
                cost: activity.estimatedCost,
              })),
            },
          },
        ],
      },
    },
  });

  const additionalTrips = [
    {
      name: "Goa Monsoon Reset",
      description:
        "A slow coastal pause with heritage lanes, local kitchens, and rain-washed beaches.",
      startDate: new Date("2026-08-20T00:00:00.000Z"),
      endDate: new Date("2026-08-26T00:00:00.000Z"),
      budget: 68000,
      status: "UPCOMING" as const,
      city: goa,
      transportCost: 12500,
      stayCost: 24000,
    },
    {
      name: "Paris Autumn Notebook",
      description:
        "Museum mornings, market lunches, and long neighborhood walks along the Seine.",
      startDate: new Date("2026-10-03T00:00:00.000Z"),
      endDate: new Date("2026-10-09T00:00:00.000Z"),
      budget: 175000,
      status: "UPCOMING" as const,
      city: paris,
      transportCost: 52000,
      stayCost: 62000,
    },
    {
      name: "Rajasthan Courtyard Weekend",
      description: "Craft, architecture, and generous local tables in Jaipur.",
      startDate: new Date("2026-11-06T00:00:00.000Z"),
      endDate: new Date("2026-11-09T00:00:00.000Z"),
      budget: 52000,
      status: "UPCOMING" as const,
      city: jaipur,
      transportCost: 9000,
      stayCost: 18000,
    },
    {
      name: "Dubai Design Stopover",
      description:
        "A flexible city break for architecture, contemporary art, and desert light.",
      startDate: new Date("2026-12-12T00:00:00.000Z"),
      endDate: new Date("2026-12-16T00:00:00.000Z"),
      budget: 120000,
      status: "DRAFT" as const,
      city: dubai,
      transportCost: 28000,
      stayCost: 46000,
    },
    {
      name: "Lisbon Light & Tiles",
      description: "Hillside walks, Atlantic air, and neighborhood bakeries.",
      startDate: new Date("2026-05-10T00:00:00.000Z"),
      endDate: new Date("2026-05-15T00:00:00.000Z"),
      budget: 145000,
      status: "COMPLETED" as const,
      city: lisbon,
      transportCost: 45000,
      stayCost: 52000,
    },
  ];

  for (const trip of additionalTrips) {
    await db.trip.create({
      data: {
        ownerId: user.id,
        name: trip.name,
        description: trip.description,
        startDate: trip.startDate,
        endDate: trip.endDate,
        budget: trip.budget,
        status: trip.status,
        coverImage: trip.city.image,
        stops: {
          create: {
            cityId: trip.city.id,
            startDate: trip.startDate,
            endDate: trip.endDate,
            position: 0,
            transportCost: trip.transportCost,
            stayCost: trip.stayCost,
            itineraryActivities: {
              create: trip.city.activities
                .slice(0, 2)
                .map((activity, index) => ({
                  activityId: activity.id,
                  date: trip.startDate,
                  startTime: index === 0 ? "09:30" : "15:00",
                  position: index,
                  cost: activity.estimatedCost,
                })),
            },
          },
        },
      },
    });
  }

  await db.savedDestination.createMany({
    data: [jaipur, lisbon, paris].map((city) => ({
      userId: user.id,
      cityId: city.id,
    })),
  });
  await db.communityPost.createMany({
    data: [
      {
        authorId: user.id,
        tripId: japan.id,
        title: "Why I leave one open afternoon in every city",
        content:
          "The best discoveries rarely fit a checklist. I keep one afternoon unscheduled for a neighborhood recommendation, a slower meal, or simply returning to the place that felt special.",
        image: kyoto.image,
      },
      {
        authorId: user.id,
        title: "A small planning ritual that keeps budgets honest",
        content:
          "I record transport and accommodation first, then give each day a flexible experience allowance. It makes the trade-offs visible without turning the journey into a spreadsheet exercise.",
        image: lisbon.image,
      },
    ],
  });

  console.log(
    `Prepared documentation fixtures for ${email} and trip ${japan.id}.`,
  );
}

main().finally(() => db.$disconnect());
