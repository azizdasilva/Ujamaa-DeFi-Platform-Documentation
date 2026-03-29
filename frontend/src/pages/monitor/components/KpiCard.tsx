/**
 * KpiCard Component
 * 
 * Reusable card component for displaying KPIs with status indicators
 */

import React from 'react';
import type { KpiStatus } from '../../../services/monitor/kpiCalculator';

interface KpiCardProps {
  label: string;
  value: string | number;
  formattedValue: string;
  status?: KpiStatus;
  tooltip?: string;
  change?: number;
  changeFormatted?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  className?: string;
}

const statusColors: Record<KpiStatus, string> = {
  green: 'border-green-500 bg-green-500/10',
  amber: 'border-yellow-500 bg-yellow-500/10',
  red: 'border-red-500 bg-red-500/10',
  neutral: 'border-indigo-500 bg-indigo-500/10',
};

const statusDotColors: Record<KpiStatus, string> = {
  green: 'bg-green-500',
  amber: 'bg-yellow-500',
  red: 'bg-red-500',
  neutral: 'bg-indigo-500',
};

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  formattedValue,
  status = 'neutral',
  tooltip,
  change,
  changeFormatted,
  icon,
  loading = false,
  className = '',
}) => {
  if (loading) {
    return (
      <div className={`p-6 rounded-xl border ${statusColors.neutral} animate-pulse ${className}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="h-4 bg-slate-700 rounded w-24"></div>
          <div className={`w-2 h-2 rounded-full ${statusDotColors.neutral}`}></div>
        </div>
        <div className="h-8 bg-slate-700 rounded w-32 mt-2"></div>
        {changeFormatted && (
          <div className="h-4 bg-slate-700 rounded w-16 mt-2"></div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`p-6 rounded-xl border-l-4 ${statusColors[status]} transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-1 ${className}`}
      title={tooltip}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon && <span className="text-2xl">{icon}</span>}
          <h3 className="text-sm font-medium text-slate-400">{label}</h3>
        </div>
        <div className={`w-2 h-2 rounded-full ${statusDotColors[status]}`} title={`Status: ${status}`}></div>
      </div>
      
      <div className="mt-3">
        <div className="text-3xl font-bold text-white tracking-tight">{formattedValue}</div>
        
        {changeFormatted && (
          <div className={`mt-2 text-sm font-medium ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {change >= 0 ? '↑' : '↓'} {changeFormatted}
          </div>
        )}
      </div>

      {tooltip && (
        <div className="mt-3 pt-3 border-t border-slate-700/50">
          <p className="text-xs text-slate-500">{tooltip}</p>
        </div>
      )}
    </div>
  );
};

// Health Score Gauge Component
interface HealthScoreGaugeProps {
  score: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const HealthScoreGauge: React.FC<HealthScoreGaugeProps> = ({
  score,
  label = 'Pool Health',
  size = 'md',
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Attention';
  };

  const sizeClasses = {
    sm: { container: 'w-20 h-20', text: 'text-2xl', label: 'text-xs' },
    md: { container: 'w-32 h-32', text: 'text-4xl', label: 'text-sm' },
    lg: { container: 'w-48 h-48', text: 'text-6xl', label: 'text-base' },
  };

  const circumference = 2 * Math.PI * 45; // r=45
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className={`relative ${sizeClasses[size].container}`}>
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-slate-700"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`${getScoreColor(score)} transition-all duration-1000 ease-out`}
          />
        </svg>
        
        {/* Score in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`${sizeClasses[size].text} font-bold ${getScoreColor(score)}`}>
            {score}
          </span>
        </div>
      </div>
      
      <div className="mt-3 text-center">
        <div className={`${sizeClasses[size].label} font-medium text-slate-400`}>{label}</div>
        <div className={`text-xs ${getScoreColor(score)}`}>{getScoreLabel(score)}</div>
      </div>
    </div>
  );
};

// Activity Feed Item Component
interface ActivityFeedItemProps {
  event: {
    type: string;
    description: string;
    timestamp: Date;
    txHash: string;
    amount?: number;
    industrial?: string;
    tokenId?: number;
  };
}

export const ActivityFeedItem: React.FC<ActivityFeedItemProps> = ({ event }) => {
  const getEventIcon = (type: string) => {
    const icons: Record<string, string> = {
      DepositReceived: '📥',
      FinancingApproved: '✅',
      GuaranteeMinted: '🏭',
      YieldAccrued: '📈',
      FinancingRepaid: '💰',
      IndustrialRegistered: '🏢',
      Transfer: '🔄',
    };
    return icons[type] || '📝';
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-800/50 transition-colors group">
      <div className="text-2xl flex-shrink-0">{getEventIcon(event.type)}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-200 truncate">{event.description}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-slate-500">{formatTimeAgo(event.timestamp)}</span>
          <span className="text-xs text-slate-600">•</span>
          <a
            href={`https://amoy.polygonscan.com/tx/${event.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-indigo-400 hover:text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            View on PolygonScan →
          </a>
        </div>
      </div>
    </div>
  );
};

// Activity Feed Component
interface ActivityFeedProps {
  events: Array<{
    type: string;
    description: string;
    timestamp: Date;
    txHash: string;
  }>;
  loading?: boolean;
  limit?: number;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ events, loading = false, limit = 10 }) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
            <div className="w-8 h-8 bg-slate-700 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-slate-700 rounded w-3/4"></div>
              <div className="h-3 bg-slate-700 rounded w-1/4 mt-2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <div className="text-4xl mb-2">📭</div>
        <p>No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {events.slice(0, limit).map((event, index) => (
        <ActivityFeedItem key={`${event.txHash}-${index}`} event={event} />
      ))}
    </div>
  );
};

// Section Header Component
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
  action?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, icon, action }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        {icon && <span className="text-3xl">{icon}</span>}
        <div>
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

// Loading Spinner Component
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeClasses[size]} border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin`}></div>
    </div>
  );
};

// Error Display Component
interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  return (
    <div className="p-6 rounded-xl border border-red-500/30 bg-red-500/10">
      <div className="flex items-center gap-3">
        <span className="text-2xl">⚠️</span>
        <div>
          <h3 className="font-medium text-red-400">Failed to load data</h3>
          <p className="text-sm text-slate-400 mt-1">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 px-4 py-2 text-sm bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
