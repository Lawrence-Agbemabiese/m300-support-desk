'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import type { ProposalCoach, ChecklistItem } from '@/lib/schemas';

interface ReadinessChecklistProps {
  coach: ProposalCoach;
}

function ChecklistItemRow({
  item,
  expanded,
  onToggleExpand,
}: {
  item: ChecklistItem;
  expanded: boolean;
  onToggleExpand: () => void;
}) {
  const statusColors = {
    ready: 'text-emerald-500',
    not_ready: 'text-red-500',
    unknown: 'text-gray-400',
    in_progress: 'text-blue-500',
  };

  const statusIcons = {
    ready: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    ),
    not_ready: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    ),
    unknown: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
      </svg>
    ),
    in_progress: (
      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    ),
  };

  const priorityBadges = {
    critical: 'bg-red-100 text-red-800',
    important: 'bg-yellow-100 text-yellow-800',
    nice_to_have: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="p-3 rounded-lg">
      <button
        type="button"
        onClick={onToggleExpand}
        className="w-full flex items-start space-x-3 text-left"
      >
        <span className={statusColors[item.status]}>
          {statusIcons[item.status]}
        </span>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${item.status === 'ready' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
              {item.item}
            </span>
            {item.priority && (
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${priorityBadges[item.priority]}`}>
                {item.priority.replace(/_/g, ' ')}
              </span>
            )}
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 mt-0.5 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="mt-2 pl-8">
          {item.notes && <p className="text-xs text-gray-600">{item.notes}</p>}
          {item.status === 'in_progress' && (
            <p className="text-xs text-blue-700 mt-1">Next step: complete remaining evidence and mark this item complete.</p>
          )}
          {item.status === 'not_ready' && (
            <p className="text-xs text-red-700 mt-1">Next step: this artifact is still missing and is blocking readiness.</p>
          )}
          {item.status === 'unknown' && (
            <p className="text-xs text-gray-600 mt-1">Next step: confirm status and add supporting details/doc links.</p>
          )}
        </div>
      )}
    </div>
  );
}

export function ReadinessChecklist({ coach }: ReadinessChecklistProps) {
  const checklist = coach.readiness_checklist;
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleExpanded = (key: string) => {
    setExpandedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const readyCount = checklist.filter((item) => item.status === 'ready').length;
  const notReadyCount = checklist.filter((item) => item.status === 'not_ready').length;
  const unknownCount = checklist.filter(
    (item) => item.status === 'unknown' || item.status === 'in_progress'
  ).length;
  const totalCount = checklist.length;
  const progressPercent = totalCount > 0 ? (readyCount / totalCount) * 100 : 0;

  const readinessColors = {
    ready_to_submit: 'bg-emerald-100 text-emerald-800',
    nearly_ready: 'bg-yellow-100 text-yellow-800',
    significant_gaps: 'bg-orange-100 text-orange-800',
    major_work_needed: 'bg-red-100 text-red-800',
  };

  const criticalItems = checklist.filter((item) => item.priority === 'critical');
  const importantItems = checklist.filter((item) => item.priority === 'important');
  const niceToHaveItems = checklist.filter((item) => item.priority === 'nice_to_have');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Readiness Checklist</h2>
          {coach.readiness_summary && (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${readinessColors[coach.readiness_summary.overall_readiness]}`}>
              {coach.readiness_summary.overall_readiness.replace(/_/g, ' ')}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Completion Progress</span>
            <span className="text-sm font-medium text-gray-900">{readyCount} / {totalCount} items ready</span>
          </div>
          <Progress value={progressPercent} color="emerald" />
        </div>

        {/* Status Summary */}
        {coach.readiness_summary && (
          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">{readyCount}</div>
              <div className="text-xs text-gray-500">Ready</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{notReadyCount}</div>
              <div className="text-xs text-gray-500">Not Ready</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-400">{unknownCount}</div>
              <div className="text-xs text-gray-500">Unknown</div>
            </div>
          </div>
        )}

        {/* Critical Items */}
        {criticalItems.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-red-700 mb-2 flex items-center space-x-2">
              <span>Critical Items</span>
              <span className="text-xs font-normal text-gray-500">
                ({criticalItems.filter((i) => i.status === 'ready').length}/{criticalItems.length} complete)
              </span>
            </h3>
            <div className="border border-red-200 rounded-lg divide-y divide-red-100">
              {criticalItems.map((item, index) => (
                <ChecklistItemRow
                  key={`critical-${index}`}
                  item={item}
                  expanded={Boolean(expandedItems[`critical-${index}-${item.item}`])}
                  onToggleExpand={() => toggleExpanded(`critical-${index}-${item.item}`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Important Items */}
        {importantItems.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-yellow-700 mb-2 flex items-center space-x-2">
              <span>Important Items</span>
              <span className="text-xs font-normal text-gray-500">
                ({importantItems.filter((i) => i.status === 'ready').length}/{importantItems.length} complete)
              </span>
            </h3>
            <div className="border border-yellow-200 rounded-lg divide-y divide-yellow-100">
              {importantItems.map((item, index) => (
                <ChecklistItemRow
                  key={`important-${index}`}
                  item={item}
                  expanded={Boolean(expandedItems[`important-${index}-${item.item}`])}
                  onToggleExpand={() => toggleExpanded(`important-${index}-${item.item}`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Nice to Have Items */}
        {niceToHaveItems.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
              <span>Nice to Have</span>
              <span className="text-xs font-normal text-gray-500">
                ({niceToHaveItems.filter((i) => i.status === 'ready').length}/{niceToHaveItems.length} complete)
              </span>
            </h3>
            <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
              {niceToHaveItems.map((item, index) => (
                <ChecklistItemRow
                  key={`nice-${index}`}
                  item={item}
                  expanded={Boolean(expandedItems[`nice-${index}-${item.item}`])}
                  onToggleExpand={() => toggleExpanded(`nice-${index}-${item.item}`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Missing Info Questions */}
        <div className="border-t pt-4">
          <h3 className="font-medium text-gray-900 mb-3">Questions to Answer</h3>
          <ol className="space-y-2 list-decimal list-inside">
            {coach.missing_info_questionnaire.slice(0, 8).map((question, index) => (
              <li key={index} className="text-sm text-gray-600">{question}</li>
            ))}
          </ol>
          {coach.missing_info_questionnaire.length > 8 && (
            <p className="text-sm text-gray-500 mt-2">
              + {coach.missing_info_questionnaire.length - 8} more questions
            </p>
          )}
        </div>

        {/* Estimated Effort */}
        {coach.readiness_summary?.estimated_preparation_effort && (
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-1">Estimated Preparation Effort</h3>
            <p className="text-sm text-blue-800">
              Based on current readiness, expect {coach.readiness_summary.estimated_preparation_effort} of preparation work before submission.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
