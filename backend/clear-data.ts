import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Starting database cleanup...');
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.internship.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.userSession.deleteMany();
  await prisma.user.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.project.deleteMany();
  await prisma.contractor.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.featuredProject.deleteMany();
  await prisma.journey.deleteMany();
  await prisma.upcomingProject.deleteMany();
  await prisma.workshopRegistration.deleteMany();
  console.log('? Database cleared successfully! Admins and Workshops were preserved.');
}

main().catch(console.error).finally(async () => { await prisma.$disconnect(); });
