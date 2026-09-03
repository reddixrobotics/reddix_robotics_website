import apiClient from '@/services/apiClient';

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
    try {
      const res = await apiClient.get<WorkshopMediaItem[]>(`/api/workshop-media?t=${Date.now()}`);
      return res.data;
    } catch {
      return [];
    }
  },

  async getByKey(key: string): Promise<WorkshopMediaItem | null> {
    try {
      const res = await apiClient.get<WorkshopMediaItem>(`/api/workshop-media/${key}`);
      return res.data;
    } catch {
      return null;
    }
  },
};
