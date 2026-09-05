export interface ComponentWeight {
  weight: number;
  rationale: string;
}

export interface ScoringWeights {
  version: string;
  description: string;
  component_weights: {
    geography: ComponentWeight;
    thematic: ComponentWeight;
    size: ComponentWeight;
    ownership: ComponentWeight;
    eligibility: ComponentWeight;
  };
  debt_sensitivity_modifiers: {
    tier_1: number;
    tier_2: number;
  };
  red_flag_penalties: {
    major: number;
    moderate: number;
    minor: number;
    max_total: number;
  };
  minimum_threshold: number;
}

export const scoringWeights: ScoringWeights = {
  version: "2.0",
  description: "Two-tier scoring weights for M300 grant matching; debt exposure is weighted, not an automatic exclusion",
  component_weights: {
    geography: {
      weight: 0.25,
      rationale: "Geography determines basic eligibility; important but not differentiating among eligible funders"
    },
    thematic: {
      weight: 0.30,
      rationale: "Thematic fit is strongest predictor of funder interest; highest weight"
    },
    size: {
      weight: 0.15,
      rationale: "Important for practicality but projects can be right-sized or phased"
    },
    ownership: {
      weight: 0.20,
      rationale: "Critical for M300 alignment and debt-sensitivity; high weight"
    },
    eligibility: {
      weight: 0.10,
      rationale: "Usually binary (eligible or not); lower weight for scoring variation"
    }
  },
  debt_sensitivity_modifiers: {
    tier_1: 1.0,
    tier_2: 0.90
  },
  red_flag_penalties: {
    major: 0.50,
    moderate: 0.25,
    minor: 0.10,
    max_total: 0.30
  },
  minimum_threshold: 30
};
