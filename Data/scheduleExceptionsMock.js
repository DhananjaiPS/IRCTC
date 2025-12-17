export const scheduleExceptionsMock = [
  // 1. Duronto Express – Extra run added
  {
    trainNo: "12260",
    date: "2025-12-05",
    type: "ADD",
  },

  // 2. Mail Express – Cancelled due to maintenance
  {
    trainNo: "11057",
    date: "2025-12-10",
    type: "CANCEL",
  },

  // 3. Vande Bharat – Extra run added
  {
    trainNo: "22411",
    date: "2025-12-15",
    type: "ADD",
  },

  // 4. Superfast Express – Cancelled due to weather
  {
    trainNo: "12801",
    date: "2025-12-18",
    type: "CANCEL",
  },

  // 5. Shatabdi Express – Extra run
  {
    trainNo: "12003",
    date: "2025-12-20",
    type: "ADD",
  },

  // 6. Puri Express – Cancelled
  {
    trainNo: "12833",
    date: "2025-12-22",
    type: "CANCEL",
  },

  // 7. Intercity Express – Extra run
  {
    trainNo: "15103",
    date: "2025-12-28",
    type: "ADD",
  },
];



//seed 
// import 'dotenv/config';
// import { PrismaClient } from './generated/client';
// import { scheduleExceptionsMock } from '../Data/scheduleExceptionsMock.js';

// const prisma = new PrismaClient({
//   accelerateUrl: process.env.DATABASE_URL,
// });

// export type ExceptionType = "CANCEL" | "ADD";

// async function main() {
//   console.log('Seeding ScheduleExceptions...');

//   for (const ex of scheduleExceptionsMock) {
//     // Find the schedule by trainNo
//     const schedule = await prisma.trainSchedule.findFirst({
//       where: { train: { trainNo: ex.trainNo } },
//     });

//     if (!schedule) {
//       console.warn(`Schedule not found for train: ${ex.trainNo}, skipping...`);
//       continue;
//     }

//     // Insert ScheduleException
//     await prisma.scheduleException.create({
//       data: {
//         scheduleId: schedule.id,
//         date: new Date(ex.date),
//         type: ex.type as ExceptionType,
//       },
//     });

//     console.log(`✔ Inserted exception for ${ex.trainNo} on ${ex.date}`);
//   }

//   console.log('All ScheduleExceptions seeded successfully!');
// }

// main()
//   .catch((e) => {
//     console.error('Seeding failed:', e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
