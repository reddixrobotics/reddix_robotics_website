import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const products = [
  {
    id: 'p-1',
    name: 'RDX-Pro 6-Axis Arm',
    category: 'Industrial Arms',
    description: 'High-precision 6-axis robotic arm designed for intricate assembly and micro-welding tasks in cleanroom environments.',
    price: 24500,
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
    availability: 'In Stock',
  },
  {
    id: 'p-2',
    name: 'AMR Logistics Node v3',
    category: 'Autonomous Mobile Robots',
    description: 'Heavy-duty autonomous mobile robot capable of moving up to 1000kg payloads across dynamic warehouse floors.',
    price: 32000,
    imageUrl: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&q=80&w=800',
    availability: 'Low Stock',
  },
  {
    id: 'p-3',
    name: 'OmniSense LiDAR Pro',
    category: 'Sensors & Vision',
    description: '360-degree high-resolution LiDAR with 200m range and built-in edge computing for real-time point cloud processing.',
    price: 4500,
    imageUrl: 'https://images.unsplash.com/photo-1527219525722-f9767a7f2884?auto=format&fit=crop&q=80&w=800',
    availability: 'In Stock',
  },
  {
    id: 'p-4',
    name: 'Neural Core Compute X',
    category: 'Compute Modules',
    description: 'Ruggedized edge computing module optimized for executing complex deep reinforcement learning policies in real-time.',
    price: 1850,
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    availability: 'In Stock',
  },
  {
    id: 'p-5',
    name: 'RDX Micro Manipulator',
    category: 'Industrial Arms',
    description: 'Sub-millimeter precision tabletop arm for electronics assembly and laboratory automation.',
    price: 12000,
    imageUrl: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&q=80&w=800',
    availability: 'Backorder',
  },
  {
    id: 'p-6',
    name: 'StereoVision Depth Camera',
    category: 'Sensors & Vision',
    description: 'Industrial-grade RGB-D camera designed for robotic perception, object detection, and spatial mapping.',
    price: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&q=80&w=800',
    availability: 'In Stock',
  },
  {
    id: 'p-7',
    name: 'AMR Fleet Manager License',
    category: 'Compute Modules',
    description: 'Enterprise software license and compute hardware for coordinating fleets of up to 50 Autonomous Mobile Robots.',
    price: 8000,
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    availability: 'In Stock',
  },
  {
    id: 'p-8',
    name: 'Cobot Gripper V2',
    category: 'Accessories',
    description: 'Versatile electric parallel gripper with integrated force/torque sensing, compatible with all RDX arms.',
    price: 950,
    imageUrl: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&q=80&w=800',
    availability: 'In Stock',
  }
];

async function main() {
  console.log('Seeding products...');
  for (const p of products) {
    const isAvailable = p.availability !== 'Backorder';
    
    await prisma.product.upsert({
      where: { id: p.id },
      update: {
        name: p.name,
        category: p.category,
        description: p.description,
        price: p.price,
        availability: isAvailable,
      },
      create: {
        id: p.id,
        name: p.name,
        category: p.category,
        description: p.description,
        price: p.price,
        availability: isAvailable,
      },
    });
    
    // Also add the primary image if we can
    const existingImages = await prisma.productImage.findMany({ where: { productId: p.id } });
    if (existingImages.length === 0) {
      await prisma.productImage.create({
        data: {
          productId: p.id,
          url: p.imageUrl,
          isPrimary: true
        }
      });
    }
    
    console.log(`Upserted product: ${p.name}`);
  }
  console.log('Products seeded successfully.');
}

main()
  .catch((e) => {
    console.error('Error seeding products:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
