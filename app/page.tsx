'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function Home() {
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          M300 Co-Intelligent Support Desk
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Helping African communities and governments access grant funding for energy projects
          while protecting fiscal capacity and promoting local ownership.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <Card className="text-center p-6">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Policy Alignment</h3>
          <p className="text-gray-600">
            Analyze your project against M300 debt-sensitivity principles for optimal grant positioning.
          </p>
        </Card>

        <Card className="text-center p-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Grant Matching</h3>
          <p className="text-gray-600">
            Find the best-fit funding sources from our curated database of 12+ grant programs.
          </p>
        </Card>

        <Card className="text-center p-6">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Proposal Coaching</h3>
          <p className="text-gray-600">
            Get a grant-ready proposal outline with readiness checklist and actionable next steps.
          </p>
        </Card>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
            <div>
              <h4 className="font-semibold text-gray-900">Submit Project</h4>
              <p className="text-sm text-gray-600">Enter your energy project details</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
            <div>
              <h4 className="font-semibold text-gray-900">Policy Analysis</h4>
              <p className="text-sm text-gray-600">Get M300 alignment score and debt-sensitivity tier</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
            <div>
              <h4 className="font-semibold text-gray-900">Grant Matching</h4>
              <p className="text-sm text-gray-600">Receive ranked funder recommendations</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
            <div>
              <h4 className="font-semibold text-gray-900">Proposal Draft</h4>
              <p className="text-sm text-gray-600">Get tailored proposal outline and checklist</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center space-y-4">
        <div className="flex justify-center space-x-4">
          <Button onClick={() => router.push('/analyze')} size="lg">
            Analyze Your Project
          </Button>
          <Button onClick={() => router.push('/projects')} size="lg" variant="outline">
            View All Projects
          </Button>
        </div>
        <p className="text-sm text-gray-500">
          Takes approximately 2-3 minutes to complete the intake form
        </p>
      </div>

      <div className="mt-16 border-t border-gray-200 pt-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">What is Mission 300?</h3>
            <p className="text-gray-600">
              Mission 300 aims to connect 300 million Africans to electricity by 2030.
              This requires ~$90B in financing, but current approaches rely heavily on
              concessional loans that add to sovereign debt. Our tool helps projects
              access grant funding that avoids debt creation.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Debt-Sensitive Approach</h3>
            <p className="text-gray-600">
              We prioritize grant-first financing, community and public ownership models,
              and explicit debt-sensitivity screening. This protects fiscal capacity while
              ensuring infrastructure remains in local hands.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
