import { PrismaClient } from "../generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});

declare global {
  var cachedPrisma: PrismaClient | undefined;
}

const prismaClient =
  process.env.NODE_ENV === "production"
    ? new PrismaClient({ adapter })
    : (global.cachedPrisma ??
      (global.cachedPrisma = new PrismaClient({ adapter })));

export const db = prismaClient;
