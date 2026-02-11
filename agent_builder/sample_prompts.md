# Sample Prompts and Demo Conversations

This document provides example interactions to test the agent in OpenAI Agent Builder.

---

## Demo Conversation 1: Community Solar Mini-Grid (Nigeria)

### User Prompt

```
We're a community cooperative in rural Kaduna State, Nigeria. We want to build a solar mini-grid to power about 200 households and a cassava processing facility. The cooperative has been active for 3 years managing a savings scheme. We estimate the project will cost around $285,000. The nearest grid is 45km away with no extension planned. Can you help us find grant funding?
```

### Expected Agent Response

The agent should:
1. Recognize this as a community-owned mini-grid project
2. Run policy interpretation identifying:
   - High M300 alignment (85+)
   - Grant-suitable: community ownership, productive use, last-mile
   - No debt risks under current structure
3. Match grants returning:
   - GEAPP as top match (90+)
   - AMSF, GCF SAP, USADF as alternatives
4. Generate proposal outline for GEAPP
5. Provide readiness checklist and next steps

---

## Demo Conversation 2: Health Facility Electrification (Nigeria)

### User Prompt

```
I work with the Plateau State Ministry of Health. We need to electrify 5 rural health clinics that currently have no reliable power - they run on intermittent diesel. The main problem is vaccine spoilage due to cold chain failures. The Ministry will own the equipment but community health committees will help manage day-to-day operations. Budget is about $175,000. The state has high debt and cannot take new loans. What grant options do we have?
```

### Expected Agent Response

The agent should:
1. Recognize this as health facility electrification with public-community hybrid ownership
2. Run policy interpretation noting:
   - Strong alignment due to public health focus
   - Grant-only is essential due to state fiscal constraints
   - Hybrid ownership model is appropriate
3. Match grants returning:
   - Gavi CCEOP as top match (94+) - specifically for cold chain
   - Power Africa Health as strong alternative
   - GCF SAP as option through accredited entity
4. Generate proposal outline emphasizing vaccine cold chain
5. Note that loan funders are excluded due to state debt situation

---

## Demo Conversation 3: Clarification Needed

### User Prompt

```
We want to do a solar project in Kenya for a school.
```

### Expected Agent Response

The agent should ask clarifying questions before proceeding:

```
I'd be happy to help you find grant funding for your school solar project in Kenya. To give you the best recommendations, I need a few more details:

1. **Scale**: What size system are you considering? (e.g., small standalone for lighting, or larger system for computers/equipment)

2. **Cost estimate**: Do you have a rough budget in mind?

3. **Ownership**: Who will own the solar equipment?
   - The school itself
   - The local government/Ministry of Education
   - A community organization
   - Other

4. **Productive uses**: Beyond basic school operations, will the electricity enable any income-generating activities?

5. **Current situation**: Does the school currently have any electricity access (grid, diesel generator)?

Once I have these details, I can analyze your project against M300 principles and find matching grant opportunities.
```

---

## Demo Conversation 4: Debt-Sensitive Guidance

### User Prompt

```
A private developer wants to partner with us to build a 500kW mini-grid in Ghana. They're suggesting we use IFC financing. Our community would have a 20% stake. Is this a good approach?
```

### Expected Agent Response

The agent should provide debt-sensitive analysis:

```
I need to flag some concerns about this structure from an M300 debt-sensitivity perspective:

## Debt and Ownership Analysis

**Red Flags Identified:**

1. **Private-majority ownership (80%)**: This structure would result in most revenues flowing to the private developer, not the community. This is what M300 analysts call "capital flight."

2. **IFC financing typically involves loans or equity**: IFC is a debt/equity investor, not a grant provider. This would create debt obligations and/or profit-sharing that benefits external investors.

3. **Community minority stake (20%)**: While you have some ownership, major decisions would be controlled by the private developer.

## Debt Sensitivity: Tier 3 (Orange) or Tier 4 (Red)
- Likely requires guarantees or creates contingent liabilities
- Profit extraction reduces community benefit
- May not qualify for grant funding under this structure

## Alternative Approaches

If your community wants grant funding, consider:

1. **Flip the ownership**: Community cooperative owns 80%, developer provides technical services under contract
2. **Seek pure grant funding**: GEAPP, USADF, and others specifically support community ownership
3. **Developer as EPC only**: Hire the developer to build the system, but community owns the assets

Would you like me to search for grant funders that support community-majority ownership in Ghana? This would give you a Tier 1 (debt-free) pathway.
```

---

## Demo Conversation 5: Multiple Project Comparison

### User Prompt

```
We're deciding between two approaches for our village in Tanzania:
Option A: Grid extension from 15km away, working with TANESCO
Option B: Build a solar mini-grid owned by a village cooperative

Which is better for grant funding?
```

### Expected Agent Response

```
Let me analyze both options through the M300 debt-sensitivity lens:

## Option A: Grid Extension with TANESCO

**M300 Alignment Score: 45/100**

Concerns:
- Grid extension typically financed through loans (IDA, AfDB)
- Would add to Tanzania's sovereign debt
- TANESCO (state utility) would own infrastructure
- Capital costs recovered through national tariff pool

Grant suitability: **Low**
- Few grant funders support grid extension
- Most M300 grid financing is loan-based
- 15km extension is expensive (~$10,000/km = $150,000+)

## Option B: Village Cooperative Solar Mini-Grid

**M300 Alignment Score: 88/100**

Strengths:
- Community ownership keeps revenues local
- No sovereign debt implications
- Multiple grant funders specifically support this model
- Tanzania is priority country for several funders

Grant suitability: **High**
- GEAPP, AMSF, EnDev, UNDP all active in Tanzania
- Community cooperative ownership is explicitly valued

## Recommendation

**Option B (mini-grid)** is significantly better for grant funding:

| Factor | Grid Extension | Mini-Grid |
|--------|---------------|-----------|
| Grant availability | Low | High |
| Debt creation | Yes (sovereign) | No |
| Community ownership | No (TANESCO) | Yes (cooperative) |
| Local revenue retention | No | Yes |
| M300 debt-sensitivity | Poor | Excellent |

Shall I run a full grant matching analysis for the mini-grid option?
```

---

## Demo Conversation 6: Follow-up Questions

### Initial Prompt

```
Help me find funding for a community mini-grid in Nigeria
```

### Agent asks clarifying questions, user responds:

```
It's in Enugu State, 50kW solar, will serve 150 households and a rice mill. Community cooperative will own it. Budget is $250,000.
```

### Agent provides full analysis, then user asks:

```
What documents do we need for the GEAPP application?
```

### Expected Agent Response

```
Based on GEAPP's typical requirements, here's what you'll need for your Enugu mini-grid application:

## Required Documents

### 1. Legal & Registration
- [ ] Cooperative registration certificate (CAC)
- [ ] Cooperative bylaws/constitution
- [ ] List of cooperative members
- [ ] Management committee members with brief CVs

### 2. Site & Land
- [ ] Land documentation (lease, allocation letter, or community land agreement)
- [ ] Site location with GPS coordinates
- [ ] Photos of proposed site
- [ ] Letter from EEDC confirming no grid extension planned

### 3. Demand Assessment
- [ ] Household survey results (GEAPP has template)
- [ ] Productive use anchor documentation (rice mill agreement)
- [ ] Willingness-to-pay assessment
- [ ] Current energy expenditure data

### 4. Technical
- [ ] Preliminary technical design (single-line diagram)
- [ ] Equipment specifications and quotes (2-3 suppliers)
- [ ] Solar resource data for location
- [ ] Load profile estimate

### 5. Financial
- [ ] Detailed budget with cost breakdown
- [ ] 5-year financial projection (revenue, costs, sustainability)
- [ ] Community contribution documentation ($X cash + in-kind)
- [ ] Cooperative bank account details

### 6. Governance
- [ ] Tariff structure proposal
- [ ] O&M plan
- [ ] Community benefit-sharing mechanism

## Priority Actions

Start with these (they take longest):
1. **Demand assessment survey** - 2-3 weeks
2. **Technical design from engineer** - 2-4 weeks
3. **Financial model development** - 1-2 weeks

Shall I provide templates or more detail on any of these?
```

---

## Testing Checklist

Use these prompts to verify agent functionality:

| Test | Prompt | Expected Behavior |
|------|--------|-------------------|
| Basic flow | "Help with a community mini-grid in Nigeria" | Asks clarifying questions, then runs full pipeline |
| Debt sensitivity | "Can we use IDA financing?" | Warns about debt implications |
| Health focus | "Electrify health clinics in Kenya" | Recommends Gavi, Power Africa Health |
| Ownership analysis | "Private developer wants 80% stake" | Flags capital flight risk |
| Grant matching | "What funders support productive use?" | Lists GEAPP, USADF, Shell Foundation |
| Readiness check | "Are we ready to apply?" | Generates checklist with status assessment |
