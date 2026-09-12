'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function Home() {
  const router = useRouter();

  return (
    <div className="bg-[linear-gradient(180deg,#f8fafc_0%,#f7fbf8_48%,#ffffff_100%)]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <section className="overflow-hidden rounded-[32px] border border-emerald-100 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_28%),linear-gradient(135deg,#ffffff_0%,#f5fbf8_58%,#eef8f3_100%)] shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <div className="px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
            <div className="max-w-4xl">
              <div className="inline-flex items-center rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 shadow-sm">
                Mission 300 grant-first project support
              </div>

              <h1 className="mt-6 max-w-4xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                M300 Co-Intelligent Support Desk
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
                Helping African communities and governments access grant funding for energy projects
                while protecting fiscal capacity and promoting local ownership.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={() => router.push('/analyze')}
                  size="lg"
                  className="rounded-xl px-7 py-3.5 font-semibold shadow-sm"
                >
                  Analyze Your Project
                </Button>
                <Button
                  onClick={() => router.push('/projects')}
                  size="lg"
                  variant="outline"
                  className="rounded-xl border-slate-300 px-7 py-3.5 font-semibold"
                >
                  View All Projects
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-600">
                <div className="rounded-full border border-slate-200 bg-white/90 px-4 py-2">
                  Invite-only advisor workspace
                </div>
                <div className="rounded-full border border-slate-200 bg-white/90 px-4 py-2">
                  Readiness checklist and proposal coaching
                </div>
                <div className="rounded-full border border-slate-200 bg-white/90 px-4 py-2">
                  Grant-fit scoring with PDF export
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="release-highlights-heading"
          className="mt-8 rounded-2xl border border-emerald-200 bg-white px-6 py-5 shadow-[0_12px_36px_rgba(15,23,42,0.05)] sm:flex sm:items-center sm:justify-between sm:gap-6"
        >
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">
              September 2026 update
            </p>
            <h2 id="release-highlights-heading" className="mt-2 text-xl font-bold text-slate-900">
              Projects are now searchable, revisable, and versioned.
            </h2>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
              Open any project to revise its inputs, rerun the analysis, and review its revision history.
              In the intake form, selecting Other for technology or ownership reveals a custom text field.
            </p>
          </div>
          <Button
            onClick={() => router.push('/projects')}
            variant="outline"
            className="mt-4 shrink-0 sm:mt-0"
          >
            Explore Updated Projects
          </Button>
        </section>

        <section className="mt-14">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
              Core capabilities
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Built to move viable projects toward credible grant submission.
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="rounded-2xl border-slate-200 p-7 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
                <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">Policy Alignment</h3>
              <p className="leading-7 text-gray-600">
                Analyze your project against M300 debt-sensitivity principles for optimal grant positioning.
              </p>
            </Card>

            <Card className="rounded-2xl border-slate-200 p-7 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">Grant Matching</h3>
              <p className="leading-7 text-gray-600">
                Find the best-fit funding sources from our curated database of 12+ grant programs.
              </p>
            </Card>

            <Card className="rounded-2xl border-slate-200 p-7 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100">
                <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">Proposal Coaching</h3>
              <p className="leading-7 text-gray-600">
                Get a grant-ready proposal outline with readiness checklist and actionable next steps.
              </p>
            </Card>
          </div>
        </section>

        <section className="mt-14 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_18px_56px_rgba(15,23,42,0.06)]">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">How It Works</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex items-start space-x-4 rounded-2xl bg-slate-50 p-4">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600 font-bold text-white">1</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Submit Project</h4>
                  <p className="mt-1 text-sm text-gray-600">Enter your energy project details</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 rounded-2xl bg-slate-50 p-4">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600 font-bold text-white">2</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Policy Analysis</h4>
                  <p className="mt-1 text-sm text-gray-600">Get M300 alignment score and debt-sensitivity tier</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 rounded-2xl bg-slate-50 p-4">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600 font-bold text-white">3</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Grant Matching</h4>
                  <p className="mt-1 text-sm text-gray-600">Receive ranked funder recommendations</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 rounded-2xl bg-slate-50 p-4">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600 font-bold text-white">4</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Proposal Draft</h4>
                  <p className="mt-1 text-sm text-gray-600">Get tailored proposal outline and checklist</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-emerald-100 bg-[linear-gradient(180deg,#f8fdfb_0%,#effaf4_100%)] p-8 shadow-[0_18px_56px_rgba(16,185,129,0.08)]">
            <h3 className="text-xl font-bold text-slate-900">Getting started</h3>
            <p className="mt-3 leading-7 text-slate-600">
              The intake form usually takes 2-3 minutes to complete. The resulting analysis is designed to show both project fit and the work still needed before submission.
            </p>
            <div className="mt-6 space-y-3 text-sm text-slate-700">
              <div className="rounded-xl border border-emerald-100 bg-white/80 px-4 py-3">
                Invite-only access for advisors and admins
              </div>
              <div className="rounded-xl border border-emerald-100 bg-white/80 px-4 py-3">
                Structured readiness and proposal outputs
              </div>
              <div className="rounded-xl border border-emerald-100 bg-white/80 px-4 py-3">
                Debt-sensitive financing guidance built into scoring
              </div>
            </div>
          </div>
        </section>

        <section className="mt-14 grid gap-8 md:grid-cols-2">
          <Card className="rounded-[28px] border-slate-200 p-8 shadow-[0_18px_56px_rgba(15,23,42,0.06)]">
            <h3 className="mb-3 text-xl font-semibold text-gray-900">What is Mission 300?</h3>
            <p className="leading-8 text-gray-600">
              Mission 300 aims to connect 300 million Africans to electricity by 2030.
              This requires ~$90B in financing, but current approaches rely heavily on
              concessional loans that add to sovereign debt. Our tool helps projects
              access grant funding that avoids debt creation.
            </p>
          </Card>

          <Card className="rounded-[28px] border-slate-200 p-8 shadow-[0_18px_56px_rgba(15,23,42,0.06)]">
            <h3 className="mb-3 text-xl font-semibold text-gray-900">Debt-Sensitive Approach</h3>
            <p className="leading-8 text-gray-600">
              We prioritize grant-first financing, community and public ownership models,
              and explicit debt-sensitivity screening. This protects fiscal capacity while
              ensuring infrastructure remains in local hands.
            </p>
          </Card>
        </section>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500">
            Takes approximately 2-3 minutes to complete the intake form
          </p>
        </div>
      </div>
    </div>
  );
}
