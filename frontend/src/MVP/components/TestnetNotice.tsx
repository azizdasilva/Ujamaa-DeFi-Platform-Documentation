/**
 * TestnetNotice Component
 * 
 * Prominent testnet disclaimer notice for MVP.
 * Should be displayed on all pages, typically in header or footer.
 * 
 * @reference 03_MVP_MOCKING_AND_TESTNET_STRATEGY.md Section 1.2
 * @reference 05_MVP_FRONTEND_SPECIFICATION.md Section 6.2
 * 
 * @notice MVP TESTNET: This is a testnet deployment. No real funds.
 */

import React from 'react';

interface TestnetNoticeProps {
  /**
   * Display variant
   * - 'banner': Full banner style
   * - 'badge': Compact badge style
   * - 'footer': Footer style
   * - 'modal': Modal overlay style
   */
  variant?: 'banner' | 'badge' | 'footer' | 'modal';
  
  /**
   * Custom className
   */
  className?: string;
  
  /**
   * Whether to show detailed information
   */
  showDetails?: boolean;
}

const TestnetNotice: React.FC<TestnetNoticeProps> = ({
  variant = 'badge',
  className = '',
  showDetails = false,
}) => {
  const [showModal, setShowModal] = React.useState(false);

  // Badge Variant (compact)
  if (variant === 'badge') {
    return (
      <>
        <div
          className={`
            inline-flex items-center gap-1.5
            px-3 py-1.5
            bg-amber-100 border border-amber-300
            rounded-full
            text-amber-800
            text-xs font-medium
            cursor-pointer
            hover:bg-amber-200 transition-colors
            ${className}
          `}
          onClick={() => setShowModal(true)}
          role="status"
          aria-label="Testnet notice"
        >
          {/* Warning Icon */}
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          
          <span>TESTNET</span>
          
          {/* Info Icon */}
          <svg
            className="w-3 h-3 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Modal */}
        {showModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <div
              className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-amber-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    🚀 Testnet Deployment
                  </h3>
                  
                  <div className="space-y-3 text-sm text-gray-600">
                    <p>
                      This is the <strong>Ujamaa DeFi Platform MVP</strong> running on{' '}
                      <strong>Polygon Amoy testnet</strong>.
                    </p>
                    
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold">•</span>
                        <span><strong>NO REAL MONEY</strong> is involved</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold">•</span>
                        <span>All tokens are <strong>TEST TOKENS</strong> only</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold">•</span>
                        <span>All bank integrations are <strong>SIMULATED</strong></span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold">•</span>
                        <span>All yields are <strong>SIMULATED</strong> using real math</span>
                      </li>
                    </ul>
                    
                    <div className="bg-gray-50 rounded-lg p-3 mt-4">
                      <p className="font-semibold text-gray-900 mb-1">Network Details:</p>
                      <ul className="text-xs space-y-1">
                        <li>Network: Polygon Amoy</li>
                        <li>Chain ID: 80002</li>
                        <li>Block Explorer: https://amoy.polygonscan.com/</li>
                      </ul>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowModal(false)}
                    className="mt-4 w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    I Understand
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Footer Variant
  if (variant === 'footer') {
    return (
      <div
        className={`
          w-full
          bg-gray-50 border-t border-gray-200
          px-4 py-3
          text-center
          ${className}
        `}
      >
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-amber-600">⚠️ MVP TESTNET:</span>
            {' '}This is a testnet deployment. No real funds are handled.
            {' '}Built on Polygon Amoy (Chain ID: 80002).
          </p>
        </div>
      </div>
    );
  }

  // Modal Variant (overlay)
  if (variant === 'modal') {
    return (
      <div
        className={`
          fixed inset-0
          bg-black/70
          flex items-center justify-center
          z-50 p-4
          ${className}
        `}
      >
        <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl animate-fadeIn">
          <div className="text-center">
            {/* Warning Icon */}
            <div className="w-20 h-20 rounded-full bg-amber-100 mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              🚀 MVP Testnet Deployment
            </h2>
            
            <p className="text-gray-600 mb-6">
              You are accessing the Ujamaa DeFi Platform MVP on Polygon Amoy testnet.
            </p>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm font-semibold text-red-800 mb-2">
                ⚠️ IMPORTANT NOTICE
              </p>
              <ul className="text-sm text-red-700 space-y-1 text-left">
                <li>• NO REAL MONEY is involved</li>
                <li>• All tokens are TEST TOKENS only</li>
                <li>• All integrations are SIMULATED</li>
              </ul>
            </div>
            
            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-[#00A8A8] hover:bg-[#0D7A7A] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Continue to Testnet
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default: Banner Variant
  return (
    <div
      className={`
        w-full
        bg-amber-50 border-b border-amber-200
        px-4 py-3
        ${className}
      `}
    >
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        {/* Warning Icon */}
        <svg
          className="w-5 h-5 text-amber-600 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        
        {/* Text */}
        <div className="flex-1">
          <p className="text-sm text-amber-800">
            <span className="font-semibold">TESTNET:</span>
            {' '}This is a testnet deployment. No real funds are handled.
          </p>
          {showDetails && (
            <p className="text-xs text-amber-700 mt-1">
              Network: Polygon Amoy (Chain ID: 80002) • All services are simulated
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestnetNotice;
