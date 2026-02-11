'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import type { TradeOffExplorerResult } from '@/lib/schemas';

interface Props {
  tradeoffs: TradeOffExplorerResult;
}

export function TradeOffExplorer({ tradeoffs }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Policy Trade-Off Explorer</h2>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
            Debt-sensitivity focus
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium text-gray-900 mb-2">Sensitivity Drivers</h3>
          <ul className="space-y-2">
            {tradeoffs.sensitivity_drivers.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Priority Trade-Offs</h3>
          {tradeoffs.priority_trade_offs.map((scenario, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{scenario.title}</h4>
                <span className="text-xs text-gray-500">Scenario {idx + 1}</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h5 className="text-gray-900 font-medium mb-1">Upsides</h5>
                  <ul className="space-y-1 list-disc list-inside text-gray-700">
                    {scenario.upsides.map((u, i) => <li key={i}>{u}</li>)}
                  </ul>
                </div>
                <div>
                  <h5 className="text-gray-900 font-medium mb-1">Risks</h5>
                  <ul className="space-y-1 list-disc list-inside text-gray-700">
                    {scenario.risks.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
                <div>
                  <h5 className="text-gray-900 font-medium mb-1">Signals to Monitor</h5>
                  <ul className="space-y-1 list-disc list-inside text-gray-700">
                    {scenario.signals_to_monitor.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              </div>
              <div className="mt-3">
                <h5 className="text-gray-900 font-medium mb-1">Suggested Actions</h5>
                <ul className="space-y-1 list-disc list-inside text-gray-700">
                  {scenario.suggested_actions.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">Bottom Line</h3>
          <p className="text-sm text-blue-800">{tradeoffs.bottom_line}</p>
        </div>
      </CardContent>
    </Card>
  );
}
