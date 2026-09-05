'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ProjectIntakeForm } from '@/components/ProjectIntakeForm';
import { PolicyResults } from '@/components/PolicyResults';
import { GrantMatches } from '@/components/GrantMatches';
import { ProposalOutline } from '@/components/ProposalOutline';
import { ReadinessChecklist } from '@/components/ReadinessChecklist';
import { PDFDownloadButton } from '@/components/PDFDownloadButton';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { TradeOffExplorer } from '@/components/TradeOffExplorer';
import { useAuth } from '@/lib/auth-context';
import type { AnalysisResult, ProjectIntake } from '@/lib/schemas';
import { fundingTierName } from '@/lib/funding-tiers';

type ViewTab = 'policy' | 'tradeoffs' | 'grants' | 'proposal' | 'checklist';

export default function AnalyzePage() {
  const { advisor, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<ViewTab>('policy');

  const handleSubmit = async (
    data: ProjectIntake,
    options: { enhance: boolean; enhancedMode: boolean }
  ) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      if (options.enhance) {
        queryParams.set('enhance', 'true');
        if (options.enhancedMode) {
          queryParams.set('enhanced_mode', 'true');
        }
      }

      const response = await fetch(`/api/analyze?${queryParams}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze project');
      }

      const analysisResult: AnalysisResult = await response.json();
      setResult(analysisResult);
      setActiveTab('policy');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  const tabs: { id: ViewTab; label: string }[] = [
    { id: 'policy', label: 'Policy Alignment' },
    { id: 'tradeoffs', label: 'Trade-Off Explorer' },
    { id: 'grants', label: 'Grant Matches' },
    { id: 'proposal', label: 'Proposal Outline' },
    { id: 'checklist', label: 'Readiness Checklist' },
  ];

  if (authLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
      </div>
    );
  }

  if (!advisor) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 mb-4">
              Please log in to submit a project for analysis.
            </p>
            <Link href="/login">
              <Button>Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analyze Your Project</h1>
          <p className="text-gray-600">
            Complete the intake form to receive M300-aligned grant matching and proposal guidance.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        <ProjectIntakeForm onSubmit={handleSubmit} loading={loading} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{result.project.project_name}</h1>
          <p className="text-gray-600">
            {result.project.country} - {result.project.technology_type === 'other' && result.project.technology_other ? result.project.technology_other : result.project.technology_type.replace(/_/g, ' ')}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {result.metadata.enhanced && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
              AI-Enhanced ({result.metadata.model?.split('-').slice(1, 3).join(' ')})
            </span>
          )}
          <span className="text-sm text-gray-500">
            Processed in {result.metadata.processing_time_ms}ms
          </span>
          <PDFDownloadButton result={result} />
          <Button variant="outline" onClick={handleReset}>
            New Analysis
          </Button>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-3xl font-bold text-gray-900">{result.policy.m300_alignment_score}</div>
          <div className="text-sm text-gray-500">M300 Score</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className={`text-3xl font-bold ${
            result.policy.debt_sensitivity_tier === 'tier_1' ? 'text-emerald-600' : 'text-yellow-600'
          }`}>
            {fundingTierName(result.policy.debt_sensitivity_tier)}
          </div>
          <div className="text-sm text-gray-500">Funding Tier</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-3xl font-bold text-gray-900">
            {result.grants.matches[0]?.fit_score || 'N/A'}
          </div>
          <div className="text-sm text-gray-500">Top Match Score</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-3xl font-bold text-gray-900">
            {result.coach.readiness_summary?.ready_count || 0}/{result.coach.readiness_checklist.length}
          </div>
          <div className="text-sm text-gray-500">Items Ready</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activeTab === 'policy' && (
          <>
            <PolicyResults policy={result.policy} />
            <div className="lg:col-span-1">
              <GrantMatches grants={result.grants} />
            </div>
          </>
        )}

        {activeTab === 'tradeoffs' && result.tradeoffs && (
          <div className="lg:col-span-2">
            <TradeOffExplorer tradeoffs={result.tradeoffs} />
          </div>
        )}

        {activeTab === 'grants' && (
          <div className="lg:col-span-2">
            <GrantMatches grants={result.grants} />
          </div>
        )}

        {activeTab === 'proposal' && (
          <div className="lg:col-span-2">
            <ProposalOutline coach={result.coach} />
          </div>
        )}

        {activeTab === 'checklist' && (
          <>
            <ReadinessChecklist coach={result.coach} />
            <div className="space-y-6">
              <ProposalOutline coach={result.coach} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
