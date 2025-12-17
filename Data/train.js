// prisma/Data/Train.js (or Train.ts) - Consolidated Array

export const allTrains = [
  // --- Original 10 Trains (trainMockData) ---
  {
    // 1. Duronto Express
    trainNo: "12260",
    name: "Sealdah Duronto Express",
    type: "Duronto",
    sourceStationId: "BCT", 
    destinationStationId: "HWH", 
  },
  {
    // 2. Rajdhani Express
    trainNo: "12431",
    name: "Thiruvananthapuram Rajdhani Express",
    type: "Rajdhani",
    sourceStationId: "TVC", 
    destinationStationId: "NDLS", 
  },
  {
    // 3. Shatabdi Express
    trainNo: "12003",
    name: "Lucknow Swarn Shatabdi Express",
    type: "Shatabdi",
    sourceStationId: "NDLS", 
    destinationStationId: "LKO", 
  },
  {
    // 4. Garib Rath Express
    trainNo: "12611",
    name: "Chennai Central Garib Rath Express",
    type: "Garib Rath",
    sourceStationId: "MAS", 
    destinationStationId: "HWH", 
  },
  {
    // 5. Superfast Express
    trainNo: "12801",
    name: "Puri Express",
    type: "Superfast",
    sourceStationId: "CSMT", 
    destinationStationId: "BBS", 
  },
  {
    // 6. Mail Express
    trainNo: "11057",
    name: "Amritsar Express",
    type: "Mail Express",
    sourceStationId: "CSMT", 
    destinationStationId: "MB", 
  },
  {
    // 7. Vande Bharat Express
    trainNo: "22411",
    name: "New Delhi - Prayagraj Vande Bharat",
    type: "Vande Bharat",
    sourceStationId: "NDLS", 
    destinationStationId: "LKO", 
  },
  {
    // 8. Superfast Express
    trainNo: "12838",
    name: "Puri - Howrah Express",
    type: "Superfast",
    sourceStationId: "BBS", 
    destinationStationId: "HWH", 
  },
  {
    // 9. Janshatabdi Express
    trainNo: "12053",
    name: "Amritsar Janshatabdi Express",
    type: "Jan Shatabdi",
    sourceStationId: "HWH", 
    destinationStationId: "MAS", 
  },
  {
    // 10. Vivek Express
    trainNo: "15906",
    name: "Dibrugarh - Vivek Express",
    type: "Mail Express",
    sourceStationId: "LKO", 
    destinationStationId: "TVC", 
  },

  // --- Additional 7 Trains (sevenTrainMockData) ---
  {
    // 11. Mumbai Rajdhani Express
    trainNo: "12951",
    name: "Mumbai Rajdhani Express",
    type: "Rajdhani",
    sourceStationId: "BCT", 
    destinationStationId: "NDLS", 
  },
  {
    // 12. Howrah Rajdhani Express
    trainNo: "12301",
    name: "Howrah Rajdhani Express",
    type: "Rajdhani",
    sourceStationId: "NDLS", 
    destinationStationId: "HWH", 
  },
  {
    // 13. Brindavan Express
    trainNo: "12639",
    name: "Brindavan Express",
    type: "Superfast",
    sourceStationId: "MAS", 
    destinationStationId: "SBC", 
  },
  {
    // 14. Lucknow Mail
    trainNo: "12232",
    name: "Lucknow Mail",
    type: "Mail Express",
    sourceStationId: "CHD", 
    destinationStationId: "LKO", 
  },
  {
    // 15. Puri Express
    trainNo: "12833",
    name: "Puri Express",
    type: "Superfast",
    sourceStationId: "ADI", 
    destinationStationId: "PURI", 
  },
  {
    // 16. Devagiri Express
    trainNo: "17058",
    name: "Devagiri Express",
    type: "Express",
    sourceStationId: "SC", 
    destinationStationId: "CSMT", 
  },
  {
    // 17. Intercity Express
    trainNo: "15103",
    name: "Intercity Express",
    type: "Intercity",
    sourceStationId: "BSB", 
    destinationStationId: "GKP", 
  },
];


// prisma/Data/Train.ts

// export const allTrains = [
//   {
//     trainNo: "12260",
//     name: "Sealdah Duronto Express",
//     type: "Duronto",
//     sourceStationId: "BCT",
//     destinationStationId: "HWH",
//     departureTime: "12:10",
//     arrivalTime: "13:45",
//   },
//   {
//     trainNo: "12431",
//     name: "Thiruvananthapuram Rajdhani Express",
//     type: "Rajdhani",
//     sourceStationId: "TVC",
//     destinationStationId: "NDLS",
//     departureTime: "16:00",
//     arrivalTime: "13:30",
//   },
//   {
//     trainNo: "12003",
//     name: "Lucknow Swarn Shatabdi Express",
//     type: "Shatabdi",
//     sourceStationId: "NDLS",
//     destinationStationId: "LKO",
//     departureTime: "06:15",
//     arrivalTime: "12:35",
//   },
//   {
//     trainNo: "12611",
//     name: "Chennai Central Garib Rath Express",
//     type: "Garib Rath",
//     sourceStationId: "MAS",
//     destinationStationId: "HWH",
//     departureTime: "10:50",
//     arrivalTime: "17:45",
//   },
//   {
//     trainNo: "12801",
//     name: "Puri Express",
//     type: "Superfast",
//     sourceStationId: "CSMT",
//     destinationStationId: "BBS",
//     departureTime: "21:30",
//     arrivalTime: "05:15",
//   },
//   {
//     trainNo: "11057",
//     name: "Amritsar Express",
//     type: "Mail Express",
//     sourceStationId: "CSMT",
//     destinationStationId: "MB",
//     departureTime: "23:05",
//     arrivalTime: "04:40",
//   },
//   {
//     trainNo: "22411",
//     name: "New Delhi - Prayagraj Vande Bharat",
//     type: "Vande Bharat",
//     sourceStationId: "NDLS",
//     destinationStationId: "LKO",
//     departureTime: "06:00",
//     arrivalTime: "12:00",
//   },
//   {
//     trainNo: "12838",
//     name: "Puri - Howrah Express",
//     type: "Superfast",
//     sourceStationId: "BBS",
//     destinationStationId: "HWH",
//     departureTime: "20:45",
//     arrivalTime: "06:30",
//   },
//   {
//     trainNo: "12053",
//     name: "Amritsar Janshatabdi Express",
//     type: "Jan Shatabdi",
//     sourceStationId: "HWH",
//     destinationStationId: "MAS",
//     departureTime: "05:55",
//     arrivalTime: "22:30",
//   },
//   {
//     trainNo: "15906",
//     name: "Dibrugarh - Vivek Express",
//     type: "Mail Express",
//     sourceStationId: "LKO",
//     destinationStationId: "TVC",
//     departureTime: "18:40",
//     arrivalTime: "03:20",
//   },

//   // ---------- Additional Trains ----------
//   {
//     trainNo: "12951",
//     name: "Mumbai Rajdhani Express",
//     type: "Rajdhani",
//     sourceStationId: "BCT",
//     destinationStationId: "NDLS",
//     departureTime: "16:35",
//     arrivalTime: "08:35",
//   },
//   {
//     trainNo: "12301",
//     name: "Howrah Rajdhani Express",
//     type: "Rajdhani",
//     sourceStationId: "NDLS",
//     destinationStationId: "HWH",
//     departureTime: "17:10",
//     arrivalTime: "10:05",
//   },
//   {
//     trainNo: "12639",
//     name: "Brindavan Express",
//     type: "Superfast",
//     sourceStationId: "MAS",
//     destinationStationId: "SBC",
//     departureTime: "07:50",
//     arrivalTime: "14:10",
//   },
//   {
//     trainNo: "12232",
//     name: "Lucknow Mail",
//     type: "Mail Express",
//     sourceStationId: "CHD",
//     destinationStationId: "LKO",
//     departureTime: "22:20",
//     arrivalTime: "07:15",
//   },
//   {
//     trainNo: "12833",
//     name: "Puri Express",
//     type: "Superfast",
//     sourceStationId: "ADI",
//     destinationStationId: "PURI",
//     departureTime: "19:10",
//     arrivalTime: "04:30",
//   },
//   {
//     trainNo: "17058",
//     name: "Devagiri Express",
//     type: "Express",
//     sourceStationId: "SC",
//     destinationStationId: "CSMT",
//     departureTime: "18:25",
//     arrivalTime: "04:55",
//   },
//   {
//     trainNo: "15103",
//     name: "Intercity Express",
//     type: "Intercity",
//     sourceStationId: "BSB",
//     destinationStationId: "GKP",
//     departureTime: "06:30",
//     arrivalTime: "10:45",
//   },
// ];





//Seed code 


// prisma/seed.ts
// import 'dotenv/config'
// import { PrismaClient } from './generated/client' // adjust path if needed
// import { allTrains } from '../Data/train'
// import { stations } from '../Data/Station'

// const prisma = new PrismaClient({
//   accelerateUrl: process.env.DATABASE_URL,
// })

// async function main() {
//   console.log('Starting Seeding Process...')

//   // 1. Collect all station IDs used by trains
//   const stationIdsToInsert = new Set<string>()
//   for (const train of allTrains) {
//     stationIdsToInsert.add(train.sourceStationId)
//     stationIdsToInsert.add(train.destinationStationId)
//   }

//   // 2. Filter station list to only required ones
//   const requiredStations = stations.filter((s) => stationIdsToInsert.has(s.id))
  
//   console.log(`Found ${requiredStations.length} unique stations required by train data.`)

//   // 3. Insert required stations first
//   const stationResult = await prisma.station.createMany({
//     data: requiredStations,
//     skipDuplicates: true,
//   })

//   console.log(`✔ Inserted/Checked ${stationResult.count} Station records.`)

//   // 4. Verify that all station IDs now exist in DB
//   const stationIdsInDb = new Set(
//     (await prisma.station.findMany({ select: { id: true } })).map((s) => s.id),
//   )

//   const missing: string[] = []
//   for (const train of allTrains) {
//     if (!stationIdsInDb.has(train.sourceStationId)) {
//       missing.push(`Missing sourceStationId: ${train.sourceStationId} (train ${train.trainNo})`)
//     }
//     if (!stationIdsInDb.has(train.destinationStationId)) {
//       missing.push(`Missing destinationStationId: ${train.destinationStationId} (train ${train.trainNo})`)
//     }
//   }

//   if (missing.length > 0) {
//     console.error('Cannot seed trains, these station IDs are missing in Station table:')
//     console.error(missing.join('\n'))
//     return
//   }

//   // 5. Insert trains in chunks
//   console.log('\nSeeding Train Data...')
//   const CHUNK_SIZE = 500
//   let inserted = 0

//   for (let i = 0; i < allTrains.length; i += CHUNK_SIZE) {
//     const chunk = allTrains.slice(i, i + CHUNK_SIZE)

//     await prisma.train.createMany({
//       data: chunk,
//       skipDuplicates: true,
//     })

//     inserted += chunk.length
//     console.log(`-> Inserted ${Math.min(inserted, allTrains.length)}/${allTrains.length} Trains.`)
//   }

//   console.log('\n✔ Seeding done successfully!')
// }

// main()
//   .catch((e) => {
//     console.error('Seeding failed:', e)
//     process.exit(1)
//   })
//   .finally(async () => {
//     await prisma.$disconnect()
//   })












//seed to insert the time 

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
