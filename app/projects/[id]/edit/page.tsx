'use client';

import { use, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ProjectIntakeForm } from '@/components/ProjectIntakeForm';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import type { ProjectIntake } from '@/lib/schemas';

interface EditableProject { id: string; updatedAt: string; canReanalyse: boolean; currentRevision: number; intake: ProjectIntake; }

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); const router = useRouter();
  const [project, setProject] = useState<EditableProject | null>(null);
  const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false); const [error, setError] = useState<string | null>(null);
  const fetchProject = useCallback(async () => {
    try {
      const response = await fetch(`/api/projects/${id}`); const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to load project');
      if (!data.canReanalyse) throw new Error('You do not have permission to revise this project');
      setProject(data);
    } catch (fetchError) { setError(fetchError instanceof Error ? fetchError.message : 'Failed to load project'); }
    finally { setLoading(false); }
  }, [id]);
  useEffect(() => { fetchProject(); }, [fetchProject]);
  const handleSubmit = async (intake: ProjectIntake, options: { enhance: boolean; enhancedMode: boolean }) => {
    if (!project) return; setSaving(true); setError(null);
    try {
      const query = new URLSearchParams(); if (options.enhance) query.set('enhance', 'true'); if (options.enhancedMode) query.set('enhanced_mode', 'true');
      const response = await fetch(`/api/projects/${id}/reanalyze?${query}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ project: intake, expected_updated_at: project.updatedAt }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Failed to reanalyse project');
      router.push(`/projects/${id}`); router.refresh();
    } catch (submitError) { setError(submitError instanceof Error ? submitError.message : 'Failed to reanalyse project'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    finally { setSaving(false); }
  };
  if (loading) return <div className="flex min-h-[40vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-500" /></div>;
  if (error && !project) return <div className="max-w-3xl mx-auto px-4 py-8"><Card><CardContent className="py-10 text-center"><p className="mb-4 text-red-700">{error}</p><Link href={`/projects/${id}`}><Button variant="outline">Back to Project</Button></Link></CardContent></Card></div>;
  if (!project) return null;
  return <div className="max-w-4xl mx-auto px-4 py-8">
    <Link href={`/projects/${id}`} className="mb-4 inline-block text-sm text-emerald-700 hover:underline">Back to project</Link>
    <div className="mb-6"><h1 className="text-3xl font-bold text-gray-900">Revise and reanalyse</h1><p className="mt-2 text-gray-600">Saving creates revision {project.currentRevision + 1}; earlier inputs and results remain unchanged in the audit history.</p></div>
    {error && <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">{error}</div>}
    <ProjectIntakeForm initialData={project.intake} onSubmit={handleSubmit} loading={saving} title="Revise Project Inputs" submitLabel="Save & Reanalyse" />
  </div>;
}
