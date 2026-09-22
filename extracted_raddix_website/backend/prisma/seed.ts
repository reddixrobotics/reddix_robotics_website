import 'dotenv/config';
import { PrismaClient, AdminRole } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as argon2 from 'argon2';

// Prisma v7 requires an explicit driver adapter — use the same pattern as PrismaService
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Read credentials from env or fallback
  const email = process.env.INITIAL_ADMIN_EMAIL || 'admin@reddixrobotics.com';
  const password = process.env.INITIAL_ADMIN_PASSWORD || 'ReddixAdminSecure2026!';

  // Check if admin already exists
  const existingAdmin = await prisma.admin.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log(`Admin user with email ${email} already exists. Skipping.`);
    return;
  }

  // Hash password using Argon2id config matching NestJS service
  const passwordHash = await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });

  // Create initial SUPER_ADMIN
  const admin = await prisma.admin.create({
    data: {
      email,
      passwordHash,
      role: AdminRole.SUPER_ADMIN,
      twoFactorEnabled: false,
    },
  });

  console.log(`Created seed Admin:`);
  console.log(`- ID:    ${admin.id}`);
  console.log(`- Email: ${admin.email}`);
  console.log(`- Role:  ${admin.role}`);
  console.log(`- Temp Password: ${password}`);
  console.log(`\nIMPORTANT: Log in, go to /admin/settings, and enable 2FA immediately!`);
}

main()
  .catch((e) => {
    console.error('Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
