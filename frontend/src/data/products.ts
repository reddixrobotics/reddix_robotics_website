export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  imageUrl: string;
  availability: 'In Stock' | 'Low Stock' | 'Backorder';
  isFeatured: boolean;
  isNew: boolean;
  dateAdded: string;
  
  // Detailed fields
  images: string[];
  features: string[];
  specifications: Record<string, string>;
}

export const categories = [
  'All',
  'Industrial Arms',
  'Autonomous Mobile Robots',
  'Sensors & Vision',
  'Compute Modules',
  'Accessories'
];

export const products: Product[] = [
  {
    id: 'p-1',
    name: 'RDX-Pro 6-Axis Arm',
    category: 'Industrial Arms',
    description: 'High-precision 6-axis robotic arm designed for intricate assembly and micro-welding tasks in cleanroom environments.',
    price: 24500,
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
    availability: 'In Stock',
    isFeatured: true,
    isNew: false,
    dateAdded: '2025-10-15T00:00:00Z',
    images: [
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&q=80&w=1200'
    ],
    features: [
      'Sub-millimeter repeatability (±0.02mm)',
      'Integrated torque sensing on all joints',
      'IP67 rated for harsh environments',
      'ROS 2 native integration out of the box',
      'Collision detection and safe-stop capabilities'
    ],
    specifications: {
      'Payload': '5 kg',
      'Reach': '850 mm',
      'Degrees of Freedom': '6',
      'Weight': '18 kg',
      'Power Consumption': '250W typical',
      'Communication': 'EtherCAT, TCP/IP'
    }
  },
  {
    id: 'p-2',
    name: 'AMR Logistics Node v3',
    category: 'Autonomous Mobile Robots',
    description: 'Heavy-duty autonomous mobile robot capable of moving up to 1000kg payloads across dynamic warehouse floors.',
    price: 32000,
    imageUrl: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&q=80&w=800',
    availability: 'Low Stock',
    isFeatured: true,
    isNew: true,
    dateAdded: '2026-05-01T00:00:00Z',
    images: [
      'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200'
    ],
    features: [
      '1000kg payload capacity',
      'Omnidirectional drive system',
      'Fleet management software included',
      '12-hour continuous battery life',
      '2D LiDAR and 3D depth camera fusion for navigation'
    ],
    specifications: {
      'Max Payload': '1000 kg',
      'Max Speed': '1.5 m/s',
      'Navigation': 'SLAM (LiDAR + Vision)',
      'Battery': '48V 100Ah LiFePO4',
      'Charging Time': '2 hours (Fast Charge)',
      'Dimensions': '1200 x 800 x 300 mm'
    }
  },
  {
    id: 'p-3',
    name: 'OmniSense LiDAR Pro',
    category: 'Sensors & Vision',
    description: '360-degree high-resolution LiDAR with 200m range and built-in edge computing for real-time point cloud processing.',
    price: 4500,
    imageUrl: 'https://images.unsplash.com/photo-1527219525722-f9767a7f2884?auto=format&fit=crop&q=80&w=800',
    availability: 'In Stock',
    isFeatured: false,
    isNew: true,
    dateAdded: '2026-07-20T00:00:00Z',
    images: [
      'https://images.unsplash.com/photo-1527219525722-f9767a7f2884?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&q=80&w=1200'
    ],
    features: [
      '200m detection range at 10% reflectivity',
      '128 channels for dense point cloud generation',
      'Onboard point cloud downsampling and noise filtering',
      'Automotive grade durability (IP6K9K)',
      'Sub-degree angular resolution'
    ],
    specifications: {
      'Range': '0.5m - 200m',
      'Channels': '128',
      'Field of View': '360° Horizontal, 40° Vertical',
      'Points per Second': '2.4 Million',
      'Interface': 'Gigabit Ethernet',
      'Weight': '850g'
    }
  },
  {
    id: 'p-4',
    name: 'Neural Core Compute X',
    category: 'Compute Modules',
    description: 'Ruggedized edge computing module optimized for executing complex deep reinforcement learning policies in real-time.',
    price: 1850,
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    availability: 'In Stock',
    isFeatured: false,
    isNew: false,
    dateAdded: '2025-11-10T00:00:00Z',
    images: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200'
    ],
    features: [
      '275 TOPS of AI performance',
      'Fanless rugged aluminum enclosure',
      'Hardware-accelerated video encoding/decoding',
      'Pre-installed with standard ML frameworks (PyTorch, TensorFlow)',
      'Wide operating temperature range'
    ],
    specifications: {
      'Compute': '8-core ARM Cortex-A78AE',
      'GPU': '2048-core Ampere architecture',
      'Memory': '32GB LPDDR5',
      'Storage': '64GB eMMC 5.1',
      'Operating Temp': '-25°C to 80°C',
      'Power': '15W - 60W dynamic'
    }
  },
  {
    id: 'p-5',
    name: 'RDX Micro Manipulator',
    category: 'Industrial Arms',
    description: 'Sub-millimeter precision tabletop arm for electronics assembly and laboratory automation.',
    price: 12000,
    imageUrl: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&q=80&w=800',
    availability: 'Backorder',
    isFeatured: false,
    isNew: false,
    dateAdded: '2025-08-05T00:00:00Z',
    images: [
      'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200'
    ],
    features: [
      'Ultra-compact footprint for crowded workbenches',
      'Micron-level precision for PCB assembly',
      'Easily programmable via drag-to-teach interface',
      'Open API for Python and C++'
    ],
    specifications: {
      'Payload': '500 g',
      'Reach': '350 mm',
      'Degrees of Freedom': '4',
      'Repeatability': '±0.005mm',
      'Weight': '4.5 kg'
    }
  },
  {
    id: 'p-6',
    name: 'StereoVision Depth Camera',
    category: 'Sensors & Vision',
    description: 'Industrial-grade RGB-D camera designed for robotic perception, object detection, and spatial mapping.',
    price: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&q=80&w=800',
    availability: 'In Stock',
    isFeatured: false,
    isNew: false,
    dateAdded: '2026-02-14T00:00:00Z',
    images: [
      'https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&q=80&w=1200'
    ],
    features: [
      'Global shutter sensors for high-speed motion capture',
      'Onboard depth calculation (no host CPU load)',
      'Active IR stereo for textureless surfaces',
      'Factory calibrated with thermal compensation'
    ],
    specifications: {
      'Resolution': '1920 x 1080 (RGB), 1280 x 720 (Depth)',
      'Framerate': 'Up to 90fps',
      'Depth Range': '0.3m - 10m',
      'Interface': 'USB 3.2 Gen 1',
      'Enclosure': 'IP65 Aluminum'
    }
  },
  {
    id: 'p-7',
    name: 'AMR Fleet Manager License',
    category: 'Compute Modules',
    description: 'Enterprise software license and compute hardware for coordinating fleets of up to 50 Autonomous Mobile Robots.',
    price: 8000,
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    availability: 'In Stock',
    isFeatured: true,
    isNew: false,
    dateAdded: '2025-12-01T00:00:00Z',
    images: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200'
    ],
    features: [
      'Dynamic traffic control and deadlock resolution',
      'Real-time fleet monitoring dashboard',
      'REST API for WMS/ERP integration',
      'Automatic battery management and charging scheduling'
    ],
    specifications: {
      'Max Robots Supported': '50 per node',
      'Deployment': 'On-premise edge server included',
      'High Availability': 'Active-Passive cluster support',
      'Security': 'End-to-end TLS encryption'
    }
  },
  {
    id: 'p-8',
    name: 'Cobot Gripper V2',
    category: 'Accessories',
    description: 'Versatile electric parallel gripper with integrated force/torque sensing, compatible with all RDX arms.',
    price: 950,
    imageUrl: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&q=80&w=800',
    availability: 'In Stock',
    isFeatured: false,
    isNew: true,
    dateAdded: '2026-06-10T00:00:00Z',
    images: [
      'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&q=80&w=1200'
    ],
    features: [
      'Adjustable gripping force via software',
      'Integrated part detection',
      'Plug-and-play with Reddix tool flange',
      'Swappable custom fingertips'
    ],
    specifications: {
      'Stroke': '50 mm',
      'Grip Force': '20N - 200N programmable',
      'Weight': '0.8 kg',
      'Communication': 'RS485 / Modbus RTU'
    }
  }
];

// Mock API function for fetching a single product
export const getProductById = async (id: string): Promise<Product | undefined> => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 800));
  return products.find(p => p.id === id);
};

// Mock API function for fetching related products
export const getRelatedProducts = async (category: string, excludeId: string, limit = 3): Promise<Product[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return products
    .filter(p => p.category === category && p.id !== excludeId)
    .slice(0, limit);
};
