export const trainSchedulesMock = [
  // 1. Duronto Express (Bi-weekly)
  {
    trainNo: "12260",
    startDate: "2025-01-01",
    endDate: "2026-12-31",
    daysOfWeek: [1, 4], // Mon, Thu
    status: "RUNNING",
  },

  // 2. Rajdhani Express (Daily)
  {
    trainNo: "12431",
    startDate: "2025-01-01",
    endDate: "2026-12-31",
    daysOfWeek: [0,1,2,3,4,5,6],
    status: "RUNNING",
  },

  // 3. Shatabdi Express (Except Sunday)
  {
    trainNo: "12003",
    startDate: "2025-01-01",
    endDate: "2026-12-31",
    daysOfWeek: [1,2,3,4,5,6],
    status: "RUNNING",
  },

  // 4. Garib Rath Express (3 days a week)
  {
    trainNo: "12611",
    startDate: "2025-01-01",
    endDate: "2026-12-31",
    daysOfWeek: [2,4,6], // Tue, Thu, Sat
    status: "RUNNING",
  },

  // 5. Superfast Express (Daily)
  {
    trainNo: "12801",
    startDate: "2025-01-01",
    endDate: "2026-12-31",
    daysOfWeek: [0,1,2,3,4,5,6],
    status: "RUNNING",
  },

  // 6. Mail Express (Alternate days)
  {
    trainNo: "11057",
    startDate: "2025-01-01",
    endDate: "2026-12-31",
    daysOfWeek: [1,3,5],
    status: "RUNNING",
  },

  // 7. Vande Bharat Express (Except Tuesday)
  {
    trainNo: "22411",
    startDate: "2025-01-01",
    endDate: "2026-12-31",
    daysOfWeek: [0,1,3,4,5,6],
    status: "RUNNING",
  },

  // 8. Superfast Express
  {
    trainNo: "12838",
    startDate: "2025-01-01",
    endDate: "2026-12-31",
    daysOfWeek: [0,1,2,3,4,5,6],
    status: "RUNNING",
  },

  // 9. Janshatabdi Express
  {
    trainNo: "12053",
    startDate: "2025-01-01",
    endDate: "2026-12-31",
    daysOfWeek: [1,2,3,4,5,6],
    status: "RUNNING",
  },

  // 10. Vivek Express (Weekly long-distance)
  {
    trainNo: "15906",
    startDate: "2025-01-01",
    endDate: "2026-12-31",
    daysOfWeek: [6], // Saturday
    status: "RUNNING",
  },

  // 11. Mumbai Rajdhani (Daily)
  {
    trainNo: "12951",
    startDate: "2025-01-01",
    endDate: "2026-12-31",
    daysOfWeek: [0,1,2,3,4,5,6],
    status: "RUNNING",
  },

  // 12. Howrah Rajdhani (Daily)
  {
    trainNo: "12301",
    startDate: "2025-01-01",
    endDate: "2026-12-31",
    daysOfWeek: [0,1,2,3,4,5,6],
    status: "RUNNING",
  },

  // 13. Brindavan Express
  {
    trainNo: "12639",
    startDate: "2025-01-01",
    endDate: "2026-12-31",
    daysOfWeek: [1,2,3,4,5,6],
    status: "RUNNING",
  },

  // 14. Lucknow Mail
  {
    trainNo: "12232",
    startDate: "2025-01-01",
    endDate: "2026-12-31",
    daysOfWeek: [0,2,4],
    status: "RUNNING",
  },

  // 15. Puri Express
  {
    trainNo: "12833",
    startDate: "2025-01-01",
    endDate: "2026-12-31",
    daysOfWeek: [1,3,5],
    status: "RUNNING",
  },

  // 16. Devagiri Express
  {
    trainNo: "17058",
    startDate: "2025-01-01",
    endDate: "2026-12-31",
    daysOfWeek: [0,2,4,6],
    status: "RUNNING",
  },

  // 17. Intercity Express (Weekdays only)
  {
    trainNo: "15103",
    startDate: "2025-01-01",
    endDate: "2026-12-31",
    daysOfWeek: [1,2,3,4,5],
    status: "RUNNING",
  },
];




//Seed code 
//  import 'dotenv/config';
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
