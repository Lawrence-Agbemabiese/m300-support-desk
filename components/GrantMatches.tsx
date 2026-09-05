'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import type { GrantMatch, GrantMatchItem } from '@/lib/schemas';
import { fundingTierLabel, normalizeFundingTier } from '@/lib/funding-tiers';

interface GrantMatchesProps {
  grants: GrantMatch;
}

function GrantCard({ match, rank }: { match: GrantMatchItem; rank: number }) {
  const [expanded, setExpanded] = useState(false);

  const tierColors = {
    tier_1: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    tier_2: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  };
  const fundingTier = normalizeFundingTier(match.debt_sensitivity_tier);

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'emerald';
    if (score >= 50) return 'yellow';
    if (score >= 30) return 'orange';
    return 'red';
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600">
              {rank}
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{match.funder_name}</h4>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm text-gray-500">{match.instrument_type.replace(/_/g, ' ')}</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${tierColors[fundingTier]}`}>
                  {fundingTierLabel(fundingTier)}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{match.fit_score}</div>
            <div className="text-xs text-gray-500">/ 100</div>
          </div>
        </div>

        <div className="mt-3">
          <Progress value={match.fit_score} color={getScoreColor(match.fit_score)} size="sm" />
        </div>

        <div className="flex items-center justify-between mt-3 text-sm">
          <span className="text-gray-500">
            {match.red_flags?.length || 0} red flag{match.red_flags?.length !== 1 ? 's' : ''}
          </span>
          <button className="text-emerald-600 hover:text-emerald-700">
            {expanded ? 'Show less' : 'Show more'}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-200 p-4 bg-gray-50 space-y-4">
          {/* Score Breakdown */}
          {match.score_breakdown && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">Score Breakdown</h5>
              <div className="grid grid-cols-5 gap-2 text-center">
                {Object.entries(match.score_breakdown)
                  .filter(([key]) => !key.includes('penalty') && !key.includes('modifier'))
                  .map(([key, value]) => (
                    <div key={key} className="bg-white rounded p-2 border border-gray-200">
                      <div className="text-lg font-semibold text-gray-900">{value}</div>
                      <div className="text-xs text-gray-500">{key.replace('_score', '').replace(/_/g, ' ')}</div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Fit Rationale */}
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">Why This Funder</h5>
            <ul className="space-y-1">
              {match.fit_rationale.map((rationale, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm">
                  <span className="text-emerald-500">-</span>
                  <span className="text-gray-600">{rationale}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Red Flags */}
          {match.red_flags && match.red_flags.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">Red Flags</h5>
              <ul className="space-y-1">
                {match.red_flags.map((flag, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm">
                    <span className="text-amber-500">!</span>
                    <span className="text-gray-600">{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Next Actions */}
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">Next Actions</h5>
            <ol className="space-y-1 list-decimal list-inside">
              {match.next_actions.map((action, index) => (
                <li key={index} className="text-sm text-gray-600">{action}</li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

export function GrantMatches({ grants }: GrantMatchesProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Grant Matches</h2>
          <span className="text-sm text-gray-500">
            {grants.matching_metadata?.total_funders_evaluated} funders evaluated
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Debt Sensitivity Summary */}
        {grants.debt_sensitivity_summary && (
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Debt Sensitivity Summary</h3>
            <div className="flex flex-wrap gap-4 mb-2">
              <div className="flex items-center space-x-1">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-sm text-gray-600">Tier 1 (low/no debt): {grants.debt_sensitivity_summary.tier_1_count}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-sm text-gray-600">Tier 2 (some debt): {grants.debt_sensitivity_summary.tier_2_count}</span>
              </div>
            </div>
            <p className="text-sm text-blue-800">{grants.debt_sensitivity_summary.recommendation}</p>
          </div>
        )}

        {/* Top Matches */}
        {grants.matches.length > 0 ? (
          <div className="space-y-3">
            {grants.matches.map((match, index) => (
              <GrantCard key={match.funder_id} match={match} rank={index + 1} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No suitable grant matches found.</p>
            <p className="text-sm">Consider adjusting project ownership model or parameters.</p>
          </div>
        )}

        {/* Funding Strategy */}
        <div className="border-t pt-4">
          <h3 className="font-medium text-gray-900 mb-2">Recommended Funding Strategy</h3>
          <p className="text-sm text-gray-600">{grants.overall_funding_strategy}</p>
        </div>

        {/* Excluded Funders */}
        {grants.excluded_funders && grants.excluded_funders.length > 0 && (
          <div className="border-t pt-4">
            <h3 className="font-medium text-gray-700 mb-2">Excluded Funders</h3>
            <div className="space-y-1">
              {grants.excluded_funders.map((excluded, index) => (
                <div key={index} className="text-sm text-gray-500">
                  <span className="font-medium">{excluded.funder_name}</span>: {excluded.exclusion_reason}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
