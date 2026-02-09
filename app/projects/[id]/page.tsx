'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { PolicyResults } from '@/components/PolicyResults';
import { GrantMatches } from '@/components/GrantMatches';
import { ProposalOutline } from '@/components/ProposalOutline';
import { ReadinessChecklist } from '@/components/ReadinessChecklist';
import { PDFDownloadButton } from '@/components/PDFDownloadButton';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import type { AnalysisResult } from '@/lib/schemas';

interface ProjectDetail {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  advisorNotes: string | null;
  advisor: {
    id: string;
    name: string;
    email: string;
    organization: string | null;
  } | null;
  summary: {
    projectName: string;
    country: string;
    technologyType: string;
    estimatedCostUsd: number;
    m300Score: number | null;
    debtTier: string | null;
    topFunder: string | null;
    topFunderScore: number | null;
  };
  analysisResult: AnalysisResult | null;
}

type ViewTab = 'policy' | 'grants' | 'proposal' | 'checklist';

const statusOptions = [
  { value: 'submitted', label: 'Submitted' },
  { value: 'in_review', label: 'In Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'needs_info', label: 'Needs Info' },
  { value: 'archived', label: 'Archived' },
];

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ViewTab>('policy');
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Project not found');
        }
        throw new Error('Failed to load project');
      }
      const data = await response.json();
      setProject(data);
      setNotes(data.advisorNotes || '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error('Failed to update status');
      setProject((prev) => (prev ? { ...prev, status: newStatus } : null));
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setSaving(false);
    }
  };

  const saveNotes = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ advisorNotes: notes }),
      });
      if (!response.ok) throw new Error('Failed to save notes');
      setProject((prev) => (prev ? { ...prev, advisorNotes: notes } : null));
      setEditingNotes(false);
    } catch (err) {
      alert('Failed to save notes');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const tabs: { id: ViewTab; label: string }[] = [
    { id: 'policy', label: 'Policy Alignment' },
    { id: 'grants', label: 'Grant Matches' },
    { id: 'proposal', label: 'Proposal Outline' },
    { id: 'checklist', label: 'Readiness Checklist' },
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <svg
              className="w-12 h-12 mx-auto text-red-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-gray-700 mb-4">{error || 'Project not found'}</p>
            <Link href="/projects">
              <Button variant="outline">Back to Projects</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const result = project.analysisResult;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link
            href="/projects"
            className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Projects
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{project.summary.projectName}</h1>
          <p className="text-gray-600">
            {project.summary.country} - {project.summary.technologyType.replace(/_/g, ' ')}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Submitted: {formatDate(project.createdAt)}
            {project.advisor && (
              <span className="ml-2">
                by <span className="text-emerald-600 font-medium">{project.advisor.name}</span>
                {project.advisor.organization && ` (${project.advisor.organization})`}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {result && <PDFDownloadButton result={result} />}
          <select
            value={project.status}
            onChange={(e) => updateStatus(e.target.value)}
            disabled={saving}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Advisor Notes */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Advisor Notes</h3>
            {!editingNotes && (
              <Button variant="outline" size="sm" onClick={() => setEditingNotes(true)}>
                Edit Notes
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {editingNotes ? (
            <div className="space-y-3">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Add notes about this project..."
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingNotes(false);
                    setNotes(project.advisorNotes || '');
                  }}
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={saveNotes} loading={saving}>
                  Save Notes
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">
              {project.advisorNotes || 'No notes yet. Click "Edit Notes" to add notes.'}
            </p>
          )}
        </CardContent>
      </Card>

      {result ? (
        <>
          {/* Summary Bar */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <div className="text-3xl font-bold text-gray-900">
                {result.policy.m300_alignment_score}
              </div>
              <div className="text-sm text-gray-500">M300 Score</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <div
                className={`text-3xl font-bold ${
                  result.policy.debt_sensitivity_tier === 'tier_1'
                    ? 'text-emerald-600'
                    : result.policy.debt_sensitivity_tier === 'tier_2'
                    ? 'text-yellow-600'
                    : result.policy.debt_sensitivity_tier === 'tier_3'
                    ? 'text-orange-600'
                    : 'text-red-600'
                }`}
              >
                {result.policy.debt_sensitivity_tier?.replace('_', ' ').toUpperCase()}
              </div>
              <div className="text-sm text-gray-500">Debt Tier</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <div className="text-3xl font-bold text-gray-900">
                {result.grants.matches[0]?.fit_score || 'N/A'}
              </div>
              <div className="text-sm text-gray-500">Top Match Score</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <div className="text-3xl font-bold text-gray-900">
                {result.coach.readiness_summary?.ready_count || 0}/
                {result.coach.readiness_checklist.length}
              </div>
              <div className="text-sm text-gray-500">Items Ready</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
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
        </>
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            Analysis data not available for this project.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
