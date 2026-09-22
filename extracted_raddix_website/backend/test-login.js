require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const argon2 = require('argon2');

async function test() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const admin = await prisma.admin.findUnique({ where: { email: 'saisatwikadhupam@gmail.com' } });
  console.log('Admin found:', !!admin);
  
  const valid = await argon2.verify(admin.passwordHash, '9014984113');
  console.log('Password valid:', valid);
  
  await prisma.$disconnect();
  await pool.end();
}
test().catch(e => console.error('Error:', e));
