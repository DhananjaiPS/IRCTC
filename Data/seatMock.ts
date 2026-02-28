// prisma/seedSeats.ts
import 'dotenv/config';
import prisma from '@/lib/prisma';

type TrainBerthType =
  | 'LOWER'
  | 'MIDDLE'
  | 'UPPER'
  | 'SIDE_LOWER'
  | 'SIDE_UPPER';

interface SeatMock {
  coachId: bigint; // match Prisma schema
  seatNo: string;
  berthType: TrainBerthType;
}

// Berth patterns per coach type
const berthPatterns: Record<string, TrainBerthType[]> = {
  SL: ['LOWER', 'MIDDLE', 'UPPER', 'LOWER', 'MIDDLE', 'UPPER', 'SIDE_LOWER', 'SIDE_UPPER'],
  '3A': ['LOWER', 'MIDDLE', 'UPPER', 'LOWER', 'MIDDLE', 'UPPER', 'SIDE_LOWER', 'SIDE_UPPER'],
  '2A': ['LOWER', 'UPPER', 'LOWER', 'UPPER', 'SIDE_LOWER', 'SIDE_UPPER'],
  '1A': ['LOWER', 'UPPER'],
  EC: ['LOWER'],
  CC: ['LOWER'],
  GEN: ['LOWER'],
  PANTRY: [], // no seats
};

async function main() {
  console.log('🌱 Seeding Seats...\n');

  // 1️⃣ Fetch all coaches from DB
  const coaches = await prisma.coach.findMany({
    select: { id: true, coachType: true, totalSeats: true },
  });

  const seatData: SeatMock[] = [];

  // 2️⃣ Build seat objects
  for (const coach of coaches) {
    const pattern = berthPatterns[coach.coachType];
    if (!pattern || pattern.length === 0) continue;

    for (let i = 0; i < coach.totalSeats; i++) {
      seatData.push({
        coachId: coach.id, // ✅ use real DB ID
        seatNo: `S${i + 1}`,
        berthType: pattern[i % pattern.length],
      });
    }
  }

  console.log(`Generated ${seatData.length} seats.`);

  // 3️⃣ Insert seats in batches
  const batchSize = 500;
  for (let i = 0; i < seatData.length; i += batchSize) {
    const batch = seatData.slice(i, i + batchSize);
    await prisma.seat.createMany({
      data: batch,
      skipDuplicates: true,
    });
    console.log(`Inserted ${i + batch.length} / ${seatData.length} seats`);
  }

  console.log('\n✅ All seats seeded!');
}

main()
  .catch(console.error)
  .finally(async () => prisma.$disconnect());
