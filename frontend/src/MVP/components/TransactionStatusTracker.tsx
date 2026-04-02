/**
 * Transaction Status Tracker
 * Real-time transaction status monitoring
 *
 * Features:
 * - Live status updates
 * - Step-by-step progress
 * - On-chain confirmation tracking
 */

import React, { useState, useEffect } from 'react';

type TransactionStatus = 'pending' | 'submitted' | 'confirming' | 'confirmed' | 'failed';

interface TransactionStatusTrackerProps {
  transactionHash?: string;
  status: TransactionStatus;
  onStatusChange?: (status: TransactionStatus) => void;
  showDetails?: boolean;
}

const TransactionStatusTracker: React.FC<TransactionStatusTrackerProps> = ({
  transactionHash,
  status,
  onStatusChange,
  showDetails = true,
}) => {
  const [confirmations, setConfirmations] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Simulate confirmation progress
  useEffect(() => {
    if (status === 'submitted' || status === 'confirming') {
      const timer = setInterval(() => {
        setConfirmations(prev => {
          const newConfirmations = prev + 1;
          if (newConfirmations >= 12) {
            onStatusChange?.('confirmed');
            return 12;
          }
          return newConfirmations;
        });
        setElapsedTime(prev => prev + 2);
      }, 2000);

      return () => clearInterval(timer);
    }
  }, [status, onStatusChange]);

  const getStatusColor = () => {
    switch (status) {
      case 'pending': return 'bg-gray-400';
      case 'submitted': return 'bg-blue-500';
      case 'confirming': return 'bg-amber-500';
      case 'confirmed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'pending': return 'Preparing Transaction...';
      case 'submitted': return 'Submitted to Network';
      case 'confirming': return `Confirming (${confirmations}/12)`;
      case 'confirmed': return 'Confirmed';
      case 'failed': return 'Failed';
      default: return 'Unknown';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const steps = [
    { label: 'Input', completed: ['submitted', 'confirming', 'confirmed', 'failed'].includes(status) },
    { label: 'Review', completed: ['submitted', 'confirming', 'confirmed', 'failed'].includes(status) },
    { label: 'Signature', completed: ['submitted', 'confirming', 'confirmed', 'failed'].includes(status) },
    { label: 'Submitted', completed: ['submitted', 'confirming', 'confirmed', 'failed'].includes(status) },
    { label: 'Confirming', completed: ['confirming', 'confirmed', 'failed'].includes(status), active: status === 'confirming' },
    { label: 'Confirmed', completed: status === 'confirmed', active: status === 'confirmed' },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      {/* Status Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${getStatusColor()} animate-pulse`} />
          <span className="font-bold text-[#023D7A]">{getStatusText()}</span>
        </div>
        {status !== 'pending' && status !== 'failed' && (
          <span className="text-sm text-gray-600">⏱️ {formatTime(elapsedTime)}</span>
        )}
      </div>

      {/* Progress Steps */}
      {showDetails && (
        <div className="mb-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.label} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all ${
                  step.active
                    ? 'bg-[#00A8A8] text-white scale-110 animate-pulse'
                    : step.completed
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step.completed ? '✓' : index + 1}
                </div>
                <span className={`ml-1 text-xs font-medium hidden lg:block ${
                  step.active ? 'text-[#00A8A8]' : step.completed ? 'text-green-600' : 'text-gray-400'
                }`}>
                  {step.label}
                </span>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 ${
                    step.completed ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transaction Hash */}
      {transactionHash && (
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Transaction Hash</p>
          <div className="flex items-center justify-between">
            <code className="text-xs font-mono text-[#023D7A]">
              {transactionHash.slice(0, 10)}...{transactionHash.slice(-8)}
            </code>
            <a
              href={`https://amoy.polygonscan.com/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#00A8A8] hover:text-[#0D7A7A] font-medium flex items-center gap-1"
            >
              View
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      )}

      {/* On-chain vs Off-chain Info */}
      {showDetails && status !== 'pending' && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-xs font-semibold text-blue-800">On-chain</span>
            </div>
            <p className="text-xs text-blue-700">Token minting & transfer</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs font-semibold text-green-800">Off-chain</span>
            </div>
            <p className="text-xs text-green-700">Compliance & records</p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {status === 'confirmed' && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-bold text-green-900">Transaction Successful!</p>
              <p className="text-xs text-green-700 mt-1">
                Your transaction has been confirmed on the Polygon Amoy testnet.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {status === 'failed' && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-bold text-red-900">Transaction Failed</p>
              <p className="text-xs text-red-700 mt-1">
                The transaction failed to confirm. Please try again or contact support.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionStatusTracker;
