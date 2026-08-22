import { PrismaClient } from "@prisma/client";
import { buildActivities, citySeeds } from "../lib/data/travel-data";

const prisma = new PrismaClient();

async function main() {
  for (const seed of citySeeds) {
    const { highlights: _highlights, ...cityData } = seed;
    void _highlights;
    const city = await prisma.city.upsert({
      where: { slug: seed.slug },
      update: cityData,
      create: cityData,
    });
    await prisma.activity.deleteMany({ where: { cityId: city.id } });
    await prisma.activity.createMany({
      data: buildActivities(seed).map((activity) => ({ ...activity, cityId: city.id })),
    });
  }
  const counts = await Promise.all([prisma.city.count(), prisma.activity.count()]);
  process.stdout.write(`Seeded ${counts[0]} cities and ${counts[1]} activities.\n`);
}

main()
  .catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.message : "Seed failed"}\n`);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
