'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { ScoreGauge } from '@/components/ui/Progress';
import type { PolicyInterpretation } from '@/lib/schemas';
import { fundingTierLabel, normalizeFundingTier } from '@/lib/funding-tiers';

interface PolicyResultsProps {
  policy: PolicyInterpretation;
}

export function PolicyResults({ policy }: PolicyResultsProps) {
  const fundingTier = normalizeFundingTier(policy.debt_sensitivity_tier);
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">M300 Policy Alignment</h2>
          <span className={`
            inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
            ${fundingTier === 'tier_1' ? 'bg-emerald-100 text-emerald-800' : 'bg-yellow-100 text-yellow-800'}
          `}>
            {fundingTierLabel(fundingTier)}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Score Gauge */}
        <ScoreGauge
          score={policy.m300_alignment_score}
          label="M300 Alignment Score"
          tier={policy.debt_sensitivity_tier}
        />

        {/* Alignment Narrative */}
        <div>
          <h3 className="font-medium text-gray-900 mb-2">Analysis</h3>
          <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
            {policy.alignment_narrative}
          </p>
        </div>

        {/* Grant-Suitable Elements */}
        <div>
          <h3 className="font-medium text-gray-900 mb-2">Grant-Suitable Elements</h3>
          <ul className="space-y-2">
            {policy.grant_suitable_elements.map((element, index) => (
              <li key={index} className="flex items-start space-x-2">
                <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-600">{element}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Debt Exposure Risks */}
        <div>
          <h3 className="font-medium text-gray-900 mb-2">Debt Exposure Risks</h3>
          <ul className="space-y-2">
            {policy.debt_exposure_risks.map((risk, index) => (
              <li key={index} className="flex items-start space-x-2">
                <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-sm text-gray-600">{risk}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended Framing */}
        {policy.recommended_framing && (
          <div className="bg-emerald-50 rounded-lg p-4">
            <h3 className="font-medium text-emerald-900 mb-2">Recommended Framing</h3>
            <p className="text-sm text-emerald-800">{policy.recommended_framing}</p>
          </div>
        )}

        {/* M300 Tags */}
        {policy.m300_specific_tags && (
          <div>
            <h3 className="font-medium text-gray-900 mb-2">M300 Alignment Indicators</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(policy.m300_specific_tags)
                .filter(([, value]) => value)
                .map(([key]) => (
                  <span
                    key={key}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {key.replace(/_/g, ' ')}
                  </span>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
