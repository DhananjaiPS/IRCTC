// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient()
// export default prisma;



import 'dotenv/config'
// import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaClient } from '@prisma/client'; 

import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
export default prisma;
