import apiClient from './apiClient';

let sessionPromise: Promise<any> | null = null;
let sessionPromiseTime = 0;

export function fetchAdminSession() {
  const now = Date.now();
  // Cache the session fetch promise for 1 second to debounce rapid calls
  if (sessionPromise && now - sessionPromiseTime < 1000) {
    return sessionPromise;
  }
  
  sessionPromise = apiClient.get('/api/auth/session');
  sessionPromiseTime = now;
  
  // Clear the cached promise if it rejects so we can try again later
  sessionPromise.catch(() => {
    sessionPromise = null;
    sessionPromiseTime = 0;
  });

  return sessionPromise;
}

export function clearAdminSessionCache() {
  sessionPromise = null;
  sessionPromiseTime = 0;
}
