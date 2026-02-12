# Decision Framework

## Overview

This document defines the explicit decision rules and scoring logic used by the Grant Matcher agent. All weights and thresholds are transparent and adjustable.

## Scoring Components

The fit score (0-100) is computed from five weighted components:

| Component | Weight | Description |
|-----------|--------|-------------|
| Geography Match | 25% | Does funder cover this country/region? |
| Thematic Match | 30% | Does funder support this technology/use case? |
| Size Match | 15% | Does project cost fit funder's typical range? |
| Ownership Match | 20% | Does ownership model align with funder preferences? |
| Eligibility Match | 10% | Does project meet stated eligibility criteria? |

**Total: 100%**

### Red Flag Penalty

A penalty factor (0-50%) is applied when red flags are identified:
- Minor red flag: 10% penalty
- Moderate red flag: 25% penalty
- Major red flag: 50% penalty (effectively disqualifying)

**Final Score = Base Score × (1 - Red Flag Penalty)**

---

## Component Scoring Rules

### 1. Geography Match (25%)

| Condition | Score |
|-----------|-------|
| Country explicitly listed as priority | 100 |
| Country within listed region | 80 |
| "Africa-wide" or "Global South" eligible | 60 |
| Region adjacent to focus area | 30 |
| Not covered | 0 |

**Example**: Project in Nigeria
- Funder lists "Nigeria" → 100
- Funder lists "West Africa" → 80
- Funder lists "Sub-Saharan Africa" → 60
- Funder lists "East Africa only" → 0

### 2. Thematic Match (30%)

Scoring based on overlap between project characteristics and funder focus areas:

| Overlap Level | Score |
|---------------|-------|
| Primary focus match (e.g., "mini-grids" for mini-grid project) | 100 |
| Secondary focus match (e.g., "rural electrification" for mini-grid) | 80 |
| Adjacent focus (e.g., "renewable energy" for mini-grid) | 50 |
| Tangential (e.g., "climate adaptation" when mini-grid is resilience tool) | 30 |
| No thematic connection | 0 |

**Thematic Tags Evaluated**:
- Technology type (solar, mini-grid, SHS, grid extension)
- Use case (last-mile, productive use, public institutions, residential)
- Sector (energy access, climate, agriculture, health)
- Cross-cutting (gender, youth, jobs)

### 3. Size Match (15%)

Based on how project cost fits within funder's typical ticket size:

| Fit | Score |
|-----|-------|
| Project cost within typical range | 100 |
| Within 50% of range boundaries | 70 |
| Within 100% of range boundaries | 40 |
| Far outside range | 10 |

**Example**: Funder typical range $200K-$500K
- Project cost $350K → 100
- Project cost $150K or $600K → 70
- Project cost $100K or $750K → 40
- Project cost $50K or $2M → 10

### 4. Ownership Match (20%)

Critical component reflecting debt-sensitivity and community ownership principles:

| Project Ownership Model | Funder Preference | Score |
|-------------------------|-------------------|-------|
| Community cooperative | Prefers community | 100 |
| Community cooperative | Neutral | 80 |
| Community cooperative | Prefers private | 40 |
| Public/municipal | Prefers public | 100 |
| Public/municipal | Neutral | 70 |
| Public-community hybrid | Any community-friendly | 90 |
| Private with benefit-sharing | Prefers private | 80 |
| Private with benefit-sharing | Neutral | 50 |
| Private IPP | Prefers private | 70 |
| Private IPP | Prefers community/public | 10 |

**Debt Sensitivity Modifier**:
If funder instrument is a loan or requires sovereign guarantee:
- Community ownership project: -30 points (penalize mismatch)
- Private ownership project: no modifier

### 5. Eligibility Match (10%)

Based on meeting stated eligibility criteria:

| Criteria Met | Score |
|--------------|-------|
| All key criteria clearly met | 100 |
| Most criteria met, 1-2 uncertain | 70 |
| Some criteria met, significant gaps | 40 |
| Key criteria not met | 0 |

**Common Eligibility Factors**:
- Registered entity status
- Minimum track record
- Geographic presence requirements
- Co-financing requirements
- Specific sector experience

---

## Red Flag Identification

### Major Red Flags (50% penalty - near disqualification)

1. **Instrument Mismatch**: Project seeks grants only, but funder offers only loans
2. **Sovereign Debt Risk**: Funder requires government guarantee for community project
3. **Geography Exclusion**: Country explicitly excluded from funder's scope
4. **Ownership Conflict**: Funder requires private developer for community-owned project

### Moderate Red Flags (25% penalty)

1. **Partial Geography Fit**: Country not explicitly listed but might be considered
2. **Size Stretch**: Project cost significantly outside typical range
3. **Missing Eligibility**: One key criterion unclear or possibly unmet
4. **Timing Mismatch**: Funder's current call may not align with project timeline

### Minor Red Flags (10% penalty)

1. **Documentation Gaps**: Some required documents not yet available
2. **Governance Questions**: Ownership structure needs clarification
3. **Technical Uncertainty**: Technology choice not in funder's common portfolio
4. **Capacity Concerns**: Implementing entity may need additional support

---

## Worked Example

**Project**: 50kW solar mini-grid, community cooperative ownership, Nigeria, $300K cost

**Funder**: GEAPP Mini-Grid Fund
- Geography: Nigeria priority country
- Thematic: Mini-grids with productive use
- Typical size: $150K-$500K
- Ownership: Explicitly supports community models
- Eligibility: Registered entity, demand assessment, technical design

**Scoring**:

| Component | Raw Score | Weight | Weighted |
|-----------|-----------|--------|----------|
| Geography | 100 | 0.25 | 25.0 |
| Thematic | 100 | 0.30 | 30.0 |
| Size | 100 | 0.15 | 15.0 |
| Ownership | 100 | 0.20 | 20.0 |
| Eligibility | 70 | 0.10 | 7.0 |

**Base Score: 97.0**

**Red Flags**: Minor - technical design not yet complete (-10%)

**Final Score: 97.0 × 0.90 = 87.3 → 87**

---

## Decision Rules

### Ranking

1. Sort all funders by final fit score (descending)
2. Return top 5 matches
3. Exclude any funder with final score < 30

### Exclusion List

Funders are excluded (not scored) when:
- Instrument type is "loan" and project explicitly rejects debt
- Geography explicitly excludes project country
- Funder is currently closed to new applications (if known)

### Tie-Breaking

When fit scores are equal:
1. Prefer grant over results-based grant over blended
2. Prefer explicit community ownership support
3. Prefer larger typical ticket size (more headroom)

---

## Adjusting Weights

Weights can be modified in `/data/scoring_weights.json`:

```json
{
  "geography": 0.25,
  "thematic": 0.30,
  "size": 0.15,
  "ownership": 0.20,
  "eligibility": 0.10
}
```

**Guidelines for Adjustment**:
- Increase `ownership` weight for strict debt-sensitivity requirements
- Increase `geography` weight when country-specific funding is critical
- Increase `thematic` weight for highly specialized projects
- Decrease `size` weight if project is flexible on funding amount

---

## Transparency Principle

Every score includes a rationale explaining:
1. Which component contributed most to the score
2. Why any penalties were applied
3. What actions could improve the score

This ensures users understand the matching logic and can address gaps.
