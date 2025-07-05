import { useState, useEffect, useCallback } from 'react';

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  key: string;
}

export function useCache<T>(
  fetcher: () => Promise<T>,
  options: CacheOptions
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { ttl = 5 * 60 * 1000, key } = options; // Default 5 minutes

  const getCachedData = useCallback((): T | null => {
    try {
      const cached = localStorage.getItem(`cache_${key}`);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < ttl) {
          return data;
        }
        localStorage.removeItem(`cache_${key}`);
      }
    } catch (err) {
      console.warn('Cache read error:', err);
    }
    return null;
  }, [key, ttl]);

  const setCachedData = useCallback((data: T): void => {
    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (err) {
      console.warn('Cache write error:', err);
    }
  }, [key]);

  const fetchData = useCallback(async (useCache = true) => {
    setLoading(true);
    setError(null);

    try {
      // Try cache first
      if (useCache) {
        const cachedData = getCachedData();
        if (cachedData) {
          setData(cachedData);
          setLoading(false);
          return cachedData;
        }
      }

      // Fetch fresh data
      const freshData = await fetcher();
      setData(freshData);
      setCachedData(freshData);
      return freshData;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetcher, getCachedData, setCachedData]);

  const invalidateCache = useCallback(() => {
    localStorage.removeItem(`cache_${key}`);
  }, [key]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: () => fetchData(false),
    invalidateCache
  };
}