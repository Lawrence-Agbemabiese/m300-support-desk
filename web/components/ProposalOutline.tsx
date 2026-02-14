'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { ProposalCoach } from '@/lib/schemas';

interface ProposalOutlineProps {
  coach: ProposalCoach;
}

const sectionLabels: Record<string, string> = {
  problem_statement: 'Problem Statement',
  theory_of_change: 'Theory of Change',
  community_ownership_governance: 'Community Ownership & Governance',
  technical_approach: 'Technical Approach',
  affordability_tariff_principles: 'Affordability & Tariff Principles',
  implementation_plan: 'Implementation Plan',
  mel_framework: 'M&E Framework',
  risk_register: 'Risk Register',
};

function FormattedSectionContent({ content }: { content: string }) {
  const cleaned = content.trim().replace(/^"+|"+$/g, '');
  const lines = cleaned
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const hasBullets = lines.some((line) => line.startsWith('- '));

  if (!hasBullets) {
    return <p className="text-gray-600 whitespace-pre-wrap">{cleaned}</p>;
  }

  const introLines = lines.filter((line) => !line.startsWith('- '));
  const bulletLines = lines.filter((line) => line.startsWith('- ')).map((line) => line.slice(2).trim());

  return (
    <div className="space-y-2">
      {introLines.map((line, idx) => (
        <p key={`intro-${idx}`} className="text-gray-600">
          {line}
        </p>
      ))}
      <ul className="list-disc list-inside space-y-1 text-gray-600">
        {bulletLines.map((line, idx) => (
          <li key={`bullet-${idx}`}>{line}</li>
        ))}
      </ul>
    </div>
  );
}

function ProposalSection({ title, content, index }: { title: string; content: string; index: number }) {
  const [expanded, setExpanded] = useState(index < 3); // First 3 sections expanded by default
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-3">
          <span className="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center text-sm font-medium">
            {index + 1}
          </span>
          <span className="font-medium text-gray-900">{title}</span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="p-4 bg-white">
          <div className="prose prose-sm max-w-none">
            <FormattedSectionContent content={content} />
          </div>
          <div className="mt-3 flex justify-end">
            <Button variant="ghost" size="sm" onClick={copyToClipboard}>
              {copied ? 'Copied!' : 'Copy to clipboard'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function ProposalOutline({ coach }: ProposalOutlineProps) {
  const [expandAll, setExpandAll] = useState(false);

  const sections = Object.entries(coach.proposal_outline).map(([key, content]) => ({
    key,
    title: sectionLabels[key] || key.replace(/_/g, ' '),
    content,
  }));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Proposal Outline</h2>
            <p className="text-sm text-gray-500">Targeted at: {coach.target_funder}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setExpandAll(!expandAll)}>
            {expandAll ? 'Collapse All' : 'Expand All'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {sections.map((section, index) => (
          <ProposalSection
            key={section.key}
            title={section.title}
            content={section.content}
            index={index}
          />
        ))}

        {/* M300 Alignment Statement */}
        {coach.m300_alignment_statement && (
          <div className="mt-6 bg-emerald-50 rounded-lg p-4">
            <h3 className="font-medium text-emerald-900 mb-2">M300 Alignment Statement</h3>
            <p className="text-sm text-emerald-800">{coach.m300_alignment_statement}</p>
          </div>
        )}

        {/* Debt Sensitivity Statement */}
        {coach.debt_sensitivity_statement && (
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Debt Sensitivity Statement</h3>
            <p className="text-sm text-blue-800">{coach.debt_sensitivity_statement}</p>
          </div>
        )}

        {/* Funder-Specific Guidance */}
        {coach.funder_specific_guidance && (
          <div className="border-t pt-4 mt-4">
            <h3 className="font-medium text-gray-900 mb-3">Funder-Specific Guidance</h3>

            {coach.funder_specific_guidance.key_funder_priorities && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Key Funder Priorities</h4>
                <ul className="space-y-1">
                  {coach.funder_specific_guidance.key_funder_priorities.map((priority, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <span className="text-emerald-500">-</span>
                      <span className="text-gray-600">{priority}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {coach.funder_specific_guidance.common_mistakes_to_avoid && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Common Mistakes to Avoid</h4>
                <ul className="space-y-1">
                  {coach.funder_specific_guidance.common_mistakes_to_avoid.map((mistake, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <span className="text-amber-500">!</span>
                      <span className="text-gray-600">{mistake}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {coach.funder_specific_guidance.recommended_attachments && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Recommended Attachments</h4>
                <ul className="space-y-1">
                  {coach.funder_specific_guidance.recommended_attachments.map((doc, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <span className="text-blue-500">-</span>
                      <span className="text-gray-600">{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
