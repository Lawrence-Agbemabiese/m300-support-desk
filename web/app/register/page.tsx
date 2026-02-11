'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, advisor } = useAuth();
  const [inviteCode, setInviteCode] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Pre-fill invite code from URL
  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      setInviteCode(code.toUpperCase());
    }
  }, [searchParams]);

  // Redirect if already logged in
  useEffect(() => {
    if (advisor) {
      router.push('/projects');
    }
  }, [advisor, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (!inviteCode.trim()) {
      setError('Invite code is required');
      return;
    }

    setLoading(true);

    const result = await register({
      email,
      password,
      name,
      organization: organization || undefined,
      inviteCode: inviteCode.trim().toUpperCase(),
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push('/projects');
    }
  };

  if (advisor) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <h1 className="text-2xl font-bold text-gray-900 text-center">Create Account</h1>
        <p className="text-gray-600 text-center mt-1">
          Enter your invite code to register as an advisor
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-800 text-sm">
              {error}
            </div>
          )}

          <Input
            label="Invite Code"
            type="text"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            required
            placeholder="Enter your invite code"
            className="font-mono tracking-wider"
          />

          <Input
            label="Full Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Your full name"
          />

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />

          <Input
            label="Organization (Optional)"
            type="text"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            placeholder="Your organization name"
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="At least 8 characters"
          />

          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm your password"
          />

          <Button type="submit" className="w-full" loading={loading}>
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
            Sign in here
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <Suspense fallback={
        <Card>
          <CardContent className="py-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
          </CardContent>
        </Card>
      }>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
