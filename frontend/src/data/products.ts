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
  depositPercentage?: number;
}

export const categories = [
  'All',
  'Industrial Arms',
  'Autonomous Mobile Robots',
  'Sensors & Vision',
  'Compute Modules',
  'Accessories'
];
