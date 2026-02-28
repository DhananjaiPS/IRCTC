// import prisma from "@/lib/prisma";

// async function forceMockData() {
//   console.log("🛠️ Starting deep mock generation...");

//   // 1. Find the Schedule and Train
//   const schedule = await prisma.trainSchedule.findFirst({
//     where: { train: { trainNo: "12232" } }, // ⚠️ Apne train number se replace karein
//     include: { train: true, coaches: true }
//   });

//   if (!schedule) {
//     console.log("❌ Schedule not found. Make sure a train and schedule exist first.");
//     return;
//   }

//   const from = "CHD";
//   const to = "LKO";
//   const coachType = "1A";

//   // 2. Coach check/create
//   let coach = schedule.coaches.find(c => c.coachType === coachType);
  
//   if (!coach) {
//     console.log(`Creating missing coach: ${coachType}...`);
//     coach = await prisma.coach.create({
//       data: {
//         scheduleId: schedule.id,
//         coachType: coachType,
//         coachNumber: "A0",
//         totalSeats: 48
//       }
//     });
//   }

//   // 3. Dummy Seat check/create (Schema requirement)
//   let seat = await prisma.seat.findFirst({ where: { coachId: coach.id } });
  
//   if (!seat) {
//     console.log("Creating dummy seat for coach...");
//     seat = await prisma.seat.create({
//       data: {
//         coachId: coach.id,
//         seatNo: "W1",
//         berthType: "LOWER"
//       }
//     });
//   }

//   // 4. Generate RAC and WL slots for CHD -> LKO
//   console.log(`Generating slots for ${from} -> ${to}...`);
  
//   const virtualSlots = [];
//   for (let i = 1; i <= 5; i++) {
//     // RAC Slots
//     virtualSlots.push({
//       scheduleId: schedule.id,
//       coachId: coach.id,
//       seatId: seat.id,
//       fromStationId: from,
//       toStationId: to,
//       status: "RAC"
//     });
//     // WL Slots
//     virtualSlots.push({
//       scheduleId: schedule.id,
//       coachId: coach.id,
//       seatId: seat.id,
//       fromStationId: from,
//       toStationId: to,
//       status: "WAITLISTED"
//     });
//   }

//   // 5. Atomic Insert
//   await prisma.seatAvailability.createMany({
//     data: virtualSlots as any
//   });

//   console.log(`✅ Success! Added 5 RAC & 5 WL slots for ${coachType} from ${from} to ${to}.`);
// }

// forceMockData()
//   .catch(e => console.error(e))
//   .finally(() => prisma.$disconnect());


















//   // SEED OF TRAIN INSTANCE 
//   import prisma from "@/lib/prisma";

// async function main() {
//   // 1. Prefix Mapping
//   const coachNaming: Record<string, string> = {
//     "SL": "S", "AC3": "B", "AC2": "A", "AC1": "H", "3E": "M", "2S": "D", "CC": "C"
//   };

//   // 2. Train Configuration
//   const coachConfig = [
//     { type: "SL", count: 2 },  // S1, S2
//     { type: "AC3", count: 2 }, // B1, B2
//     { type: "AC2", count: 1 }  // A1
//   ];

//   const allTrains = await prisma.train.findMany({
//     include: { schedules: true }
//   });

//   if (allTrains.length === 0) {
//     console.log("❌ DB mein trains nahi mili. Pehle trains seed karo!");
//     return;
//   }

//   // 3. Next 10 Days Window
//   const today = new Date();
//   const datesToSeed = Array.from({ length: 10 }, (_, i) => {
//     const d = new Date();
//     d.setDate(today.getDate() + i);
//     d.setHours(0, 0, 0, 0);
//     return d;
//   });

//   for (const train of allTrains) {
//     console.log(`\n🚂 Syncing: ${train.trainNo} - ${train.name}`);

//     for (const schedule of train.schedules) {
      
//       // Step A: Coach & Seats (Static Structure)
//       for (const config of coachConfig) {
//         const prefix = coachNaming[config.type] || "X";

//         for (let i = 1; i <= config.count; i++) {
//           const coachNumber = `${prefix}${i}`;

//           let coach = await prisma.coach.findFirst({
//             where: { scheduleId: schedule.id, coachNumber: coachNumber }
//           });

//           if (!coach) {
//             coach = await prisma.coach.create({
//               data: {
//                 scheduleId: schedule.id,
//                 coachType: config.type,
//                 coachNumber: coachNumber,
//                 totalSeats: 72
//               }
//             });
//             console.log(`   + Coach ${coachNumber} Created`);
//           }

//           const seatCount = await prisma.seat.count({ where: { coachId: coach.id } });
//           if (seatCount < 72) {
//             const berthTypes: TrainBerthType[] = ["LOWER", "MIDDLE", "UPPER", "SIDE_LOWER", "SIDE_UPPER"];
//             const seatsData = Array.from({ length: 72 }, (_, index) => ({
//               coachId: coach.id,
//               seatNo: (index + 1).toString(),
//               berthType: berthTypes[index % 5]
//             }));
//             await prisma.seat.createMany({ data: seatsData });
//             console.log(`     - 72 Seats added to ${coachNumber}`);
//           }
//         }
//       }

//       // Step B: TrainInstance (Daily Inventory)
//       for (const journeyDate of datesToSeed) {
//         const dayOfWeek = journeyDate.getDay(); 
//         if (!schedule.daysOfWeek.includes(dayOfWeek)) continue;

//         for (const config of coachConfig) {
//           const totalCapacity = config.count * 72;

//           await prisma.trainInstance.upsert({
//             where: {
//               scheduleId_journeyDate_coachType: {
//                 scheduleId: schedule.id,
//                 journeyDate: journeyDate,
//                 coachType: config.type
//               }
//             },
//             update: { totalSeats: totalCapacity }, // Sirf capacity update karega, bookings ko nahi chedega
//             create: {
//               scheduleId: schedule.id,
//               journeyDate: journeyDate,
//               coachType: config.type,
//               totalSeats: totalCapacity,
//               availableSeats: totalCapacity, // Starting mein full khali
//               racSeats: 10,                 // RAC quota starting point
//               wlSeats: 0                    // 👈 Perfect! Waitlist 0 se shuru hogi
//             }
//           });
//         }
//       }
//       console.log(`   ✅ Inventory synced for ${train.trainNo}`);
//     }
//   }
//   console.log("\n🚀 DB Ready! Sab kuch set hai.");
// }

// main().catch(e => console.error(e)).finally(() => prisma.$disconnect());