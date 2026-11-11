import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const DEFAULT_ROS2_APPLY_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSc76qKweYpJkVGv-zE3C80vmbQbE-GC3xRB533TY6osQfrKkg/viewform?usp=header';

function extractUrlFromParam(urlStr: string): string | null {
  try {
    if (!urlStr) return null;
    if (urlStr.includes('apply=')) {
      const match = urlStr.match(/[?&]apply=([^&]+)/);
      if (match && match[1]) {
        return decodeURIComponent(match[1]).trim();
      }
    }
  } catch {
    // ignore parse error
  }
  return null;
}

export function useRos2ApplyUrl() {
  const [applyUrl, setApplyUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const param = new URLSearchParams(window.location.search).get('apply');
      if (param) return param.trim();
      const cached = localStorage.getItem('ros2_apply_url');
      if (cached && cached.trim()) return cached.trim();
    }
    return DEFAULT_ROS2_APPLY_URL;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchApplyUrl() {
      try {
        // 0. Check URL query param first (?apply=...)
        if (typeof window !== 'undefined') {
          const param = new URLSearchParams(window.location.search).get('apply');
          if (param && param.trim()) {
            const clean = param.trim();
            localStorage.setItem('ros2_apply_url', clean);
            if (isMounted) {
              setApplyUrl(clean);
              setLoading(false);
            }
            return;
          }
        }

        // 1. Try WorkshopMedia first (sectionKey: 'ros2_apply_url')
        try {
          const { data: mediaData, error: mediaError } = await supabase
            .from('WorkshopMedia')
            .select('mediaUrl')
            .eq('sectionKey', 'ros2_apply_url')
            .maybeSingle();

          if (!mediaError && mediaData?.mediaUrl && isMounted) {
            const trimmed = mediaData.mediaUrl.trim();
            if (trimmed) {
              localStorage.setItem('ros2_apply_url', trimmed);
              setApplyUrl(trimmed);
              setLoading(false);
              return;
            }
          }
        } catch {
          // Ignore if WorkshopMedia query fails
        }

        // 2. Query Workshop table
        try {
          const { data: workshops, error: wsError } = await supabase
            .from('Workshop')
            .select('*')
            .order('createdAt', { ascending: false });

          if (!wsError && workshops && workshops.length > 0 && isMounted) {
            for (const ws of workshops) {
              // 2a. Check if externalUrl has ?apply=
              const fromParam = extractUrlFromParam(ws.externalUrl);
              if (fromParam) {
                localStorage.setItem('ros2_apply_url', fromParam);
                setApplyUrl(fromParam);
                setLoading(false);
                return;
              }

              // 2b. Check if externalUrl is directly a Google Form or form link
              if (ws.externalUrl && ws.externalUrl.includes('docs.google.com/forms')) {
                const trimmed = ws.externalUrl.trim();
                localStorage.setItem('ros2_apply_url', trimmed);
                setApplyUrl(trimmed);
                setLoading(false);
                return;
              }

              // 2c. Check applyUrl column if exists
              const rawApply = ws.applyUrl || ws.apply_url;
              if (rawApply && typeof rawApply === 'string' && rawApply.trim()) {
                const trimmed = rawApply.trim();
                localStorage.setItem('ros2_apply_url', trimmed);
                setApplyUrl(trimmed);
                setLoading(false);
                return;
              }

              // 2d. Check if title contains ROS2 and externalUrl starts with http
              const titleLower = (ws.title || '').toLowerCase();
              if (titleLower.includes('ros2') && ws.externalUrl && ws.externalUrl.startsWith('http')) {
                const trimmed = ws.externalUrl.trim();
                localStorage.setItem('ros2_apply_url', trimmed);
                setApplyUrl(trimmed);
                setLoading(false);
                return;
              }
            }
          }
        } catch {
          // Ignore if Workshop query fails
        }
      } catch (err) {
        console.warn('Could not fetch dynamic ROS 2 apply URL, using current/default:', err);
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
