// src/scripts/fixCustomers.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fix() {
  const deleted = await prisma.customer.deleteMany({
    where: {
      password: null
    }
  });

  console.log(`Deletados ${deleted.count} registros com password nulo`);
  await prisma.$disconnect();
}

fix();
