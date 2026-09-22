export interface Employee {
  id: string;
  name: string;
  designation: string;
  photoUrl: string;
  experience: string;
  skills: string[];
  biography: string;
  linkedinUrl: string;
}

export interface Project {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  description: string;
  technologies: string[];
  year: number;
}

export const employees: Employee[] = [
  {
    id: 'emp-1',
    name: 'Dr. Elena Rostova',
    designation: 'Chief Executive Officer',
    photoUrl: 'https://i.pravatar.cc/150?u=elena',
    experience: '20+ years in Robotics & AI Leadership',
    skills: ['Strategic Planning', 'AI Research', 'Business Development'],
    biography: 'Dr. Rostova is a visionary leader with a Ph.D. in Autonomous Systems. Before founding Reddix Robotics, she led the AI division at a Fortune 50 technology firm.',
    linkedinUrl: 'https://linkedin.com'
  },
  {
    id: 'emp-2',
    name: 'Marcus Chen',
    designation: 'Head of AI Research',
    photoUrl: 'https://i.pravatar.cc/150?u=marcus',
    experience: '15 years in Machine Learning',
    skills: ['Deep Learning', 'Computer Vision', 'Reinforcement Learning'],
    biography: 'Marcus oversees all machine learning research at Reddix, focusing on creating adaptable, resilient AI models for unconstrained environments.',
    linkedinUrl: 'https://linkedin.com'
  },
  {
    id: 'emp-3',
    name: 'Sarah Jenkins',
    designation: 'VP of Hardware Engineering',
    photoUrl: 'https://i.pravatar.cc/150?u=sarah',
    experience: '12 years in Mechanical Engineering',
    skills: ['Mechatronics', 'Kinematics', 'Rapid Prototyping'],
    biography: 'Sarah is responsible for the physical design and manufacturing of all Reddix robotic systems, ensuring they are robust, safe, and scalable.',
    linkedinUrl: 'https://linkedin.com'
  },
  {
    id: 'emp-4',
    name: 'Dr. Kwame Osei',
    designation: 'Director of Autonomous Systems',
    photoUrl: 'https://i.pravatar.cc/150?u=kwame',
    experience: '10 years in SLAM and Navigation',
    skills: ['Path Planning', 'Sensor Fusion', 'ROS 2'],
    biography: 'Dr. Osei leads the team that gives our robots the ability to understand their surroundings and navigate safely through dynamic spaces.',
    linkedinUrl: 'https://linkedin.com'
  },
  {
    id: 'emp-5',
    name: 'Aisha Patel',
    designation: 'Lead Software Engineer',
    photoUrl: 'https://i.pravatar.cc/150?u=aisha',
    experience: '8 years in Distributed Systems',
    skills: ['C++', 'Rust', 'Edge Computing'],
    biography: 'Aisha architectures the high-performance, low-latency software stack that runs on the edge devices of our robotic fleet.',
    linkedinUrl: 'https://linkedin.com'
  },
  {
    id: 'emp-6',
    name: 'David Kim',
    designation: 'Principal Automation Engineer',
    photoUrl: 'https://i.pravatar.cc/150?u=david',
    experience: '14 years in Industrial Automation',
    skills: ['PLC Programming', 'Systems Integration', 'IoT'],
    biography: 'David bridges the gap between our cutting-edge AI and legacy industrial systems, enabling seamless integration into existing workflows.',
    linkedinUrl: 'https://linkedin.com'
  }
];

export const projects: Project[] = [
  {
    id: 'proj-1',
    name: 'Automated Logistics Hub',
    category: 'Logistics',
    imageUrl: 'https://images.unsplash.com/photo-1565626424178-5c1fa591dd8b?auto=format&fit=crop&q=80&w=800',
    description: 'Deployment of 500+ autonomous mobile robots (AMRs) for a Fortune 500 e-commerce fulfillment center, increasing throughput by 300% and reducing error rates to near zero.',
    technologies: ['ROS 2', 'LiDAR', 'Computer Vision', 'Fleet Management'],
    year: 2025
  },
  {
    id: 'proj-2',
    name: 'Surgical Precision Arm',
    category: 'Healthcare',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800',
    description: 'Development of a hyper-accurate, low-latency robotic arm for assisting in minimally invasive remote surgeries, featuring haptic feedback and sub-millimeter precision.',
    technologies: ['Kinematics', 'Haptics', 'Real-time OS', 'C++20'],
    year: 2026
  },
  {
    id: 'proj-3',
    name: 'Agri-Bot Harvester',
    category: 'Agriculture',
    imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=800',
    description: 'Computer-vision guided robotic harvesting system capable of identifying ripeness and picking delicate fruits at scale without damage, operating 24/7 in various weather conditions.',
    technologies: ['Deep Learning', 'Semantic Segmentation', 'Soft Robotics'],
    year: 2024
  },
  {
    id: 'proj-4',
    name: 'Deep Sea Inspection Drone',
    category: 'Energy',
    imageUrl: 'https://images.unsplash.com/photo-1605335032549-0118eb3065a7?auto=format&fit=crop&q=80&w=800',
    description: 'An autonomous underwater vehicle (AUV) designed to inspect offshore oil rigs and wind turbine foundations, equipped with sonar and high-definition cameras.',
    technologies: ['Sonar Processing', 'Fluid Dynamics', 'Edge AI'],
    year: 2025
  }
];
