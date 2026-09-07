import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcrypt";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const pool = new Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const password = await bcrypt.hash("password123", 10);

  const employee = await prisma.user.upsert({
    where: {
      email: "employee@company.com",
    },
    update: {},
    create: {
      email: "employee@company.com",
      password,
      name: "Demo Employee",
      role: "EMPLOYEE",
    },
  });

  const admin = await prisma.user.upsert({
    where: {
      email: "admin@company.com",
    },
    update: {},
    create: {
      email: "admin@company.com",
      password,
      name: "Demo HR Admin",
      role: "HR_ADMIN",
    },
  });

  console.log("Employee:", employee.id);
  console.log("Admin:", admin.id);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });