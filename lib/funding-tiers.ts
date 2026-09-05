export type FundingTierValue = 'tier_1' | 'tier_2' | 'tier_3' | 'tier_4';
export type CurrentFundingTier = 'tier_1' | 'tier_2';

export function normalizeFundingTier(tier: FundingTierValue | string | number | undefined): CurrentFundingTier {
  return tier === 'tier_1' || tier === 1 ? 'tier_1' : 'tier_2';
}

export function fundingTierName(tier: FundingTierValue | string | undefined): string {
  return normalizeFundingTier(tier) === 'tier_1' ? 'Tier 1' : 'Tier 2';
}

export function fundingTierLabel(tier: FundingTierValue | string | undefined): string {
  return normalizeFundingTier(tier) === 'tier_1'
    ? 'Tier 1 — low/no debt preferred'
    : 'Tier 2 — some debt accepted';
}
