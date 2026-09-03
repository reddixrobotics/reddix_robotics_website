import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_SLOTS = [
  { sectionKey: 'hero', title: 'Hero Video', displayOrder: 1 },
  { sectionKey: 'program', title: 'Program Video', displayOrder: 2 },
  { sectionKey: 'kushi', title: 'Kushi Robot Video', displayOrder: 3 },
  { sectionKey: 'curriculum-week-1', title: 'Week 1 Video', displayOrder: 4 },
  { sectionKey: 'curriculum-week-2', title: 'Week 2 Video', displayOrder: 5 },
  { sectionKey: 'curriculum-week-3', title: 'Week 3 Video', displayOrder: 6 },
  { sectionKey: 'curriculum-week-4', title: 'Week 4 Video', displayOrder: 7 },
  { sectionKey: 'experience-1', title: 'Experience 1: Building', displayOrder: 8 },
  { sectionKey: 'experience-2', title: 'Experience 2: Testing', displayOrder: 9 },
  { sectionKey: 'experience-3', title: 'Experience 3: Debugging', displayOrder: 10 },
  { sectionKey: 'experience-4', title: 'Experience 4: Demonstrating', displayOrder: 11 },
];

async function main() {
  for (const slot of DEFAULT_SLOTS) {
    await prisma.workshopMedia.upsert({
      where: { sectionKey: slot.sectionKey },
      update: {},
      create: slot,
    });
  }
  console.log('✅ Workshop media slots seeded.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
