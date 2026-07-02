'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { ROLE_CAPABILITIES } from '@/lib/roles';

interface AdvisorRow {
  id: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  name: string;
  organization: string | null;
  role: string;
  isProtectedDeveloper?: boolean;
  _count: {
    projects: number;
  };
}

export default function AdminUsersPage() {
  const { advisor, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<AdvisorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const canManageUsers = advisor?.role === 'admin';

  const adminCount = useMemo(
    () => users.filter((user) => user.role === 'admin').length,
    [users]
  );

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/advisors');
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch users');
      }
      setUsers(data.advisors || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (canManageUsers) {
      fetchUsers();
    }
  }, [canManageUsers, fetchUsers]);

  const updateRole = async (user: AdvisorRow, nextRole: 'admin' | 'advisor') => {
    setUpdatingId(user.id);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/admin/advisors/${user.id}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: nextRole }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update role');
      }

      setUsers((prev) =>
        prev.map((item) => (item.id === user.id ? data.advisor : item))
      );
      setSuccess(`Updated role for ${user.name} to ${nextRole}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role');
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  if (authLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
        </div>
      </div>
    );
  }

  if (!advisor || !canManageUsers) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">Admin access required to manage user roles.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600">
          Control account roles for advisor onboarding and access permissions.
          Protected developer access remains full-access and cannot be edited here.
        </p>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Advisor permissions</h2>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              {ROLE_CAPABILITIES.advisor.map((capability) => (
                <li key={capability} className="rounded-xl bg-slate-50 px-4 py-3">
                  {capability}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Admin permissions</h2>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              {ROLE_CAPABILITIES.admin.map((capability) => (
                <li key={capability} className="rounded-xl bg-emerald-50 px-4 py-3">
                  {capability}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
          {success}
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Accounts</h2>
            <p className="text-sm text-gray-500">
              {users.length} users · {adminCount} admins
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500" />
            </div>
          ) : users.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Name</th>
                    <th className="text-left py-3 px-2">Email</th>
                    <th className="text-left py-3 px-2">Organization</th>
                    <th className="text-left py-3 px-2">Projects</th>
                    <th className="text-left py-3 px-2">Role</th>
                    <th className="text-left py-3 px-2">Joined</th>
                    <th className="text-right py-3 px-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const isCurrentUser = user.id === advisor.id;
                    const isProtectedDeveloper = Boolean(user.isProtectedDeveloper);
                    const canDemoteCurrent = !isCurrentUser && !isProtectedDeveloper;
                    const isUpdating = updatingId === user.id;

                    return (
                      <tr key={user.id} className="border-b last:border-0">
                        <td className="py-3 px-2 font-medium text-gray-900">{user.name}</td>
                        <td className="py-3 px-2 text-gray-600">{user.email}</td>
                        <td className="py-3 px-2 text-gray-600">{user.organization || '—'}</td>
                        <td className="py-3 px-2 text-gray-600">{user._count.projects}</td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                user.role === 'admin'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {isProtectedDeveloper ? 'developer' : user.role}
                            </span>
                            {isProtectedDeveloper && (
                              <span className="text-xs text-gray-500">Protected</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-2 text-gray-600">{formatDate(user.createdAt)}</td>
                        <td className="py-3 px-2 text-right">
                          {isProtectedDeveloper ? (
                            <span className="text-xs text-gray-500">Protected developer access</span>
                          ) : user.role === 'admin' ? (
                            canDemoteCurrent ? (
                              <Button
                                variant="outline"
                                size="sm"
                                loading={isUpdating}
                                onClick={() => updateRole(user, 'advisor')}
                              >
                                Make Advisor
                              </Button>
                            ) : (
                              <span className="text-xs text-gray-500">Current account</span>
                            )
                          ) : (
                            <Button
                              size="sm"
                              loading={isUpdating}
                              onClick={() => updateRole(user, 'admin')}
                            >
                              Make Admin
                            </Button>
                          )}
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
