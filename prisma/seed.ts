// import prisma from '@/lib/prisma'
// import { allTrains } from '../Data/Train'


// async function main() {
//   console.log('⏳ Updating departure & arrival times for trains...')

//   let updatedCount = 0

//   for (const train of allTrains) {
//     const result = await prisma.train.updateMany({
//       where: {
//         trainNo: train.trainNo.trim(),
//       },
//       data: {
//         departureTime: train.departureTime,
//         arrivalTime: train.arrivalTime,
//       },
//     })

//     if (result.count === 0) {
//       console.warn(`⚠️ No train found for trainNumber: ${train.trainNo}`)
//     } else {
//       updatedCount += result.count
//     }
//   }

//   console.log(`✅ Successfully updated ${updatedCount} train records`)
// }

// main()
//   .catch((e) => {
//     console.error('❌ Seeding failed:', e)
//     process.exit(1)
//   })
//   .finally(async () => {
//     await prisma.$disconnect()
//   })
