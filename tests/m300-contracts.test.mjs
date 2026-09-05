import assert from 'node:assert/strict';
import test from 'node:test';
import { ProjectIntakeSchema } from '../lib/schemas.ts';
import { fundingTierLabel, normalizeFundingTier } from '../lib/funding-tiers.ts';

const baseProject = { project_name: 'Community Energy Project', country: 'Ghana', location_description: 'A rural community in Bono East Region', technology_type: 'solar_mini_grid', target_beneficiaries: 'Three hundred households and local enterprises', ownership_model: 'community_cooperative', estimated_cost_usd: 300000, project_stage: 'concept', debt_preference: 'grant_preferred' };
test('project intake defaults productive uses', () => assert.deepEqual(ProjectIntakeSchema.parse(baseProject).productive_uses, []));
test('Other technology requires description', () => { const r = ProjectIntakeSchema.safeParse({ ...baseProject, technology_type: 'other' }); assert.equal(r.success, false); assert.equal(r.error.issues[0].path[0], 'technology_other'); });
test('Other ownership requires description', () => { const r = ProjectIntakeSchema.safeParse({ ...baseProject, ownership_model: 'other' }); assert.equal(r.success, false); assert.equal(r.error.issues[0].path[0], 'ownership_other'); });
test('custom Other values are retained', () => { const p = ProjectIntakeSchema.parse({ ...baseProject, technology_type: 'other', technology_other: 'Biomass gasification', ownership_model: 'other', ownership_other: 'Municipal trust with community shares' }); assert.equal(p.technology_other, 'Biomass gasification'); assert.equal(p.ownership_other, 'Municipal trust with community shares'); });
test('legacy funding tiers normalize to two tiers', () => { assert.equal(normalizeFundingTier('tier_1'), 'tier_1'); assert.equal(normalizeFundingTier('tier_3'), 'tier_2'); assert.equal(normalizeFundingTier(4), 'tier_2'); assert.equal(fundingTierLabel('tier_4'), 'Tier 2 — some debt accepted'); });
