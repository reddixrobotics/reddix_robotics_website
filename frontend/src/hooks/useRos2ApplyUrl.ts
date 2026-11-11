import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const DEFAULT_ROS2_APPLY_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfOHo7D9BNF0ZeL7CAQTIMxhq_XQyWgo6oczNFk3QNXi5ifxQ/viewform?usp=header';

export function useRos2ApplyUrl() {
  const [applyUrl, setApplyUrl] = useState<string>(DEFAULT_ROS2_APPLY_URL);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchApplyUrl() {
      try {
        // 1. Try WorkshopMedia first (sectionKey: 'ros2_apply_url')
        const { data: mediaData, error: mediaError } = await supabase
          .from('WorkshopMedia')
          .select('mediaUrl')
          .eq('sectionKey', 'ros2_apply_url')
          .maybeSingle();

        if (!mediaError && mediaData?.mediaUrl && isMounted) {
          const trimmed = mediaData.mediaUrl.trim();
          if (trimmed) {
            setApplyUrl(trimmed);
            setLoading(false);
            return;
          }
        }

        // 2. Try Workshop table for ROS 2 workshop entry
        const { data: wsData } = await supabase
          .from('Workshop')
          .select('*')
          .or('id.ilike.%ros2%,title.ilike.%ros2%,externalUrl.ilike.%/workshops/ros2%')
          .limit(1);

        if (wsData && wsData.length > 0 && isMounted) {
          const ws = wsData[0];
          const found = (ws.applyUrl || ws.apply_url || '').trim();
          if (found) {
            setApplyUrl(found);
          }
        }
      } catch (err) {
        console.warn('Could not fetch dynamic ROS 2 apply URL, using default:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchApplyUrl();

    return () => {
      isMounted = false;
    };
  }, []);

  return { applyUrl, loading };
}
