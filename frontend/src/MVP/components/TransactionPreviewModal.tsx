/**
 * Transaction Preview Modal
 * Shows transaction details before confirmation
 *
 * Features:
 * - Amount, fees, uLP tokens breakdown
 * - Gas fee estimation
 * - Step-by-step flow
 */

import React, { useState } from 'react';
import { useAccount } from '../../hooks/useWallet';

interface TransactionPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  transactionType: 'investment' | 'redemption' | 'yield';
  amount: number;
  poolName?: string;
  estimatedULP?: number;
  gasFee?: number;
  managementFee?: number;
  performanceFee?: number;
}

const TransactionPreviewModal: React.FC<TransactionPreviewModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  transactionType,
  amount,
  poolName,
  estimatedULP = 0,
  gasFee = 0.5,
  managementFee = 0,
  performanceFee = 0,
}) => {
  const [step, setStep] = useState<'input' | 'review' | 'signing' | 'confirmation'>('input');
  const { addressShort, isConnected } = useAccount();

  const totalFees = managementFee + performanceFee + gasFee;
  const netAmount = transactionType === 'investment' ? amount + totalFees : amount - totalFees;

  const handleConfirm = () => {
    setStep('signing');
    // Simulate wallet signature delay
    setTimeout(() => {
      setStep('confirmation');
      onConfirm();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]" onClick={onClose} />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-[9999] px-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-scaleIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#023D7A] to-[#00A8A8] px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {step === 'input' && '📝 Transaction Preview'}
                {step === 'review' && '🔍 Review Transaction'}
                {step === 'signing' && '✍️ Signing...'}
                {step === 'confirmation' && '✅ Confirmed!'}
              </h2>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {['Input', 'Review', 'Signing', 'Confirmation'].map((label, index) => (
                <div key={label} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all ${
                    step === label.toLowerCase()
                      ? 'bg-[#00A8A8] text-white scale-110'
                      : ['input', 'review', 'signing', 'confirmation'].indexOf(step) > index
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {['input', 'review', 'signing', 'confirmation'].indexOf(step) > index ? '✓' : index + 1}
                  </div>
                  <span className={`ml-2 text-xs font-medium hidden sm:block ${
                    step === label.toLowerCase() ? 'text-[#00A8A8]' : 'text-gray-500'
                  }`}>
                    {label}
                  </span>
                  {index < 3 && (
                    <div className={`w-8 sm:w-12 h-0.5 mx-2 ${
                      ['input', 'review', 'signing', 'confirmation'].indexOf(step) > index
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {step === 'input' && (
              <div className="space-y-4">
                {/* Transaction Type */}
                <div className="p-4 bg-[#F3F8FA] rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Transaction Type</p>
                  <p className="text-lg font-bold text-[#023D7A] capitalize">
                    {transactionType}
                  </p>
                </div>

                {/* Amount */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Amount</p>
                  <p className="text-3xl font-bold text-[#023D7A]">€{amount.toLocaleString()}</p>
                </div>

                {/* Pool */}
                {poolName && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Pool</p>
                    <p className="font-semibold text-gray-900">{poolName}</p>
                  </div>
                )}

                {/* Wallet */}
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm text-gray-600">Connected:</span>
                  <code className="text-sm font-mono font-bold text-[#023D7A]">{addressShort}</code>
                </div>

                <button
                  onClick={() => setStep('review')}
                  className="w-full py-3 bg-gradient-to-r from-[#00A8A8] to-[#023D7A] hover:from-[#0D7A7A] hover:to-[#034F9A] text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl"
                >
                  Continue to Review →
                </button>
              </div>
            )}

            {step === 'review' && (
              <div className="space-y-4">
                {/* Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Principal Amount</span>
                    <span className="font-semibold">€{amount.toLocaleString()}</span>
                  </div>
                  {managementFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Management Fee</span>
                      <span className="font-semibold text-red-600">-€{managementFee.toFixed(2)}</span>
                    </div>
                  )}
                  {performanceFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Performance Fee</span>
                      <span className="font-semibold text-red-600">-€{performanceFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Gas Fee (Estimated)</span>
                    <span className="font-semibold text-red-600">-€{gasFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
                    <span className="text-[#023D7A]">Total Fees</span>
                    <span className="text-red-600">€{totalFees.toFixed(2)}</span>
                  </div>
                  <div className="border-t-2 border-[#023D7A] pt-2 flex justify-between text-lg">
                    <span className="font-bold text-[#023D7A]">
                      {transactionType === 'investment' ? 'Total to Pay' : 'You Receive'}
                    </span>
                    <span className="font-bold text-[#00A8A8]">
                      €{netAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* uLP Tokens */}
                {transactionType === 'investment' && estimatedULP > 0 && (
                  <div className="p-4 bg-gradient-to-r from-[#00A8A8]/10 to-[#023D7A]/10 rounded-xl border border-[#00A8A8]/30">
                    <p className="text-sm text-[#023D7A] font-semibold mb-1">You Will Receive</p>
                    <p className="text-2xl font-bold text-[#00A8A8]">{estimatedULP.toFixed(4)} uLP Tokens</p>
                    <p className="text-xs text-gray-600 mt-1">Value-accruing pool tokens</p>
                  </div>
                )}

                {/* On-chain vs Off-chain */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Transaction Breakdown</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-gray-600">On-chain: Token transfer & minting</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-gray-600">Off-chain: Record keeping & compliance</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep('input')}
                    className="flex-1 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="flex-1 py-3 bg-gradient-to-r from-[#00A8A8] to-[#023D7A] hover:from-[#0D7A7A] hover:to-[#034F9A] text-white font-bold rounded-xl transition-all shadow-lg"
                  >
                    Confirm & Sign →
                  </button>
                </div>
              </div>
            )}

            {step === 'signing' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 border-4 border-[#00A8A8] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-lg font-bold text-[#023D7A] mb-2">Waiting for Signature</p>
                <p className="text-sm text-gray-600">Please sign the transaction in your wallet</p>
              </div>
            )}

            {step === 'confirmation' && (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-xl font-bold text-[#023D7A] mb-2">Transaction Confirmed!</p>
                <p className="text-sm text-gray-600 mb-4">Your transaction has been successfully processed</p>
                
                {/* View on Explorer */}
                <a
                  href="https://amoy.polygonscan.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#00A8A8] hover:bg-[#0D7A7A] text-white font-bold rounded-xl transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View on PolygonScan
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TransactionPreviewModal;
