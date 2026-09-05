import React from 'react';
import { fundingTierLabel, normalizeFundingTier, type FundingTierValue } from '@/lib/funding-tiers';

interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'emerald' | 'yellow' | 'orange' | 'red' | 'blue';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export function Progress({
  value,
  max = 100,
  size = 'md',
  color = 'emerald',
  showLabel = false,
  label,
  className = '',
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const colors = {
    emerald: 'bg-emerald-500',
    yellow: 'bg-yellow-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
    blue: 'bg-blue-500',
  };

  return (
    <div className={className}>
      {(showLabel || label) && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showLabel && (
            <span className="text-sm font-medium text-gray-600">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`${colors[color]} ${sizes[size]} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface ScoreGaugeProps {
  score: number;
  label?: string;
  tier?: FundingTierValue;
}

export function ScoreGauge({ score, label, tier }: ScoreGaugeProps) {
  const fundingTier = normalizeFundingTier(tier);
  const getColor = () => {
    if (fundingTier === 'tier_1' || score >= 70) return 'emerald';
    return 'yellow';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{label || 'Score'}</span>
        <span className="text-lg font-bold text-gray-900">{score}/100</span>
      </div>
      <Progress value={score} color={getColor()} size="lg" />
      {tier && (
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
            ${fundingTier === 'tier_1' ? 'bg-emerald-100 text-emerald-800' : 'bg-yellow-100 text-yellow-800'}
          `}>
            {fundingTier === 'tier_1' ? 'TIER 1' : 'TIER 2'}
          </span>
          <span className="text-sm text-gray-500">{fundingTierLabel(fundingTier).split('— ')[1]}</span>
        </div>
      )}
    </div>
  );
}
