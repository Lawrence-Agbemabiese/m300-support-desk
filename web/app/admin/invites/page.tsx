'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';

interface Invite {
  id: string;
  code: string;
  email: string | null;
  createdAt: string;
  expiresAt: string | null;
  usedAt: string | null;
  usedBy: string | null;
  maxUses: number;
  useCount: number;
}

export default function AdminInvitesPage() {
  const { advisor, loading: authLoading } = useAuth();
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create invite form
  const [newEmail, setNewEmail] = useState('');
  const [expiresInDays, setExpiresInDays] = useState('7');
  const [maxUses, setMaxUses] = useState('1');

  // Newly created invite (to show copy prompt)
  const [newInvite, setNewInvite] = useState<Invite | null>(null);

  useEffect(() => {
    if (advisor?.role === 'admin') {
      fetchInvites();
    }
  }, [advisor]);

  const fetchInvites = async () => {
    try {
      const response = await fetch('/api/invites');
      const data = await response.json();
      setInvites(data.invites || []);
    } catch (err) {
      setError('Failed to fetch invites');
    } finally {
      setLoading(false);
    }
  };

  const createInvite = async () => {
    setCreating(true);
    setError(null);

    try {
      const response = await fetch('/api/invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newEmail || undefined,
          expiresInDays: parseInt(expiresInDays) || 7,
          maxUses: parseInt(maxUses) || 1,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create invite');
      }

      setNewInvite(data.invite);
      setNewEmail('');
      fetchInvites();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create invite');
    } finally {
      setCreating(false);
    }
  };

  const deleteInvite = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this invite?')) return;

    try {
      const response = await fetch(`/api/invites?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete invite');
      }

      fetchInvites();
    } catch (err) {
      setError('Failed to delete invite');
    }
  };

  const copyToClipboard = (code: string) => {
    const url = `${window.location.origin}/register?code=${code}`;
    navigator.clipboard.writeText(url);
    alert('Invite link copied to clipboard!');
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (authLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
      </div>
    );
  }

  if (!advisor || advisor.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">Admin access required to manage invites.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Manage Invites</h1>
        <p className="text-gray-600">
          Create and manage invite codes for new advisors
        </p>
      </div>

      {/* New Invite Created Modal */}
      {newInvite && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-green-700 mb-4">Invite Created!</h3>
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 mb-2">Invite Code:</p>
              <p className="text-2xl font-mono font-bold text-center tracking-wider">
                {newInvite.code}
              </p>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Share this code with the advisor, or send them the registration link below.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setNewInvite(null)}
              >
                Close
              </Button>
              <Button
                className="flex-1"
                onClick={() => copyToClipboard(newInvite.code)}
              >
                Copy Invite Link
              </Button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Create Invite */}
      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-lg font-semibold">Create New Invite</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Email (Optional)"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Restrict to specific email"
            />
            <Input
              label="Expires In (Days)"
              type="number"
              value={expiresInDays}
              onChange={(e) => setExpiresInDays(e.target.value)}
              min="1"
              max="365"
            />
            <Input
              label="Max Uses"
              type="number"
              value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
              min="1"
              max="100"
            />
          </div>
          <div className="mt-4">
            <Button onClick={createInvite} loading={creating}>
              Create Invite
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Invites List */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Active Invites</h2>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div>
            </div>
          ) : invites.length === 0 ? (
            <p className="text-center py-8 text-gray-500">
              No invites created yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Code</th>
                    <th className="text-left py-3 px-2">Email</th>
                    <th className="text-left py-3 px-2">Status</th>
                    <th className="text-left py-3 px-2">Expires</th>
                    <th className="text-left py-3 px-2">Uses</th>
                    <th className="text-right py-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invites.map((invite) => {
                    const isExpired = invite.expiresAt && new Date(invite.expiresAt) < new Date();
                    const isFullyUsed = invite.useCount >= invite.maxUses;
                    const isActive = !isExpired && !isFullyUsed;

                    return (
                      <tr key={invite.id} className="border-b last:border-0">
                        <td className="py-3 px-2 font-mono font-medium">
                          {invite.code}
                        </td>
                        <td className="py-3 px-2 text-gray-600">
                          {invite.email || 'Any'}
                        </td>
                        <td className="py-3 px-2">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {isExpired ? 'Expired' : isFullyUsed ? 'Used' : 'Active'}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-gray-600">
                          {formatDate(invite.expiresAt)}
                        </td>
                        <td className="py-3 px-2 text-gray-600">
                          {invite.useCount} / {invite.maxUses}
                        </td>
                        <td className="py-3 px-2 text-right">
                          <div className="flex justify-end space-x-2">
                            {isActive && (
                              <button
                                onClick={() => copyToClipboard(invite.code)}
                                className="text-emerald-600 hover:text-emerald-700 text-xs"
                              >
                                Copy Link
                              </button>
                            )}
                            <button
                              onClick={() => deleteInvite(invite.id)}
                              className="text-red-600 hover:text-red-700 text-xs"
                            >
                              Revoke
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
