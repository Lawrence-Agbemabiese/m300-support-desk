'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import type { ProjectIntake } from '@/lib/schemas';

interface ProjectIntakeFormProps {
  onSubmit: (data: ProjectIntake, options: { enhance: boolean; enhancedMode: boolean }) => void;
  loading?: boolean;
}

const technologyOptions = [
  { value: 'solar_mini_grid', label: 'Solar Mini-Grid' },
  { value: 'solar_standalone', label: 'Solar Standalone' },
  { value: 'solar_home_systems', label: 'Solar Home Systems' },
  { value: 'wind_mini_grid', label: 'Wind Mini-Grid' },
  { value: 'hydro_mini_grid', label: 'Hydro Mini-Grid' },
  { value: 'hybrid_mini_grid', label: 'Hybrid Mini-Grid' },
  { value: 'grid_extension', label: 'Grid Extension' },
  { value: 'grid_densification', label: 'Grid Densification' },
  { value: 'clean_cooking', label: 'Clean Cooking' },
  { value: 'other', label: 'Other' },
];

const ownershipOptions = [
  { value: 'community_cooperative', label: 'Community Cooperative' },
  { value: 'public_utility', label: 'Public Utility' },
  { value: 'public_community_hybrid', label: 'Public-Community Hybrid' },
  { value: 'private_with_benefit_sharing', label: 'Private with Benefit Sharing' },
  { value: 'private_ipp', label: 'Private IPP' },
  { value: 'undecided', label: 'Undecided' },
];

const stageOptions = [
  { value: 'idea', label: 'Idea Stage' },
  { value: 'concept', label: 'Concept Development' },
  { value: 'early_development', label: 'Early Development' },
  { value: 'feasibility_complete', label: 'Feasibility Complete' },
  { value: 'ready_for_funding', label: 'Ready for Funding' },
  { value: 'under_construction', label: 'Under Construction' },
  { value: 'operational', label: 'Operational' },
];

const debtPreferenceOptions = [
  { value: 'grant_only', label: 'Grant Only (Recommended)' },
  { value: 'grant_preferred', label: 'Grant Preferred' },
  { value: 'open_to_blended', label: 'Open to Blended Finance' },
  { value: 'any_instrument', label: 'Any Instrument' },
];

const countryOptions = [
  { value: 'Nigeria', label: 'Nigeria' },
  { value: 'Kenya', label: 'Kenya' },
  { value: 'Ethiopia', label: 'Ethiopia' },
  { value: 'DRC', label: 'DRC' },
  { value: 'Tanzania', label: 'Tanzania' },
  { value: 'Uganda', label: 'Uganda' },
  { value: 'Ghana', label: 'Ghana' },
  { value: 'Senegal', label: 'Senegal' },
  { value: 'Rwanda', label: 'Rwanda' },
  { value: 'Malawi', label: 'Malawi' },
  { value: 'Zambia', label: 'Zambia' },
  { value: 'Mozambique', label: 'Mozambique' },
];

const productiveUseOptions = [
  'cassava_processing',
  'phone_charging',
  'cold_storage',
  'grain_milling',
  'irrigation',
  'welding',
  'carpentry',
  'tailoring',
  'vaccine_cold_chain',
  'medical_equipment',
];

const readinessStatusOptions = [
  { value: 'complete', label: 'Complete' },
  { value: 'partial', label: 'Partial / Draft' },
  { value: 'missing', label: 'Missing' },
  { value: 'unknown', label: 'Unknown' },
];

const defaultReadinessEvidence: NonNullable<ProjectIntake['readiness_evidence']> = {
  legal_entity_registration: { status: 'unknown', details: '' },
  land_site_documentation: { status: 'unknown', details: '' },
  community_stakeholder_endorsement: { status: 'unknown', details: '' },
  ministry_agency_endorsement: { status: 'unknown', details: '' },
  demand_assessment: { status: 'unknown', details: '' },
  technical_design: { status: 'unknown', details: '' },
  detailed_budget: { status: 'unknown', details: '' },
  financial_projections: { status: 'unknown', details: '' },
  co_financing_documentation: { status: 'unknown', details: '' },
  implementation_timeline: { status: 'unknown', details: '' },
  mel_framework: { status: 'unknown', details: '' },
};

const EXAMPLE_PROJECTS: Record<'minigrid' | 'health', Partial<ProjectIntake>> = {
  minigrid: {
    project_name: 'Nkoranza Community Solar Mini-Grid',
    country: 'Ghana',
    location_description: 'Rural farming community in Bono East Region, 35km from nearest grid connection point. Population approximately 1,500 across 280 households.',
    technology_type: 'solar_mini_grid' as const,
    capacity_kw: 60,
    target_beneficiaries: '280 households, 1 shea butter processing cooperative, 2 primary schools, 1 CHPS compound',
    ownership_model: 'community_cooperative' as const,
    productive_uses: ['grain_milling', 'cold_storage', 'phone_charging'],
    estimated_cost_usd: 320000,
    existing_funding: 'Community committed GHS 120,000 (approx $10,000) cash and in-kind labor',
    project_stage: 'concept' as const,
    community_engagement: 'Community Energy Cooperative registered with Department of Cooperatives, 245 member households, monthly meetings since 2023',
    additional_context: 'ECG confirms no grid extension planned for this area within 10 years. Strong solar irradiance (5.5 kWh/m2/day). District Assembly supportive.',
    debt_preference: 'grant_only' as const,
    readiness_evidence: {
      ...defaultReadinessEvidence,
      legal_entity_registration: { status: 'complete', details: 'Cooperative registration certificate available (2023).' },
      land_site_documentation: { status: 'partial', details: 'Land allocation letter drafted; final signature pending district office.' },
      community_stakeholder_endorsement: { status: 'complete', details: 'Signed endorsement minutes from community assembly.' },
      ministry_agency_endorsement: { status: 'partial', details: 'District Assembly support letter draft under review.' },
      demand_assessment: { status: 'partial', details: 'Initial household demand survey completed for 150/280 households.' },
      technical_design: { status: 'partial', details: 'Preliminary single-line diagram and load assumptions prepared.' },
      detailed_budget: { status: 'missing', details: 'Awaiting supplier quotations.' },
      financial_projections: { status: 'missing', details: '' },
      co_financing_documentation: { status: 'partial', details: 'Community contribution commitment letter available.' },
      implementation_timeline: { status: 'complete', details: '8-month implementation schedule prepared.' },
      mel_framework: { status: 'partial', details: 'Initial KPI list drafted; baselines pending.' },
    },
  },
  health: {
    project_name: 'Upper West CHPS Electrification',
    country: 'Ghana',
    location_description: '8 off-grid CHPS compounds in Wa West and Wa East Districts, Upper West Region',
    technology_type: 'solar_standalone' as const,
    capacity_kw: 40,
    target_beneficiaries: '8 CHPS compounds serving 45,000 people across 32 communities',
    ownership_model: 'public_community_hybrid' as const,
    productive_uses: ['vaccine_cold_chain', 'medical_equipment'],
    estimated_cost_usd: 195000,
    existing_funding: 'Ghana Health Service provides sites and recurrent operational budget',
    project_stage: 'early_development' as const,
    community_engagement: 'Community Health Management Committees (CHMCs) active at all 8 facilities',
    additional_context: 'Upper West Region has lowest electrification rate in Ghana. GHS fiscal constraints prevent loan-financed solutions.',
    debt_preference: 'grant_only' as const,
    readiness_evidence: {
      ...defaultReadinessEvidence,
      legal_entity_registration: { status: 'complete', details: 'Implemented under Ghana Health Service mandate.' },
      land_site_documentation: { status: 'complete', details: 'All CHPS facilities are public assets with known coordinates.' },
      community_stakeholder_endorsement: { status: 'partial', details: 'CHMC confirmations received from 5/8 sites.' },
      ministry_agency_endorsement: { status: 'complete', details: 'Regional Health Directorate endorsement letter signed.' },
      demand_assessment: { status: 'complete', details: 'Facility load and service-demand assessment completed.' },
      technical_design: { status: 'partial', details: 'System sizing complete; protection design under review.' },
      detailed_budget: { status: 'partial', details: 'Draft BoQ prepared; final vendor pricing pending.' },
      financial_projections: { status: 'partial', details: 'OPEX estimates drafted in annual budget note.' },
      co_financing_documentation: { status: 'complete', details: 'Government O&M commitment documented.' },
      implementation_timeline: { status: 'complete', details: 'Site-by-site implementation schedule finalized.' },
      mel_framework: { status: 'partial', details: 'Monitoring indicators drafted with district health team.' },
    },
  },
};

export function ProjectIntakeForm({ onSubmit, loading = false }: ProjectIntakeFormProps) {
  const [step, setStep] = useState(1);
  const [enhance, setEnhance] = useState(false);
  const [enhancedMode, setEnhancedMode] = useState(false);
  const [formData, setFormData] = useState<Partial<ProjectIntake>>({
    project_stage: 'concept',
    debt_preference: 'grant_preferred',
    productive_uses: [],
    readiness_evidence: defaultReadinessEvidence,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = <K extends keyof ProjectIntake>(field: K, value: ProjectIntake[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const toggleProductiveUse = (use: string) => {
    const current = formData.productive_uses || [];
    if (current.includes(use)) {
      updateField('productive_uses', current.filter((u) => u !== use));
    } else {
      updateField('productive_uses', [...current, use]);
    }
  };

  const updateReadinessEvidence = <
    K extends keyof NonNullable<ProjectIntake['readiness_evidence']>,
    F extends keyof NonNullable<ProjectIntake['readiness_evidence']>[K]
  >(
    itemKey: K,
    field: F,
    value: NonNullable<ProjectIntake['readiness_evidence']>[K][F]
  ) => {
    const current = formData.readiness_evidence || defaultReadinessEvidence;
    updateField('readiness_evidence', {
      ...current,
      [itemKey]: {
        ...current[itemKey],
        [field]: value,
      },
    });
  };

  const loadExample = (type: 'minigrid' | 'health') => {
    setFormData(EXAMPLE_PROJECTS[type]);
    setStep(1);
  };

  const validateStep = (stepNum: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNum === 1) {
      if (!formData.project_name || formData.project_name.length < 3) {
        newErrors.project_name = 'Project name must be at least 3 characters';
      }
      if (!formData.country) {
        newErrors.country = 'Country is required';
      }
      if (!formData.location_description || formData.location_description.length < 10) {
        newErrors.location_description = 'Location description must be at least 10 characters';
      }
    }

    if (stepNum === 2) {
      if (!formData.technology_type) {
        newErrors.technology_type = 'Technology type is required';
      }
      if (!formData.estimated_cost_usd || formData.estimated_cost_usd <= 0) {
        newErrors.estimated_cost_usd = 'Estimated cost must be greater than 0';
      }
    }

    if (stepNum === 3) {
      if (!formData.ownership_model) {
        newErrors.ownership_model = 'Ownership model is required';
      }
      if (!formData.target_beneficiaries || formData.target_beneficiaries.length < 10) {
        newErrors.target_beneficiaries = 'Target beneficiaries must be at least 10 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const handleSubmit = () => {
    if (validateStep(step)) {
      onSubmit(formData as ProjectIntake, { enhance, enhancedMode });
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Project Intake Form</h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => loadExample('minigrid')}>
              Ghana Mini-Grid
            </Button>
            <Button variant="outline" size="sm" onClick={() => loadExample('health')}>
              Ghana Health Facility
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-4">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full ${s <= step ? 'bg-emerald-500' : 'bg-gray-200'}`}
            />
          ))}
        </div>
        <div className="flex justify-between text-sm text-gray-500 mt-1">
          <span>Basics</span>
          <span>Technical</span>
          <span>Ownership</span>
          <span>Readiness</span>
          <span>Options</span>
        </div>
      </CardHeader>

      <CardContent>
        {/* Step 1: Project Basics */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Project Basics</h3>
            <Input
              label="Project Name"
              placeholder="e.g., Kaduna Community Solar Mini-Grid"
              value={formData.project_name || ''}
              onChange={(e) => updateField('project_name', e.target.value)}
              error={errors.project_name}
              required
            />
            <Select
              label="Country"
              options={countryOptions}
              value={formData.country || ''}
              onChange={(e) => updateField('country', e.target.value)}
              error={errors.country}
              required
            />
            <Textarea
              label="Location Description"
              placeholder="Describe the project location, including state/region, proximity to grid, population..."
              value={formData.location_description || ''}
              onChange={(e) => updateField('location_description', e.target.value)}
              error={errors.location_description}
              rows={3}
              required
            />
          </div>
        )}

        {/* Step 2: Technical Details */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Technical Details</h3>
            <Select
              label="Technology Type"
              options={technologyOptions}
              value={formData.technology_type || ''}
              onChange={(e) => updateField('technology_type', e.target.value as ProjectIntake['technology_type'])}
              error={errors.technology_type}
              required
            />
            <Input
              label="Capacity (kW)"
              type="number"
              placeholder="e.g., 50"
              value={formData.capacity_kw || ''}
              onChange={(e) => updateField('capacity_kw', parseFloat(e.target.value) || undefined)}
              helperText="Leave blank if not yet determined"
            />
            <Input
              label="Estimated Cost (USD)"
              type="number"
              placeholder="e.g., 285000"
              value={formData.estimated_cost_usd || ''}
              onChange={(e) => updateField('estimated_cost_usd', parseFloat(e.target.value) || 0)}
              error={errors.estimated_cost_usd}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Productive Uses (select all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {productiveUseOptions.map((use) => (
                  <button
                    key={use}
                    type="button"
                    onClick={() => toggleProductiveUse(use)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      formData.productive_uses?.includes(use)
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                    }`}
                  >
                    {use.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Ownership & Beneficiaries */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Ownership & Beneficiaries</h3>
            <Select
              label="Ownership Model"
              options={ownershipOptions}
              value={formData.ownership_model || ''}
              onChange={(e) => updateField('ownership_model', e.target.value as ProjectIntake['ownership_model'])}
              error={errors.ownership_model}
              helperText="Community cooperative is recommended for best grant alignment"
              required
            />
            <Textarea
              label="Target Beneficiaries"
              placeholder="Describe who will benefit (households, institutions, businesses...)"
              value={formData.target_beneficiaries || ''}
              onChange={(e) => updateField('target_beneficiaries', e.target.value)}
              error={errors.target_beneficiaries}
              rows={2}
              required
            />
            <Textarea
              label="Community Engagement"
              placeholder="Describe community involvement and buy-in..."
              value={formData.community_engagement || ''}
              onChange={(e) => updateField('community_engagement', e.target.value)}
              rows={2}
            />
            <Input
              label="Existing Funding"
              placeholder="Any funding already secured or committed..."
              value={formData.existing_funding || ''}
              onChange={(e) => updateField('existing_funding', e.target.value)}
            />
          </div>
        )}

        {/* Step 4: Readiness Evidence */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Readiness Evidence</h3>
            <p className="text-sm text-gray-600">
              Provide current status and evidence notes (or document links) for each item. This drives the readiness checklist.
            </p>

            {[
              ['legal_entity_registration', 'Legal entity registration'],
              ['land_site_documentation', 'Land/site documentation'],
              ['community_stakeholder_endorsement', 'Community/stakeholder endorsement'],
              ['ministry_agency_endorsement', 'Relevant Ministry/Agency endorsement'],
              ['demand_assessment', 'Demand assessment'],
              ['technical_design', 'Technical design'],
              ['detailed_budget', 'Detailed budget'],
              ['financial_projections', 'Financial projections'],
              ['co_financing_documentation', 'Co-financing documentation'],
              ['implementation_timeline', 'Implementation timeline'],
              ['mel_framework', 'M&E framework'],
            ].map(([key, label]) => {
              const itemKey = key as keyof NonNullable<ProjectIntake['readiness_evidence']>;
              const item = (formData.readiness_evidence || defaultReadinessEvidence)[itemKey];
              return (
                <div key={key} className="rounded-lg border border-gray-200 p-3 space-y-3">
                  <Select
                    label={label}
                    options={readinessStatusOptions}
                    value={item.status}
                    onChange={(e) =>
                      updateReadinessEvidence(
                        itemKey,
                        'status',
                        e.target.value as NonNullable<ProjectIntake['readiness_evidence']>[typeof itemKey]['status']
                      )
                    }
                    required
                  />
                  <Textarea
                    label="Evidence details / document links"
                    placeholder="Add notes, filenames, links, dates, or ownership of this artifact..."
                    value={item.details || ''}
                    onChange={(e) => updateReadinessEvidence(itemKey, 'details', e.target.value)}
                    rows={2}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Step 5: Options & Submit */}
        {step === 5 && (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Additional Options</h3>
            <Select
              label="Project Stage"
              options={stageOptions}
              value={formData.project_stage || 'concept'}
              onChange={(e) => updateField('project_stage', e.target.value as ProjectIntake['project_stage'])}
            />
            <Select
              label="Debt Preference"
              options={debtPreferenceOptions}
              value={formData.debt_preference || 'grant_preferred'}
              onChange={(e) => updateField('debt_preference', e.target.value as ProjectIntake['debt_preference'])}
              helperText="Grant-only preference aligns best with M300 principles"
            />
            <Textarea
              label="Additional Context"
              placeholder="Any other relevant information..."
              value={formData.additional_context || ''}
              onChange={(e) => updateField('additional_context', e.target.value)}
              rows={3}
            />

            <div className="border-t pt-4 mt-4">
              <h4 className="font-medium text-gray-900 mb-3">Analysis Options</h4>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={enhance}
                    onChange={(e) => setEnhance(e.target.checked)}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">
                    Enable AI-Enhanced Analysis (uses Claude for richer narratives)
                  </span>
                </label>
                {enhance && (
                  <label className="flex items-center space-x-3 ml-6">
                    <input
                      type="checkbox"
                      checked={enhancedMode}
                      onChange={(e) => setEnhancedMode(e.target.checked)}
                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-700">
                      Enhanced Mode (uses Claude Opus 4 for deeper analysis - slower but more detailed)
                    </span>
                  </label>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6 pt-4 border-t">
          {step > 1 ? (
            <Button variant="outline" onClick={() => setStep((prev) => prev - 1)}>
              Previous
            </Button>
          ) : (
            <div />
          )}
          {step < 5 ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button onClick={handleSubmit} loading={loading}>
              Analyze Project
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
