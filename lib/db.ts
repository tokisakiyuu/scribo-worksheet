import { PrismaClient } from "@prisma/client";

declare global {
  var __db: PrismaClient;
}

if (!globalThis.__db) {
  globalThis.__db = new PrismaClient();
}

export default globalThis.__db;
