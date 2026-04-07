/**
 * Smart Contract Interactions
 * Handles on-chain deposit, minting, and investment flows.
 * Mainnet-ready architecture.
 */

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { web3Config } from '../config/web3';

// Minimal ABIs for required functions
const MOCK_FIAT_RAMP_ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'recipient', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'mintTestUJEUR',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

const ULP_TOKENIZER_ABI = [
  {
    inputs: [{ internalType: 'uint256', name: 'ujeurAmount', type: 'uint256' }],
    name: 'deposit',
    outputs: [{ internalType: 'uint256', name: 'uptMinted', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

/**
 * Hook for minting test UJEUR (Testnet Fiat On-Ramp simulation)
 * Mainnet equivalent: Real bank webhook minting stablecoins
 */
export function useMintUJEUR() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();

  const mint = (amount: number) => {
    if (!window.ethereum) throw new Error('No wallet connected');
    
    // Convert to 18 decimals
    const amountWei = BigInt(Math.floor(amount * 1e18));
    
    writeContract({
      address: web3Config.CONTRACTS.MOCK_FIAT_RAMP as `0x${string}`,
      abi: MOCK_FIAT_RAMP_ABI,
      functionName: 'mintTestUJEURSelf',
      args: [amountWei],
    });
  };

  return { mint, hash, isPending, error, reset };
}

/**
 * Hook for depositing UJEUR into Liquidity Pool (Minting uLP shares)
 * Mainnet equivalent: Exact same contract call
 */
export function useDepositULP() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();

  const deposit = (amount: number) => {
    if (!window.ethereum) throw new Error('No wallet connected');
    
    const amountWei = BigInt(Math.floor(amount * 1e18));
    
    writeContract({
      address: web3Config.CONTRACTS.ULP_TOKEN as `0x${string}`,
      abi: ULP_TOKENIZER_ABI,
      functionName: 'deposit',
      args: [amountWei],
    });
  };

  return { deposit, hash, isPending, error, reset };
}

/**
 * Hook to wait for transaction confirmation
 */
export function useTransactionWait(hash?: `0x${string}`) {
  return useWaitForTransactionReceipt({ hash });
}
