/**
 * RPC Utilities for Ujamaa Monitor
 * 
 * Low-level RPC calls using viem for reading contract data
 */

import { createPublicClient, http, type PublicClient, type Address } from 'viem';
import { polygonAmoy } from 'viem/chains';
import { POLYGON_AMOY_RPC } from '../../config/monitor';
import {
  ULPTOKEN_ABI,
  LIQUIDITY_POOL_ABI,
  GUARANTEE_TOKEN_ABI,
  INDUSTRIAL_GATEWAY_ABI,
} from './contracts';

// Create public client for Polygon Amoy
export const publicClient: PublicClient = createPublicClient({
  chain: polygonAmoy,
  transport: http(POLYGON_AMOY_RPC),
});

// Helper to format address (show first/last 4 chars)
export const formatAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Helper to format ether value to human-readable number
export const formatEther = (wei: bigint, decimals: number = 18): number => {
  return Number(wei) / Math.pow(10, decimals);
};

// Helper to format basis points to percentage
export const formatBasisPoints = (bps: bigint): number => {
  return Number(bps) / 100;
};

// ULPToken readers
export const readUlpToken = {
  async getName(contractAddress: Address): Promise<string> {
    return await publicClient.readContract({
      address: contractAddress,
      abi: ULPTOKEN_ABI,
      functionName: 'name',
    });
  },

  async getSymbol(contractAddress: Address): Promise<string> {
    return await publicClient.readContract({
      address: contractAddress,
      abi: ULPTOKEN_ABI,
      functionName: 'symbol',
    });
  },

  async getTotalSupply(contractAddress: Address): Promise<bigint> {
    return await publicClient.readContract({
      address: contractAddress,
      abi: ULPTOKEN_ABI,
      functionName: 'totalSupply',
    });
  },

  async getNavPerShare(contractAddress: Address): Promise<bigint> {
    return await publicClient.readContract({
      address: contractAddress,
      abi: ULPTOKEN_ABI,
      functionName: 'navPerShare',
    });
  },

  async getLastNavUpdate(contractAddress: Address): Promise<bigint> {
    return await publicClient.readContract({
      address: contractAddress,
      abi: ULPTOKEN_ABI,
      functionName: 'lastNavUpdate',
    });
  },

  async getBalanceOf(contractAddress: Address, account: Address): Promise<bigint> {
    return await publicClient.readContract({
      address: contractAddress,
      abi: ULPTOKEN_ABI,
      functionName: 'balanceOf',
      args: [account],
    });
  },
};

// LiquidityPool readers
export const readLiquidityPool = {
  async getPoolBalance(contractAddress: Address): Promise<bigint> {
    return await publicClient.readContract({
      address: contractAddress,
      abi: LIQUIDITY_POOL_ABI,
      functionName: 'getPoolBalance',
    });
  },

  async getActiveFinancingsCount(contractAddress: Address): Promise<bigint> {
    return await publicClient.readContract({
      address: contractAddress,
      abi: LIQUIDITY_POOL_ABI,
      functionName: 'getActiveFinancingsCount',
    });
  },

  async getDefaultRate(contractAddress: Address): Promise<bigint> {
    return await publicClient.readContract({
      address: contractAddress,
      abi: LIQUIDITY_POOL_ABI,
      functionName: 'getDefaultRate',
    });
  },

  async getUtilizationRate(contractAddress: Address): Promise<bigint> {
    return await publicClient.readContract({
      address: contractAddress,
      abi: LIQUIDITY_POOL_ABI,
      functionName: 'getUtilizationRate',
    });
  },

  async getYieldAccrued24h(contractAddress: Address): Promise<bigint> {
    return await publicClient.readContract({
      address: contractAddress,
      abi: LIQUIDITY_POOL_ABI,
      functionName: 'getYieldAccrued24h',
    });
  },

  async getTotalValueLocked(contractAddress: Address): Promise<bigint> {
    return await publicClient.readContract({
      address: contractAddress,
      abi: LIQUIDITY_POOL_ABI,
      functionName: 'getTotalValueLocked',
    });
  },
};

// GuaranteeToken readers
export const readGuaranteeToken = {
  async getTotalSupply(contractAddress: Address): Promise<bigint> {
    return await publicClient.readContract({
      address: contractAddress,
      abi: GUARANTEE_TOKEN_ABI,
      functionName: 'totalSupply',
    });
  },

  async getGuarantee(
    contractAddress: Address,
    tokenId: bigint
  ): Promise<{
    certificateId: bigint;
    merchandiseValue: bigint;
    expiryDate: bigint;
    industrial: Address;
    isRedeemed: boolean;
    isDefaulted: boolean;
    stockHash: string;
  }> {
    return await publicClient.readContract({
      address: contractAddress,
      abi: GUARANTEE_TOKEN_ABI,
      functionName: 'getGuarantee',
      args: [tokenId],
    });
  },
};

// IndustrialGateway readers
export const readIndustrialGateway = {
  async getRegisteredIndustrialsCount(contractAddress: Address): Promise<bigint> {
    return await publicClient.readContract({
      address: contractAddress,
      abi: INDUSTRIAL_GATEWAY_ABI,
      functionName: 'getRegisteredIndustrialsCount',
    });
  },

  async getPendingApprovalsCount(contractAddress: Address): Promise<bigint> {
    return await publicClient.readContract({
      address: contractAddress,
      abi: INDUSTRIAL_GATEWAY_ABI,
      functionName: 'getPendingApprovalsCount',
    });
  },
};

// Event log readers
export const readEvents = {
  async getContractEvents({
    contractAddress,
    abi,
    eventName,
    fromBlock,
    toBlock = 'latest',
  }: {
    contractAddress: Address;
    abi: readonly any[];
    eventName: string;
    fromBlock: bigint | 'earliest';
    toBlock?: bigint | 'latest';
  }) {
    return await publicClient.getContractEvents({
      address: contractAddress,
      abi,
      eventName,
      fromBlock,
      toBlock,
    });
  },
};
