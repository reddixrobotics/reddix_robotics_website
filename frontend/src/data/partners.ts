export type PartnershipType = 
  | 'Manufacturing' 
  | 'Technology Integration' 
  | 'Distribution & Sales' 
  | 'Research & Development' 
  | 'Software Solutions';

export interface Partner {
  id: string;
  companyName: string;
  country: string;
  description: string;
  type: PartnershipType;
  logoUrl?: string; // Will use CSS placeholders if undefined
}

export const partnersData: Partner[] = [
  {
    id: 'p-1',
    companyName: 'Apex Automation',
    country: 'Germany',
    description: 'Leading provider of heavy-duty industrial robotic arms and assembly line automation solutions.',
    type: 'Manufacturing'
  },
  {
    id: 'p-2',
    companyName: 'Nexus Logistics Solutions',
    country: 'United States',
    description: 'Specializes in warehouse automation, integrating our mobile robots into global supply chains.',
    type: 'Distribution & Sales'
  },
  {
    id: 'p-3',
    companyName: 'GlobalTech Industries',
    country: 'Japan',
    description: 'A key hardware partner supplying high-precision servomotors and sensory arrays.',
    type: 'Manufacturing'
  },
  {
    id: 'p-4',
    companyName: 'Visionary AI Systems',
    country: 'Canada',
    description: 'Collaborates on cutting-edge computer vision models and machine learning optimization.',
    type: 'Research & Development'
  },
  {
    id: 'p-5',
    companyName: 'AeroDynamics Corp',
    country: 'United Kingdom',
    description: 'Develops advanced aerospace robotics, utilizing our core autonomous navigation software.',
    type: 'Technology Integration'
  },
  {
    id: 'p-6',
    companyName: 'Synapse Data Networks',
    country: 'Singapore',
    description: 'Provides cloud infrastructure and edge computing solutions for our real-time robotics telemetry.',
    type: 'Software Solutions'
  },
  {
    id: 'p-7',
    companyName: 'Meridian Tech Distribution',
    country: 'Australia',
    description: 'Exclusive distribution partner for the Oceania region, handling B2B sales and enterprise support.',
    type: 'Distribution & Sales'
  },
  {
    id: 'p-8',
    companyName: 'Quantum Materials Inc.',
    country: 'South Korea',
    description: 'Research partner focused on lightweight, durable materials for next-generation robotic chassis.',
    type: 'Research & Development'
  }
];

export const partnerCountries = Array.from(new Set(partnersData.map(p => p.country))).sort();
