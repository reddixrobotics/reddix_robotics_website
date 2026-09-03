import { useState, useEffect } from 'react';
import { workshopMediaService, type WorkshopMediaItem } from '@/services/workshopMediaService';

export function useWorkshopMedia() {
  const [media, setMedia] = useState<WorkshopMediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    workshopMediaService.getAll().then((data) => {
      setMedia(data);
      setLoading(false);
    });
  }, []);

  const getMedia = (key: string): WorkshopMediaItem | null => {
    const item = media.find((m) => m.sectionKey === key && m.mediaUrl);
    return item ?? null;
  };

  return { media, loading, getMedia };
}
