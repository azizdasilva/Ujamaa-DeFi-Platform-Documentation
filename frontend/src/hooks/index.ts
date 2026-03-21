/**
 * Custom React Hooks - Ujamaa DeFi Platform
 * MVP Testnet Release
 * 
 * @reference 03_DESIGN_SYSTEM_SPECIFICATION.md
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import config from '../config';
import type { Pool, PoolPosition, Notification } from '../types';

// =============================================================================
// POOL HOOKS
// =============================================================================

/**
 * Hook to fetch and manage pool data
 */
export function usePools() {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPools = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.API.BASE_URL}/api/${config.API.VERSION}/pools`);
      if (!response.ok) throw new Error('Failed to fetch pools');
      const data = await response.json();
      setPools(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPools();
  }, [fetchPools]);

  return { pools, loading, error, refetch: fetchPools };
}

/**
 * Hook to fetch a single pool
 */
export function usePool(poolId: string) {
  const [pool, setPool] = useState<Pool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!poolId) return;

    const fetchPool = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${config.API.BASE_URL}/api/${config.API.VERSION}/pools/${poolId}`
        );
        if (!response.ok) throw new Error('Failed to fetch pool');
        const data = await response.json();
        setPool(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchPool();
  }, [poolId]);

  return { pool, loading, error };
}

/**
 * Hook to filter pools
 */
export function useFilteredPools(pools: Pool[], searchQuery: string, selectedFamily: string) {
  return useMemo(() => {
    return pools.filter((pool) => {
      if (selectedFamily !== 'all' && pool.family !== selectedFamily) {
        return false;
      }
      if (searchQuery && !pool.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [pools, searchQuery, selectedFamily]);
}

// =============================================================================
// INVESTOR HOOKS
// =============================================================================

/**
 * Hook to fetch investor portfolio
 */
export function usePortfolio(investorId: string) {
  const [portfolio, setPortfolio] = useState<{
    totalValue: number;
    totalYieldEarned: number;
    positions: PoolPosition[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!investorId) return;

    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${config.API.BASE_URL}/api/${config.API.VERSION}/pools/portfolio/${investorId}`
        );
        if (!response.ok) throw new Error('Failed to fetch portfolio');
        const data = await response.json();
        setPortfolio(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [investorId]);

  return { portfolio, loading, error };
}

// =============================================================================
// TRANSACTION HOOKS
// =============================================================================

/**
 * Hook to manage investment transactions
 */
export function useInvestment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const invest = useCallback(async (poolId: string, amount: number, investorId: string) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const response = await fetch(
        `${config.API.BASE_URL}/api/${config.API.VERSION}/pools/${poolId}/invest`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pool_id: poolId, amount: amount.toString(), investor_id: investorId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Investment failed');
      }

      const data = await response.json();
      setSuccess(true);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { invest, loading, error, success };
}

/**
 * Hook to manage redemption transactions
 */
export function useRedemption() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const redeem = useCallback(async (poolId: string, shares: number, investorId: string) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const response = await fetch(
        `${config.API.BASE_URL}/api/${config.API.VERSION}/pools/${poolId}/redeem`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pool_id: poolId, shares: shares.toString(), investor_id: investorId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Redemption failed');
      }

      const data = await response.json();
      setSuccess(true);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { redeem, loading, error, success };
}

// =============================================================================
// COMPLIANCE HOOKS
// =============================================================================

/**
 * Hook to check jurisdiction compliance
 */
export function useJurisdictionCheck() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    jurisdiction: string;
    isAllowed: boolean;
    isBlocked: boolean;
    status: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkJurisdiction = useCallback(async (jurisdiction: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${config.API.BASE_URL}/api/${config.API.VERSION}/compliance/check-jurisdiction`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jurisdiction }),
        }
      );

      if (!response.ok) throw new Error('Compliance check failed');
      const data = await response.json();
      setResult(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { checkJurisdiction, loading, result, error };
}

// =============================================================================
// UI HOOKS
// =============================================================================

/**
 * Hook for notification management
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newNotification: Notification = { id, ...notification };
    setNotifications((prev) => [...prev, newNotification]);

    // Auto-remove after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, notification.duration || 5000);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const success = useCallback(
    (title: string, message: string, duration?: number) =>
      addNotification({ type: 'success', title, message, duration }),
    [addNotification]
  );

  const error = useCallback(
    (title: string, message: string, duration?: number) =>
      addNotification({ type: 'error', title, message, duration }),
    [addNotification]
  );

  const warning = useCallback(
    (title: string, message: string, duration?: number) =>
      addNotification({ type: 'warning', title, message, duration }),
    [addNotification]
  );

  const info = useCallback(
    (title: string, message: string, duration?: number) =>
      addNotification({ type: 'info', title, message, duration }),
    [addNotification]
  );

  return { notifications, addNotification, removeNotification, success, error, warning, info };
}

/**
 * Hook for dark mode
 */
export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDark]);

  const toggle = useCallback(() => setIsDark((prev) => !prev), []);

  return { isDark, toggle };
}

/**
 * Hook for local storage
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue] as const;
}

/**
 * Hook for window size (responsive)
 */
export function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateSize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
}

/**
 * Hook for debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for click outside
 */
export function useClickOutside<T extends HTMLElement>(handler: () => void) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handler]);

  return ref;
}

/**
 * Hook for keyboard shortcuts
 */
export function useKeyboardShortcut(key: string, handler: () => void, modifiers: string[] = []) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const keyMatches = event.key.toLowerCase() === key.toLowerCase();
      const modifiersMatch = modifiers.every((modifier) => {
        if (modifier === 'ctrl') return event.ctrlKey;
        if (modifier === 'shift') return event.shiftKey;
        if (modifier === 'alt') return event.altKey;
        if (modifier === 'meta') return event.metaKey;
        return false;
      });

      if (keyMatches && modifiersMatch) {
        event.preventDefault();
        handler();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [key, modifiers, handler]);
}
