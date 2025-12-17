// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient()
// export default prisma;



import 'dotenv/config'
// import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaClient } from '../prisma/generated/client';

import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
export default prisma;


// import { PrismaPg } from '@prisma/adapter-pg'
// import { PrismaClient } from '../prisma/generated/client'


// const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
// const prisma = new PrismaClient({ adapter: pool })

// const globalForPrisma = global as unknown as { prisma: typeof prisma }

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// export default prisma