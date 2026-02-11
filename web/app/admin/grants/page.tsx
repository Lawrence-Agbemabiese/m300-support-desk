'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';

interface DiscoveredGrant {
  id: string;
  createdAt: string;
  funderName: string;
  instrumentType: string | null;
  geographyFocus: string | null;
  thematicFocus: string | null;
  ticketSizeMin: number | null;
  ticketSizeMax: number | null;
  description: string;
  website: string | null;
  searchQuery: string | null;
  confidence: number | null;
  status: string;
  reviewNotes: string | null;
}

interface SearchHistory {
  id: string;
  createdAt: string;
  query: string;
  region: string | null;
  resultsCount: number;
  status: string;
}

const regionOptions = [
  { value: '', label: 'All Africa' },
  { value: 'West Africa', label: 'West Africa' },
  { value: 'East Africa', label: 'East Africa' },
  { value: 'Southern Africa', label: 'Southern Africa' },
  { value: 'Central Africa', label: 'Central Africa' },
  { value: 'North Africa', label: 'North Africa' },
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  duplicate: 'bg-gray-100 text-gray-800',
};

export default function AdminGrantsPage() {
  const { advisor, loading: authLoading } = useAuth();
  const [grants, setGrants] = useState<DiscoveredGrant[]>([]);
  const [searches, setSearches] = useState<SearchHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('pending');

  // Search form
  const [searchQuery, setSearchQuery] = useState('');
  const [searchRegion, setSearchRegion] = useState('');

  // Review modal
  const [reviewingGrant, setReviewingGrant] = useState<DiscoveredGrant | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchGrants = useCallback(async () => {
    try {
      const response = await fetch(`/api/grants/discovered?status=${filter}`);
      const data = await response.json();
      setGrants(data.grants || []);
    } catch (err) {
      setError('Failed to fetch grants');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  const fetchSearchHistory = useCallback(async () => {
    try {
      const response = await fetch('/api/grants/discover');
      const data = await response.json();
      setSearches(data.searches || []);
    } catch (err) {
      console.error('Failed to fetch search history');
    }
  }, []);

  useEffect(() => {
    if (advisor) {
      fetchGrants();
      fetchSearchHistory();
    }
  }, [advisor, fetchGrants, fetchSearchHistory]);

  const runSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearching(true);
    setError(null);

    try {
      const response = await fetch('/api/grants/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          region: searchRegion || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Search failed');
      }

      alert(`Found ${data.discoveredCount} new grant opportunities!`);
      setSearchQuery('');
      fetchGrants();
      fetchSearchHistory();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setSearching(false);
    }
  };

  const updateGrantStatus = async (grantId: string, status: string) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/grants/discovered/${grantId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, reviewNotes }),
      });

      if (!response.ok) throw new Error('Failed to update');

      setReviewingGrant(null);
      setReviewNotes('');
      fetchGrants();
    } catch (err) {
      alert('Failed to update grant status');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (authLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
      </div>
    );
  }

  if (!advisor) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">Please log in to access grant discovery.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Grant Discovery</h1>
        <p className="text-gray-600">
          Search for new grant opportunities and review discovered funders
        </p>
      </div>

      {/* Search Section */}
      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-lg font-semibold">Search for New Grants</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Search Query"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g., renewable energy grants for rural electrification"
              />
            </div>
            <Select
              label="Region Focus"
              options={regionOptions}
              value={searchRegion}
              onChange={(e) => setSearchRegion(e.target.value)}
            />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              AI will search for grant programs not already in our database
            </p>
            <Button onClick={runSearch} loading={searching} disabled={!searchQuery.trim()}>
              {searching ? 'Searching...' : 'Search for Grants'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">{error}</p>
          {error.includes('ANTHROPIC_API_KEY') && (
            <p className="text-red-600 text-sm mt-2">
              Get your API key from{' '}
              <a
                href="https://console.anthropic.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                console.anthropic.com
              </a>
            </p>
          )}
        </div>
      )}

      {/* Recent Searches */}
      {searches.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-lg font-semibold">Recent Searches</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {searches.slice(0, 5).map((search) => (
                <div
                  key={search.id}
                  className="flex items-center justify-between text-sm py-2 border-b last:border-0"
                >
                  <div>
                    <span className="font-medium">{search.query}</span>
                    {search.region && (
                      <span className="text-gray-500 ml-2">({search.region})</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-gray-500">
                    <span>{search.resultsCount} found</span>
                    <span>{formatDate(search.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Discovered Grants */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Discovered Grants</h2>
            <div className="flex items-center space-x-2">
              {['pending', 'approved', 'rejected', 'all'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    filter === status
                      ? 'bg-emerald-100 text-emerald-800 font-medium'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div>
            </div>
          ) : grants.length === 0 ? (
            <p className="text-center py-8 text-gray-500">
              No grants found. Run a search to discover new opportunities.
            </p>
          ) : (
            <div className="space-y-4">
              {grants.map((grant) => (
                <div
                  key={grant.id}
                  className="border rounded-lg p-4 hover:border-emerald-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-gray-900">{grant.funderName}</h3>
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            statusColors[grant.status] || 'bg-gray-100'
                          }`}
                        >
                          {grant.status}
                        </span>
                        {grant.confidence && (
                          <span className="text-xs text-gray-500">
                            {Math.round(grant.confidence * 100)}% confidence
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{grant.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        {grant.instrumentType && <span>{grant.instrumentType}</span>}
                        {grant.geographyFocus && <span>| {grant.geographyFocus}</span>}
                        {(grant.ticketSizeMin || grant.ticketSizeMax) && (
                          <span>
                            | {formatCurrency(grant.ticketSizeMin)} -{' '}
                            {formatCurrency(grant.ticketSizeMax)}
                          </span>
                        )}
                        {grant.website && (
                          <a
                            href={grant.website.startsWith('http') ? grant.website : `https://${grant.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 hover:underline"
                          >
                            | Website
                          </a>
                        )}
                      </div>
                    </div>
                    {grant.status === 'pending' && (
                      <div className="flex space-x-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setReviewingGrant(grant);
                            setReviewNotes('');
                          }}
                        >
                          Review
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Modal */}
      {reviewingGrant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Review Grant</h3>
            <div className="mb-4">
              <p className="font-medium">{reviewingGrant.funderName}</p>
              <p className="text-sm text-gray-600 mt-1">{reviewingGrant.description}</p>
            </div>
            <Textarea
              label="Review Notes (optional)"
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Add notes about this grant..."
              rows={3}
            />
            <div className="flex justify-end space-x-3 mt-4">
              <Button
                variant="outline"
                onClick={() => setReviewingGrant(null)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                onClick={() => updateGrantStatus(reviewingGrant.id, 'rejected')}
                loading={saving}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                Reject
              </Button>
              <Button
                variant="outline"
                onClick={() => updateGrantStatus(reviewingGrant.id, 'duplicate')}
                loading={saving}
              >
                Duplicate
              </Button>
              <Button
                onClick={() => updateGrantStatus(reviewingGrant.id, 'approved')}
                loading={saving}
              >
                Approve
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
