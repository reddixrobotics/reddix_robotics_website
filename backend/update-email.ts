import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const admin = await prisma.admin.findFirst();
  if (admin) {
    await prisma.admin.update({
      where: { id: admin.id },
      data: { email: 'reddixrobotics@gmail.com' }
    });
    console.log('Successfully updated admin email to reddixrobotics@gmail.com');
  } else {
    console.log('No admin found to update.');
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
