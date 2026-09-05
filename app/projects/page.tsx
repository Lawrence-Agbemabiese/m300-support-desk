'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth-context';
import { fundingTierName } from '@/lib/funding-tiers';

interface ProjectSummary {
  id: string;
  createdAt: string;
  updatedAt: string;
  projectName: string;
  country: string;
  technologyType: string;
  technologyOther: string | null;
  estimatedCostUsd: number;
  ownershipModel: string;
  projectStage: string;
  m300Score: number | null;
  debtTier: string | null;
  topFunder: string | null;
  topFunderScore: number | null;
  status: string;
  enhanced: boolean;
  advisor: {
    id: string;
    name: string;
    organization: string | null;
  } | null;
}

interface ProjectsResponse {
  projects: ProjectSummary[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

const statusColors: Record<string, string> = {
  submitted: 'bg-blue-100 text-blue-800',
  in_review: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  needs_info: 'bg-orange-100 text-orange-800',
  archived: 'bg-gray-100 text-gray-800',
};

const tierColors: Record<string, string> = {
  tier_1: 'text-emerald-600',
  tier_2: 'text-yellow-600',
};

export default function ProjectsPage() {
  const { advisor, loading: authLoading } = useAuth();
  const canViewAllProjects = advisor?.role === 'admin';
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [myProjectsOnly, setMyProjectsOnly] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 20,
    offset: 0,
    hasMore: false,
  });

  const fetchProjects = useCallback(async (offset = 0) => {
    if (!advisor) {
      setProjects([]);
      setPagination({
        total: 0,
        limit: 20,
        offset: 0,
        hasMore: false,
      });
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('limit', '20');
      params.set('offset', offset.toString());
      if (filter !== 'all') {
        params.set('status', filter);
      }
      if (canViewAllProjects && myProjectsOnly) {
        params.set('my_projects', 'true');
      }
      if (debouncedSearch) params.set('q', debouncedSearch);

      const response = await fetch(`/api/projects?${params}`);
      if (!response.ok) throw new Error('Failed to fetch projects');

      const data: ProjectsResponse = await response.json();
      setProjects(data.projects);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [advisor, canViewAllProjects, filter, myProjectsOnly, debouncedSearch]);

  useEffect(() => { const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300); return () => window.clearTimeout(timer); }, [search]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {authLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
      ) : (
        <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Project Submissions</h1>
          <p className="text-gray-600">
            {pagination.total} project{pagination.total !== 1 ? 's' : ''} tracked
          </p>
        </div>
        <Link href="/analyze">
          <Button>New Analysis</Button>
        </Link>
      </div>

      {advisor && (advisor.projectCount ?? 0) === 0 && (
        <Card className="mb-6 border-emerald-200 bg-emerald-50/70">
          <CardContent className="flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">First project in this workspace?</h2>
              <p className="mt-1 max-w-3xl text-sm text-slate-700">
                Start with one complete intake, then use the readiness checklist and proposal outline together. The onboarding page explains the recommended workflow and what your role can do.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/getting-started">
                <Button variant="outline">Open Guide</Button>
              </Link>
              <Link href="/analyze">
                <Button>Start Analysis</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <label className="block"><span className="mb-1 block text-sm font-medium text-gray-700">Search projects</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name, country, location, technology, ownership, or beneficiaries" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500" /></label>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500">Status:</span>
          {['all', 'submitted', 'in_review', 'approved', 'needs_info', 'archived'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                filter === status
                  ? 'bg-emerald-100 text-emerald-800 font-medium'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'All' : status.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        {canViewAllProjects && (
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={myProjectsOnly}
              onChange={(e) => setMyProjectsOnly(e.target.checked)}
              className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-sm text-gray-700">My Projects Only</span>
          </label>
        )}
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error}
        </div>
      )}

      {!advisor ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 mb-4">Please log in to view project submissions.</p>
            <Link href="/login">
              <Button>Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      ) : loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <svg
              className="w-12 h-12 mx-auto text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-gray-500 mb-4">No projects found</p>
            <Link href="/analyze">
              <Button>Create Your First Analysis</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`} className="block">
                <Card className="hover:border-emerald-300 transition-colors cursor-pointer">
                  <CardContent className="py-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {project.projectName}
                          </h3>
                          <span
                            className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                              statusColors[project.status] || 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {project.status.replace(/_/g, ' ')}
                          </span>
                          {project.enhanced && (
                            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                              AI-Enhanced
                            </span>
                          )}
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
                          <span>{project.country}</span>
                          <span>{project.technologyType === 'other' && project.technologyOther ? project.technologyOther : project.technologyType.replace(/_/g, ' ')}</span>
                          <span>{formatCurrency(project.estimatedCostUsd)}</span>
                          <span>{formatDate(project.createdAt)}</span>
                          {project.advisor && (
                            <>
                              <span className="text-emerald-600">
                                {project.advisor.name}
                                {project.advisor.organization && ` (${project.advisor.organization})`}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3 text-left sm:grid-cols-3 lg:min-w-[420px] lg:text-right">
                        {project.m300Score !== null && (
                          <div>
                            <div className="text-2xl font-bold text-gray-900">
                              {project.m300Score}
                            </div>
                            <div className="text-xs text-gray-500">M300 Score</div>
                          </div>
                        )}
                        {project.debtTier && (
                          <div>
                            <div
                              className={`text-lg font-bold ${
                                tierColors[project.debtTier] || 'text-gray-600'
                              }`}
                            >
                              {fundingTierName(project.debtTier)}
                            </div>
                            <div className="text-xs text-gray-500">Funding Tier</div>
                          </div>
                        )}
                        {project.topFunder && (
                          <div className="max-w-[150px]">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {project.topFunder}
                            </div>
                            <div className="text-xs text-gray-500">
                              Top Match ({project.topFunderScore}/100)
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {(pagination.offset > 0 || pagination.hasMore) && (
            <div className="flex justify-center space-x-4 mt-8">
              <Button
                variant="outline"
                disabled={pagination.offset === 0}
                onClick={() => fetchProjects(Math.max(0, pagination.offset - pagination.limit))}
              >
                Previous
              </Button>
              <span className="flex items-center text-sm text-gray-500">
                Showing {pagination.offset + 1}-
                {Math.min(pagination.offset + projects.length, pagination.total)} of{' '}
                {pagination.total}
              </span>
              <Button
                variant="outline"
                disabled={!pagination.hasMore}
                onClick={() => fetchProjects(pagination.offset + pagination.limit)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
        </>
      )}
    </div>
  );
}
