import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
// Use the data structure that includes both lists combined (from the previous step)
// Assuming you renamed the combined list to 'allTrains' in '../Data/train'
import { allTrains } from '../Data/train'; 
// Also import the list of all station data to use for the insertion
import { stations } from '../Data/Station'; // Assuming your full station list is here

const prisma = new PrismaClient({
  // IMPORTANT: For seeding, ensure you are using a direct DB connection
  // for operations like createMany/findUnique, especially outside of a serverless environment.
  // The accelerateUrl might be appropriate if running on a serverless provider,
  // but for local seeding, DATABASE_URL should typically point to the direct database.
  // We'll proceed with your current structure, assuming your environment is set up.
  accelerateUrl: process.env.DATABASE_URL,
});

async function main() {
  console.log('Starting Seeding Process...');

  // --- Step 1: Ensure all required stations exist ---
  const stationIdsToInsert = new Set();
  
  // Collect all unique station IDs used in the train mock data
  allTrains.forEach(train => {
    stationIdsToInsert.add(train.sourceStationId);
    stationIdsToInsert.add(train.destinationStationId);
  });

  // Filter the full list of stations to include only those required by the trains
  const requiredStations = stations.filter(station => stationIdsToInsert.has(station.id));
  
  console.log(`Found ${requiredStations.length} unique stations required by train data.`);
  
  // Insert all required stations first (skipDuplicates handles existing ones)
  const stationResult = await prisma.station.createMany({
    data: requiredStations,
    skipDuplicates: true,
  });

  console.log(`✔ Inserted/Checked ${stationResult.count} Station records.`);


  // --- Step 2: Insert Train Data in Chunks ---
  console.log('\nSeeding Train Data...');
  
  const CHUNK_SIZE = 500;
  let trainsInsertedCount = 0;

  for (let i = 0; i < allTrains.length; i += CHUNK_SIZE) {
    const chunk = allTrains.slice(i, i + CHUNK_SIZE);

    await prisma.train.createMany({
      data: chunk,
      skipDuplicates: true,
    });
    
    trainsInsertedCount += chunk.length;
    console.log(`-> Inserted ${Math.min(trainsInsertedCount, allTrains.length)}/${allTrains.length} Trains.`);
  }

  console.log('\n✔ Seeding done successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });