import { supabase } from '@/lib/supabase';

export interface WorkshopMediaItem {
  id: string;
  sectionKey: string;
  title: string;
  mediaUrl: string | null;
  posterUrl: string | null;
  mediaType: 'video' | 'image';
  altText: string;
  isActive: boolean;
  displayOrder: number;
}

export const workshopMediaService = {
  async getAll(): Promise<WorkshopMediaItem[]> {
    const { data, error } = await supabase
      .from('WorkshopMedia')
      .select('*')
      .order('displayOrder', { ascending: true });
      
    if (error || !data) return [];
    return data;
  },

  async getByKey(key: string): Promise<WorkshopMediaItem | null> {
    const { data, error } = await supabase
      .from('WorkshopMedia')
      .select('*')
      .eq('sectionKey', key)
      .single();
      
    if (error || !data) return null;
    return data;
  },
};
