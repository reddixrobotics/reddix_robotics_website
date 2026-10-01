import { supabase } from '../lib/supabase';
import { Product } from '@/data/products';

export const mapApiProductToFrontend = (apiProduct: any): Product => {
  return {
    id: apiProduct.id,
    name: apiProduct.name,
    category: apiProduct.category,
    description: apiProduct.description,
    price: apiProduct.price,
    imageUrl: apiProduct.images?.[0]?.url || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
    availability: apiProduct.availability ? 'In Stock' : 'Backorder',
    isFeatured: true,
    isNew: true,
    dateAdded: apiProduct.createdAt,
    images: apiProduct.images?.map((i: any) => i.url) || [],
    features: apiProduct.features || [],
    specifications: apiProduct.technicalSpecifications || {},
    depositPercentage: apiProduct.depositPercentage,
  };
};

export const publicProductService = {
  async getAll(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('Product')
      .select('*, images:ProductImage(*)')
      .order('createdAt', { ascending: false });
      
    if (error || !data) return [];
    return data.map(mapApiProductToFrontend);
  },

  async getById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('Product')
      .select('*, images:ProductImage(*)')
      .eq('id', id)
      .single();
      
    if (error || !data) return null;
    return mapApiProductToFrontend(data);
  },

  async getRelated(category: string, excludeId: string, limit = 3): Promise<Product[]> {
    const { data, error } = await supabase
      .from('Product')
      .select('*, images:ProductImage(*)')
      .eq('category', category)
      .neq('id', excludeId)
      .limit(limit);
      
    if (error || !data) return [];
    return data.map(mapApiProductToFrontend);
  }
};
