// Data/coachMock.ts

export type CoachMock = {
  scheduleId: number;
  coachType: string;
  coachNumber: string;
  totalSeats: number;
};

function buildCoaches(
  scheduleId: number,
  layout: { type: string; count: number; seats: number }[]
): CoachMock[] {
  const result: CoachMock[] = [];
  let num = 1;

  for (const c of layout) {
    for (let i = 0; i < c.count; i++) {
      result.push({
        scheduleId,
        coachType: c.type,
        coachNumber: `C${num++}`,
        totalSeats: c.seats,
      });
    }
  }

  return result;
}

export const coachMockData: CoachMock[] = [

  // 1 Duronto
  ...buildCoaches(1, [
    { type: "2A", count: 2, seats: 46 },
    { type: "3A", count: 6, seats: 64 },
    { type: "SL", count: 8, seats: 72 },
    { type: "GEN", count: 2, seats: 90 },
  ]),

  // 2 Rajdhani
  ...buildCoaches(2, [
    { type: "1A", count: 1, seats: 18 },
    { type: "2A", count: 3, seats: 46 },
    { type: "3A", count: 8, seats: 64 },
    { type: "PANTRY", count: 1, seats: 0 },
  ]),

  // 3 Shatabdi
  ...buildCoaches(3, [
    { type: "EC", count: 2, seats: 56 },
    { type: "CC", count: 10, seats: 78 },
  ]),

  // 4 Garib Rath
  ...buildCoaches(4, [
    { type: "3A", count: 16, seats: 72 },
  ]),

  // 5 Superfast
  ...buildCoaches(5, [
    { type: "2A", count: 2, seats: 46 },
    { type: "3A", count: 4, seats: 64 },
    { type: "SL", count: 10, seats: 72 },
    { type: "GEN", count: 4, seats: 90 },
  ]),

  // 6 Mail
  ...buildCoaches(6, [
    { type: "SL", count: 12, seats: 72 },
    { type: "3A", count: 3, seats: 64 },
    { type: "GEN", count: 6, seats: 90 },
  ]),

  // 7 Vande Bharat
  ...buildCoaches(7, [
    { type: "EC", count: 2, seats: 52 },
    { type: "CC", count: 14, seats: 78 },
  ]),

  // 8 Superfast
  ...buildCoaches(8, [
    { type: "2A", count: 2, seats: 46 },
    { type: "3A", count: 4, seats: 64 },
    { type: "SL", count: 10, seats: 72 },
    { type: "GEN", count: 4, seats: 90 },
  ]),

  // 9 Jan Shatabdi
  ...buildCoaches(9, [
    { type: "CC", count: 12, seats: 78 },
    { type: "GEN", count: 3, seats: 90 },
  ]),

  // 10 Vivek Express (long haul)
  ...buildCoaches(10, [
    { type: "SL", count: 14, seats: 72 },
    { type: "3A", count: 4, seats: 64 },
    { type: "2A", count: 2, seats: 46 },
    { type: "GEN", count: 2, seats: 90 },
  ]),

  // 11 Rajdhani
  ...buildCoaches(11, [
    { type: "1A", count: 1, seats: 18 },
    { type: "2A", count: 3, seats: 46 },
    { type: "3A", count: 8, seats: 64 },
  ]),

  // 12 Rajdhani
  ...buildCoaches(12, [
    { type: "1A", count: 1, seats: 18 },
    { type: "2A", count: 3, seats: 46 },
    { type: "3A", count: 8, seats: 64 },
  ]),

  // 13 Brindavan
  ...buildCoaches(13, [
    { type: "CC", count: 10, seats: 78 },
  ]),

  // 14 Lucknow Mail
  ...buildCoaches(14, [
    { type: "SL", count: 12, seats: 72 },
    { type: "3A", count: 3, seats: 64 },
    { type: "GEN", count: 4, seats: 90 },
  ]),

  // 15 Puri Express
  ...buildCoaches(15, [
    { type: "SL", count: 10, seats: 72 },
    { type: "3A", count: 4, seats: 64 },
    { type: "GEN", count: 4, seats: 90 },
  ]),

  // 16 Devagiri
  ...buildCoaches(16, [
    { type: "SL", count: 12, seats: 72 },
    { type: "3A", count: 3, seats: 64 },
    { type: "GEN", count: 5, seats: 90 },
  ]),

  // 17 Intercity
  ...buildCoaches(17, [
    { type: "CC", count: 6, seats: 78 },
    { type: "GEN", count: 4, seats: 90 },
  ]),
];


// prisma/seedCoaches.ts
// import 'dotenv/config';
// import prisma from '@/lib/prisma';
// import { coachMockData } from '../Data/coachMock';

// async function main() {
//   console.log('🌱 Seeding Coaches...\n');

//   try {
//     const result = await prisma.coach.createMany({
//       data: coachMockData,
//       skipDuplicates: true, // prevents duplicates if script is run again
//     });

//     console.log(`✅ Inserted ${result.count} coaches successfully!`);
//   } catch (error) {
//     console.error('❌ Error seeding coaches:', error);
//   } finally {
//     await prisma.$disconnect();
//     console.log('🔌 Prisma disconnected.');
//   }
// }

// // Run the seed
// main();
