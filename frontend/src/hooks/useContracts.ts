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
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'mintTestUJEURSelf',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

const EUROD_ABI = [
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
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
] as const;

/**
 * Hook for minting test EUROD (Testnet Fiat On-Ramp simulation)
 * Mainnet equivalent: Real bank webhook minting EUROD
 */
export function useMintEUROD() {
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
 * Hook for depositing EUROD into Liquidity Pool (Minting uLP shares)
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
 * Hook for approving EUROD spending
 * Required before depositing EUROD into ULPTokenizer
 */
export function useApproveEUROD() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();

  const approve = (spender: `0x${string}`, amount: number) => {
    if (!window.ethereum) throw new Error('No wallet connected');
    
    const amountWei = BigInt(Math.floor(amount * 1e18));
    
    writeContract({
      address: web3Config.CONTRACTS.MOCK_EUROD as `0x${string}`,
      abi: [{
        inputs: [
          { internalType: 'address', name: 'spender', type: 'address' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
        ],
        name: 'approve',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
      }],
      functionName: 'approve',
      args: [spender, amountWei],
    });
  };

  return { approve, hash, isPending, error, reset };
}

/**
 * Hook to check EUROD balance
 */
export function useEURODBalance(address?: `0x${string}`) {
  // Implementation would use useReadContract, kept simple for now
  return { balance: 0 };
}

/**
 * Hook to wait for transaction confirmation
 */
export function useTransactionWait(hash?: `0x${string}`) {
  return useWaitForTransactionReceipt({ hash });
}
