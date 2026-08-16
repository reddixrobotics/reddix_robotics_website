import apiClient from './apiClient';
import { Product } from '@/data/products'; // Keep using the interface from there, but we'll remove the mock data later

export const mapApiProductToFrontend = (apiProduct: any): Product => {
  return {
    id: apiProduct.id,
    name: apiProduct.name,
    category: apiProduct.category,
    description: apiProduct.description,
    price: apiProduct.price,
    imageUrl: apiProduct.images?.[0]?.url || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800', // Fallback image
    availability: apiProduct.availability ? 'In Stock' : 'Backorder',
    isFeatured: true, // We will just default this or handle it dynamically
    isNew: true, // Defaulting
    dateAdded: apiProduct.createdAt,
    images: apiProduct.images?.map((i: any) => i.url) || [],
    features: apiProduct.features || [],
    specifications: apiProduct.technicalSpecifications || {},
  };
};

export const publicProductService = {
  async getAll(): Promise<Product[]> {
    const res = await apiClient.get<any[]>('/api/products');
    return res.data.map(mapApiProductToFrontend);
  },

  async getById(id: string): Promise<Product | null> {
    try {
      const res = await apiClient.get<any>(`/api/products/${id}`);
      if (!res.data) return null;
      return mapApiProductToFrontend(res.data);
    } catch (e) {
      return null;
    }
  },

  async getRelated(category: string, excludeId: string, limit = 3): Promise<Product[]> {
    try {
      // For now, fetch all and filter client side. In a real app, this should be a backend query.
      const res = await apiClient.get<any[]>(`/api/products?category=${encodeURIComponent(category)}`);
      let products = res.data.map(mapApiProductToFrontend);
      products = products.filter(p => p.id !== excludeId);
      return products.slice(0, limit);
    } catch (e) {
      return [];
    }
  }
};
