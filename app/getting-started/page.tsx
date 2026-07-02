'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ROLE_CAPABILITIES } from '@/lib/roles';

const advisorSteps = [
  {
    title: 'Create one complete analysis',
    body: 'Start with one real project. The intake form captures the inputs used by policy scoring, grant matching, and the readiness checklist.',
  },
  {
    title: 'Review the readiness checklist carefully',
    body: 'Items marked ready, not ready, or status pending come directly from the backend evidence assessment. Expand pending items to see what is still missing.',
  },
  {
    title: 'Use proposal outline and grant matches together',
    body: 'The strongest workflow is to treat the outline as the narrative layer and the checklist as the evidence layer before sharing with funders or reviewers.',
  },
];

export default function GettingStartedPage() {
  const router = useRouter();
  const { advisor, loading } = useAuth();

  useEffect(() => {
    if (!loading && !advisor) {
      router.push('/login');
    }
  }, [advisor, loading, router]);

  if (loading || !advisor) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-500" />
        </div>
      </div>
    );
  }

  const capabilities = ROLE_CAPABILITIES[advisor.role === 'admin' ? 'admin' : 'advisor'];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-slate-200">
          <CardHeader>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
              First-time advisor workflow
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Start with one real project and let the checklist expose missing evidence.
            </h1>
            <p className="mt-3 max-w-3xl text-slate-600">
              M300 Support Desk is most useful when the intake, readiness assessment, and proposal outline are treated as one continuous submission workflow.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {advisorSteps.map((step, index) => (
              <div key={step.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-2 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <h2 className="text-lg font-semibold text-slate-900">{step.title}</h2>
                </div>
                <p className="pl-11 text-sm leading-7 text-slate-600">{step.body}</p>
              </div>
            ))}

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Link href="/analyze">
                <Button>Start New Analysis</Button>
              </Link>
              <Link href="/projects">
                <Button variant="outline">Open Projects</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-emerald-200 bg-emerald-50/60">
            <CardHeader>
              <h2 className="text-xl font-semibold text-slate-900">Your access level</h2>
              <p className="text-sm text-slate-600">
                Signed in as <span className="font-medium">{advisor.name}</span> with the effective role <span className="font-medium">{advisor.role}</span>.
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-slate-700">
                {capabilities.map((capability) => (
                  <li key={capability} className="rounded-xl border border-white/70 bg-white/90 px-4 py-3">
                    {capability}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-slate-900">What to do next</h2>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-slate-600">
              <p>Use original source material whenever possible. The readiness engine is only as credible as the evidence entered into the intake.</p>
              <p>When an item remains status pending, expand it on the project page and resolve the specific question shown under &quot;Questions to Answer&quot;.</p>
              {advisor.role === 'admin' && (
                <p>As an admin, you can also create invites, review new users, and adjust their access from the Users page.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
