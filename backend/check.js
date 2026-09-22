const { PrismaClient } = require('@prisma/client');
async function run() {
  const prisma = new PrismaClient();
  const admin = await prisma.admin.findUnique({ where: { email: 'reddixrobotics@gmail.com' } });
  console.log(admin ? admin.role : 'NOT_FOUND');
  await prisma.$disconnect();
}
run();
