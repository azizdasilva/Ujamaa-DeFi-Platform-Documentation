/**
 * Custom Hooks for Ujamaa Monitor
 * 
 * React hooks for fetching and managing monitor data
 */

import { useState, useEffect, useCallback } from 'react';
import { isMockDataEnabled, CONTRACT_ADDRESSES, POLLING_INTERVALS } from '../../../config/monitor';
import { mockReaders } from '../../../services/monitor/mockData';
import { readUlpToken, readLiquidityPool, readGuaranteeToken, readIndustrialGateway } from '../../../services/monitor/rpc';
import {
  formatNavPerShare,
  formatTvl,
  formatYieldAccrued,
  formatTokenSupply,
  formatHolderCount,
  formatDefaultRate,
  formatUtilizationRate,
  formatActiveFinancings,
  formatGuaranteeCount,
  formatIndustrials,
  calculatePoolHealthScore,
} from '../../../services/monitor/kpiCalculator';

// ULPToken data hook
export const useUlpData = () => {
  const [data, setData] = useState({
    name: '',
    symbol: '',
    totalSupply: 0n,
    navPerShare: 0n,
    lastNavUpdate: 0n,
    totalHolders: 47,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const useMock = isMockDataEnabled();
      const address = CONTRACT_ADDRESSES.ulpToken;

      const [name, symbol, totalSupply, navPerShare, lastNavUpdate] = useMock
        ? await Promise.all([
            mockReaders.ulpToken.getName(),
            mockReaders.ulpToken.getSymbol(),
            mockReaders.ulpToken.getTotalSupply(),
            mockReaders.ulpToken.getNavPerShare(),
            mockReaders.ulpToken.getLastNavUpdate(),
          ])
        : await Promise.all([
            readUlpToken.getName(address),
            readUlpToken.getSymbol(address),
            readUlpToken.getTotalSupply(address),
            readUlpToken.getNavPerShare(address),
            readUlpToken.getLastNavUpdate(address),
          ]);

      setData({
        name,
        symbol,
        totalSupply,
        navPerShare,
        lastNavUpdate,
        totalHolders: 0, // Will be populated from DB if available
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch ULP data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, POLLING_INTERVALS.CRITICAL);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Formatted KPIs
  const formattedKpis = {
    navPerShare: formatNavPerShare(data.navPerShare),
    totalSupply: formatTokenSupply(data.totalSupply, data.symbol || 'uLP'),
    tvl: formatTvl(data.totalSupply * data.navPerShare / 10n ** 18n), // Approximate TVL
    totalHolders: formatHolderCount(data.totalHolders),
  };

  return { data, formattedKpis, loading, error, refresh: fetchData };
};

// LiquidityPool data hook
export const usePoolData = () => {
  const [data, setData] = useState({
    poolBalance: 0n,
    activeFinancingsCount: 0n,
    defaultRate: 0n,
    utilizationRate: 0n,
    yieldAccrued24h: 0n,
    totalValueLocked: 0n,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const useMock = isMockDataEnabled();
      const address = CONTRACT_ADDRESSES.liquidityPool;

      const [poolBalance, activeFinancingsCount, defaultRate, utilizationRate, yieldAccrued24h, totalValueLocked] =
        useMock
          ? await Promise.all([
              mockReaders.liquidityPool.getPoolBalance(),
              mockReaders.liquidityPool.getActiveFinancingsCount(),
              mockReaders.liquidityPool.getDefaultRate(),
              mockReaders.liquidityPool.getUtilizationRate(),
              mockReaders.liquidityPool.getYieldAccrued24h(),
              mockReaders.liquidityPool.getTotalValueLocked(),
            ])
          : await Promise.all([
              readLiquidityPool.getPoolBalance(address),
              readLiquidityPool.getActiveFinancingsCount(address),
              readLiquidityPool.getDefaultRate(address),
              readLiquidityPool.getUtilizationRate(address),
              readLiquidityPool.getYieldAccrued24h(address),
              readLiquidityPool.getTotalValueLocked(address),
            ]);

      setData({
        poolBalance,
        activeFinancingsCount,
        defaultRate,
        utilizationRate,
        yieldAccrued24h,
        totalValueLocked,
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch pool data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, POLLING_INTERVALS.STANDARD);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Formatted KPIs
  const formattedKpis = {
    poolBalance: formatTvl(data.poolBalance),
    activeFinancings: formatActiveFinancings(Number(data.activeFinancingsCount)),
    defaultRate: formatDefaultRate(data.defaultRate),
    utilizationRate: formatUtilizationRate(data.utilizationRate),
    yieldAccrued24h: formatYieldAccrued(data.yieldAccrued24h),
    tvl: formatTvl(data.totalValueLocked),
  };

  // Calculate health score
  const healthScore = calculatePoolHealthScore({
    defaultRate: Number(data.defaultRate) / 100,
    utilizationRate: Number(data.utilizationRate) / 100,
    navChange: 0.5, // Would need historical data
    liquidityRatio: 15, // Would need additional data
  });

  return { data, formattedKpis, healthScore, loading, error, refresh: fetchData };
};

// GuaranteeToken data hook
export const useGuaranteeData = () => {
  const [data, setData] = useState({
    totalSupply: 0n,
    activeCount: 18n,
    redeemedCount: 5n,
    totalCollateralValue: 0n,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const useMock = isMockDataEnabled();
      const address = CONTRACT_ADDRESSES.guaranteeToken;

      const [totalSupply] = useMock
        ? await Promise.all([mockReaders.guaranteeToken.getTotalSupply()])
        : await Promise.all([readGuaranteeToken.getTotalSupply(address)]);

      // Mock the active/redeemed counts (would need additional contract functions in production)
      const activeCount = useMock ? 18n + BigInt(Math.floor(Math.random() * 3)) : totalSupply / 2n;
      const redeemedCount = useMock ? 5n + BigInt(Math.floor(Math.random() * 2)) : totalSupply / 2n;

      setData({
        totalSupply,
        activeCount,
        redeemedCount,
        totalCollateralValue: totalSupply * 10n ** 19n, // Mock value
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch guarantee data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, POLLING_INTERVALS.HISTORICAL);
    return () => clearInterval(interval);
  }, [fetchData]);

  const formattedKpis = {
    guaranteeCount: formatGuaranteeCount(
      Number(data.totalSupply),
      Number(data.activeCount),
      Number(data.redeemedCount)
    ),
    collateralValue: formatTvl(data.totalCollateralValue),
  };

  return { data, formattedKpis, loading, error, refresh: fetchData };
};

// IndustrialGateway data hook
export const useIndustrialData = () => {
  const [data, setData] = useState({
    registeredCount: 0n,
    pendingCount: 0n,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const useMock = isMockDataEnabled();
      const address = CONTRACT_ADDRESSES.industrialGateway;

      const [registeredCount, pendingCount] = useMock
        ? await Promise.all([
            mockReaders.industrialGateway.getRegisteredIndustrialsCount(),
            mockReaders.industrialGateway.getPendingApprovalsCount(),
          ])
        : await Promise.all([
            readIndustrialGateway.getRegisteredIndustrialsCount(address),
            readIndustrialGateway.getPendingApprovalsCount(address),
          ]);

      setData({ registeredCount, pendingCount });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch industrial data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, POLLING_INTERVALS.HISTORICAL);
    return () => clearInterval(interval);
  }, [fetchData]);

  const formattedKpis = {
    industrials: formatIndustrials(Number(data.registeredCount), Number(data.pendingCount)),
  };

  return { data, formattedKpis, loading, error, refresh: fetchData };
};

// Event feed hook
export const useEventFeed = () => {
  const [events, setEvents] = useState<
    Array<{
      type: string;
      description: string;
      timestamp: Date;
      txHash: string;
      amount?: number;
      industrial?: string;
      tokenId?: number;
    }>
  >([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    const useMock = isMockDataEnabled();
    
    if (useMock) {
      const newEvents = await mockReaders.events.getRecent();
      setEvents(newEvents);
    } else {
      // TODO: Implement real event fetching from blockchain
      // This would use readEvents.getContractEvents for each contract
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, POLLING_INTERVALS.EVENTS);
    return () => clearInterval(interval);
  }, [fetchEvents]);

  return { events, loading };
};

// Combined dashboard data hook
export const useDashboardData = () => {
  const ulpData = useUlpData();
  const poolData = usePoolData();
  const guaranteeData = useGuaranteeData();
  const industrialData = useIndustrialData();
  const eventFeed = useEventFeed();

  const allLoading = ulpData.loading || poolData.loading || guaranteeData.loading || industrialData.loading;
  const anyError = ulpData.error || poolData.error || guaranteeData.error || industrialData.error;

  return {
    ulp: ulpData,
    pool: poolData,
    guarantee: guaranteeData,
    industrial: industrialData,
    events: eventFeed,
    loading: allLoading,
    error: anyError,
  };
};
