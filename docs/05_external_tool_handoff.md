# External Project-Development Tool Handoff

**Status:** implementation decision and pilot specification  
**Sources last checked:** 2026-09-04

## Decision

M300 should remain the tailored, grant-first decision-support layer. It should not grow into a general project-management suite, an engineering simulation package, a financier's transaction platform, or a full financial-appraisal model.

The integration boundary is therefore:

- **Build and maintain in M300:** structured intake; M300 policy interpretation; debt-sensitivity and funding-tier assessment; grant matching; proposal coaching; assumptions and evidence gaps; immutable revisions; human approvals; and a concise record of external analyses.
- **Integrate or hand off:** infrastructure lifecycle management, detailed technical system design, procurement and results-based-finance administration, asset monitoring, and full financial/economic feasibility modelling.
- **Do not duplicate:** specialist calculations, workflow controls, or document repositories already maintained by an external platform. M300 may explain and summarize those outputs, but must retain their source, version, assumptions, units, and review status.

This preserves the project's distinctive value—M300-aware, debt-sensitive support—while allowing experienced specialist products to do the work for which they were built.

## Official-source comparison

| Product | Officially described capability | Best M300 use | Integration posture | Due diligence before use |
|---|---|---|---|---|
| **SOURCE / SourceX, Sustainable Infrastructure Foundation (SIF)** | SOURCE is described as multilateral infrastructure project-development software for governments, with project-team, task, document, assessment, portfolio, project-preparation-facility-finder, and interoperability capabilities. It is offered free to government agencies in developing and emerging countries and hosted with UNICC. SIF announced that legacy SOURCE was discontinued on 2026-08-14 and replaced by the API-first, cloud-based SourceX platform. | Government/public-agency project preparation, institutional workflow, portfolio oversight, and international-standard assessments after M300 has shaped the concept and debt-sensitive financing position. | **Preferred lifecycle handoff candidate.** Begin with an approved, minimal JSON/file export; pursue API integration only after SIF confirms onboarding, tenancy, field mappings, and support. | **Maturity/onboarding flag:** SourceX v1.0 and migration are recent. Public material describes API-first interoperability but does not establish a public, self-service API contract or immediate access for every organization. Confirm eligibility, onboarding route, API availability, country customization, data location, support, and production service commitments directly with SIF. |
| **Odyssey Energy Solutions** | Odyssey describes an end-to-end distributed-renewable-energy platform covering finance, portfolio/construction monitoring, results-based-finance application and claims workflows, remote verification, procurement, supply-chain credit, and asset analytics. | A transaction or implementation partner when a project enters active DRE financing, procurement, RBF verification, or portfolio/asset monitoring. | **Partner-led handoff.** Start with a shared project package and identifiers; use a formal API or managed data exchange only if Odyssey makes one available under an agreement. | Confirm commercial model, program eligibility, API/export options, ownership of monitoring data, supported countries, data processing terms, and whether a specific funder or program requires Odyssey. |
| **HOMER Pro, UL Solutions** | HOMER Pro simulates hybrid microgrids, optimizes system configurations and least-cost alternatives, and performs sensitivity analysis. Official material describes time-step simulation and optional modules for technologies and multi-year effects. | Specialist technical pre-feasibility: load/resource assumptions, candidate architectures, capacity and dispatch results, cost comparisons, and sensitivity cases. | **File-based technical-analysis pilot first.** Export a versioned M300 assumptions package for an engineer; import a reviewed summary and evidence references. Do not imply automated model execution unless a supported integration and licence explicitly permit it. | Confirm licence/module needs, analyst competence, supported import/export formats, reproducibility requirements, and whether an engineering sign-off is required. HOMER results are model outputs, not proof of site feasibility or bankability. |
| **UNIDO COMFAR** | UNIDO describes COMFAR as a sector-neutral tool for financial and economic feasibility analysis, forecasting, impact assessment, investment readiness, and capacity building. Its COMFAR 4 page describes a cloud-based fourth generation grounded in UNIDO methodology. | Detailed financial/economic appraisal once project cost, operating, financing, and benefit assumptions are sufficiently mature. | **Deferred validation pilot.** Use a controlled analyst handoff only after UNIDO confirms the currently obtainable product, access path, import/export facilities, and terms. | **Availability flag:** official wording includes future-facing language (for example, what COMFAR 4 “will provide”) and an estimated implementation duration. Do not assume that the cloud product, licences, onboarding, or APIs are generally available. Obtain written confirmation from UNIDO before scheduling an integration. |

### Primary official sources

- SIF, [SOURCE platform overview](https://public.sif-source.org/source/)
- SIF, [Introducing SourceX and the Next Generation of Infrastructure Project Development](https://public.sif-source.org/mdbs-infra-news/introducing-sourcex-and-the-next-generation-of-infrastructure-project-development/)
- SIF, [SourceX launch](https://public.sif-source.org/mdbs-infra-news/sourcex-launch/)
- Odyssey Energy Solutions, [platform overview](https://odysseyenergysolutions.com/)
- UL Solutions, [HOMER Pro](https://homerenergy.com/homer-pro)
- UNIDO, [COMFAR — 4th Generation](https://www.unido.org/solutions/computer-model-feasibility-analysis-and-reporting-comfar-4th-generation)
- UNIDO, [COMFAR software](https://www.unido.org/comfar)

Product claims above are deliberately limited to those official pages. Availability, price, eligibility, contractual terms, API access, and data-governance arrangements must be reverified when a pilot begins.

## Capability boundary

| Workflow stage | M300 is authoritative for | External tool may be authoritative for |
|---|---|---|
| Concept and screening | Intake, revision history, M300 alignment, ownership narrative, debt sensitivity, funding tier, and evidence gaps | Optional national infrastructure-screening workflow |
| Preparation | Grant fit, proposal framing, readiness checklist, and handoff approval | Work plan, task assignment, formal project-preparation templates, project documents, and portfolio dashboards |
| Technical analysis | Stated needs, safeguards, assumptions received, and an intelligible summary | Engineering model, scenario definitions, dispatch, component sizing, technical cost outputs, and model files |
| Financial appraisal | Grant-first constraints, debt-risk interpretation, and funding-fit explanation | Cash-flow model, economic appraisal, sensitivity tables, and appraisal files |
| Financing and delivery | Recommended funding pathway and verified grant-source record | Transaction workflow, procurement, RBF claims, verification, monitoring, and asset analytics |

M300 must never convert an external estimate into an observed fact. A value returned by an external tool remains `modelled`, `estimated`, or `externally_reported` until a named reviewer accepts it.

## Provider-neutral handoff contract

The contract is an interchange format, not a promise that each provider exposes an API. It supports API, secure file exchange, or supervised manual entry without changing M300's canonical model.

### Outbound envelope

```json
{
  "schemaVersion": "m300.handoff.v1",
  "handoffId": "ho_01J...",
  "createdAt": "2026-09-04T12:00:00Z",
  "purpose": "technical_pre_feasibility",
  "source": {
    "system": "m300-support-desk",
    "projectId": "project_uuid",
    "projectRevision": 3,
    "analysisRunId": "analysis_uuid",
    "canonicalDataHash": "sha256:..."
  },
  "destination": {
    "provider": "provider_slug",
    "capability": "microgrid_optimization",
    "environment": "pilot"
  },
  "project": {
    "name": "Community mini-grid",
    "country": "Nigeria",
    "location": { "administrativeArea": "Kaduna", "coordinates": null },
    "technology": { "type": "solar_minigrid", "other": null },
    "ownership": { "type": "community_cooperative", "other": null },
    "beneficiaries": 200,
    "capacityKw": 50,
    "estimatedCost": { "amount": 325000, "currency": "USD", "basis": "concept_estimate" },
    "summary": "..."
  },
  "m300Assessment": {
    "fundingTier": "tier_1",
    "debtSensitivity": "preferred_low_or_no_debt",
    "constraints": ["no_sovereign_guarantee"],
    "evidenceGaps": ["hourly_load_profile"]
  },
  "inputs": [
    {
      "name": "annual_load_kwh",
      "value": 164250,
      "unit": "kWh/year",
      "status": "estimated",
      "sourceRef": "ev_01J...",
      "asOf": "2026-08-31"
    }
  ],
  "attachments": [
    {
      "attachmentId": "att_01J...",
      "name": "load-survey.xlsx",
      "mediaType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "sha256": "...",
      "downloadRef": "short_lived_authorized_reference"
    }
  ],
  "requestedOutputs": ["candidate_systems", "assumptions", "sensitivity_summary"],
  "governance": {
    "dataClassification": "confidential_project",
    "approvedBy": "user_uuid",
    "approvedAt": "2026-09-04T11:58:00Z",
    "allowedUses": ["named_pilot_analysis"],
    "retentionUntil": "2026-12-31T00:00:00Z",
    "containsPersonalData": false
  }
}
```

Contract rules:

1. `projectId`, `projectRevision`, `canonicalDataHash`, and `handoffId` are required and immutable.
2. Enumerations use M300's stable machine values; human labels are additional fields, never replacements.
3. Every quantitative value carries a unit, currency where relevant, evidence status, and source/date.
4. Missing information is `null` or recorded in `evidenceGaps`; zero and an empty string are not substitutes for unknown.
5. Attachments travel by short-lived authorized reference and checksum, not embedded base64. Secrets and session tokens never appear in the envelope.
6. The export contains only fields approved for the named purpose and provider.

### Return envelope

```json
{
  "schemaVersion": "m300.handoff-result.v1",
  "handoffId": "ho_01J...",
  "provider": "provider_slug",
  "externalRunId": "external_reference",
  "status": "completed",
  "generatedAt": "2026-09-05T09:30:00Z",
  "inputDataHash": "sha256:...",
  "providerVersion": "product_or_method_version",
  "outputs": [
    {
      "name": "recommended_pv_capacity",
      "value": 61.5,
      "unit": "kW",
      "status": "modelled",
      "scenario": "base_case"
    }
  ],
  "assumptions": [
    { "name": "discount_rate", "value": 0.08, "unit": "ratio", "source": "analyst" }
  ],
  "warnings": ["Site survey not completed"],
  "evidence": [
    { "name": "model_report.pdf", "sha256": "...", "retrievalRef": "authorized_reference" }
  ],
  "review": {
    "verificationStatus": "pending_human_review",
    "reviewerId": null,
    "reviewedAt": null
  }
}
```

The return envelope may contain summaries and artifact references, but M300 must not parse undocumented proprietary files or infer a successful analysis from file delivery alone.

## Reconciliation and ownership rules

1. **Match the exact snapshot.** Accept a return only when `handoffId` exists and `inputDataHash` matches the approved outbound package. Otherwise quarantine it for review.
2. **Be idempotent.** `handoffId + externalRunId + providerVersion` identifies a result. A retry may update transport state but must not create duplicate accepted results.
3. **Preserve both histories.** External results are append-only records linked to the originating project revision. They do not overwrite the intake or a prior external result.
4. **Separate proposed from accepted changes.** Values returned by a provider are proposed facts. A human reviewer selects which values to accept; acceptance creates a new M300 project revision and records the reviewer, time, old value, new value, source, and rationale.
5. **Resolve conflicts explicitly.** If the M300 project has advanced since export, show a field-level comparison. The reviewer may keep M300, accept the external value, or record both as scenarios. No last-write-wins merge is permitted.
6. **Respect domain authority.** The external model/report remains authoritative for its detailed calculations. M300 is authoritative for its policy, debt-sensitivity, grant-match, workflow approval, and explanatory records.
7. **Reanalyse deliberately.** Accepted changes do not silently rerun agents. The user must invoke reanalysis, producing a new analysis run against the new revision.
8. **Keep provenance visible.** User-facing reports label the provider, product/method version, run date, reviewer, evidence status, and relevant caveats.

## Phased pilot

### Phase 0 — vendor and data-governance confirmation

- Obtain written answers on eligibility, pricing, onboarding, API/file support, data location, subprocessors, retention/deletion, security, support, and exit/export.
- Request current schemas or sample exports; do not design against screenshots.
- Select one low-sensitivity demonstration project and a named human owner.
- Complete a data-protection and security review before transferring live project or personal data.

**Exit gate:** approved provider, permitted dataset, signed-off field map, rollback plan, and test environment.

### Phase 1 — supervised file handoff

- Generate the outbound JSON plus a human-readable manifest.
- Transfer only approved fields and checksum-addressed attachments.
- Have a trained analyst enter/import the package and return one result envelope with source artifacts.
- Reconcile results without modifying the canonical intake.

**Recommended first tests:** SourceX for a public-agency lifecycle workflow if SIF grants onboarding; HOMER Pro for one mini-grid technical-pre-feasibility exercise. These test different boundaries and should not be treated as competing products.

**Exit gate:** complete audit trail, reproducible outputs, no silent data loss, and reviewer confirmation that the handoff saved effort.

### Phase 2 — repeatable one-way integration

- Automate export only, using a destination allowlist and provider-specific adapter behind the provider-neutral contract.
- Add retry, timeout, checksum, status, and error handling.
- Run at least three representative projects, including incomplete input and a revised project.

**Exit gate:** 100% traceability, safe failure behaviour, and no duplicate results across retries.

### Phase 3 — controlled round trip

- Ingest structured results into a quarantine/review area.
- Present field-level reconciliation and require human acceptance.
- Create a new M300 revision for accepted changes and rerun analysis only on command.

**Exit gate:** concurrency, authorization, idempotency, provenance, and rollback tests all pass.

### Phase 4 — production decision

- Compare saved staff time, output quality, error rate, user adoption, and total cost against the manual baseline.
- Proceed, renegotiate, switch provider, or retain file-based handoff. Integration depth is an evidence-based decision, not a prerequisite for using a specialist tool.

Odyssey should enter a pilot when a real financing, procurement, RBF, or operating partner requires its workflow. COMFAR should enter only after UNIDO confirms the obtainable product and onboarding route.

## Security and governance controls

- **Explicit authorization:** only project owners and authorized advisers may create, transmit, retrieve, review, or revoke a handoff.
- **Purpose limitation and minimization:** a per-provider allowlist controls fields and attachments. Contact details and beneficiary-level data are excluded unless indispensable and separately approved.
- **Credential isolation:** provider credentials stay in a secrets manager and server-side adapter; never in browser code, project records, logs, JSON, or n8n exports.
- **Transport and storage:** require encrypted transport and encryption at rest. Use short-lived references, checksums, malware scanning, and bounded file sizes.
- **Data residency and sovereignty:** document storage country/jurisdiction, cross-border transfers, subprocessors, government requirements, and deletion/export rights before live use.
- **Auditability:** record requester, approver, recipient, exact data hash, transfer time, provider response, retries, reviewer decision, retention date, and deletion confirmation.
- **Least privilege:** separate pilot and production credentials; scope tokens to the minimum project and action; rotate credentials and revoke them at pilot close.
- **Human accountability:** external and AI-generated outputs are advisory until reviewed. Debt classification, funding recommendation, engineering conclusion, and financial appraisal must display accountable reviewers and limitations.
- **Incident handling:** define notification contacts, containment, provider suspension, recovery, and affected-project identification before launch.
- **Exit portability:** retain M300's provider-neutral envelopes and export evidence so a provider can be changed without losing the decision record.

## Acceptance criteria

A pilot is acceptable only when all applicable criteria pass:

- [ ] The handoff identifies one immutable M300 project revision and analysis run.
- [ ] The project owner can preview and approve the exact fields and files before transfer.
- [ ] Unknown, estimated, modelled, verified, and user-supplied values remain distinguishable.
- [ ] Units, currencies, dates, scenarios, assumptions, and evidence references survive round trip.
- [ ] Unauthorized users cannot create, retrieve, accept, or delete a handoff.
- [ ] A retry does not create duplicate projects, runs, results, or revisions.
- [ ] Stale or hash-mismatched results are quarantined rather than merged.
- [ ] Returned values remain proposals until a human accepts them field by field.
- [ ] Accepted changes create a new revision; no historical intake or analysis is overwritten.
- [ ] Provider, product/method version, external run ID, reviewer, and caveats appear in the M300 record and any exported report.
- [ ] Error, timeout, partial-result, revocation, retention, and deletion paths are tested.
- [ ] The provider supplies an export/exit route and agreed deletion confirmation.
- [ ] Users demonstrate measurable time or quality improvement over the existing manual workflow.
- [ ] SourceX access/maturity or COMFAR availability is confirmed in writing before either is represented as operationally integrated.

## Principal risks and mitigations

| Risk | Consequence | Mitigation |
|---|---|---|
| Recent SourceX transition or unclear onboarding | Schedule slips; integration built against unstable or unavailable interfaces | Treat as discovery until SIF confirms access and schema; retain file-based fallback |
| COMFAR product/access uncertainty | Pilot cannot start or uses the wrong generation | Obtain written UNIDO confirmation and current product documentation before design |
| Vendor lock-in | Project history or workflow becomes difficult to move | Provider-neutral envelopes, artifact export, stable M300 IDs, and exit clauses |
| Data sovereignty or confidentiality mismatch | Legal, institutional, or trust harm | Minimize data, document jurisdictions/subprocessors, obtain approval, encrypt, and test deletion |
| Semantic mismatch | Units, estimates, ownership, or debt meaning changes in transit | Versioned field maps, controlled vocabularies, units, evidence status, and human reconciliation |
| Stale-result overwrite | Newer project information is silently lost | Immutable revisions, hashes, concurrency check, quarantine, and no last-write-wins |
| Overreliance on model outputs | Weak engineering or financing decisions presented as facts | Preserve assumptions and warnings; require qualified technical/financial review |
| Excessive integration scope | M300 duplicates specialist platforms and becomes costly to maintain | Enforce the capability boundary; pilot one measurable handoff at a time |
| Commercial or programme dependency | Access or economics change after adoption | Verify terms at each phase, avoid exclusive dependencies, and preserve manual/file workflows |
| Unverified funding discovery | Users act on outdated or invented opportunities | Keep grant leads explicitly unverified until official-source and human checks are complete |

## Recommended near-term sequence

1. Keep the current M300 revision, analysis, search, and grant-readiness improvements as the release priority.
2. Send the Phase 0 questionnaire and sample contract to SIF, UL Solutions/HOMER, Odyssey, and UNIDO.
3. Select a public/community mini-grid case with no personal beneficiary data.
4. Run one SourceX lifecycle handoff if onboarding is available and one HOMER technical handoff with a qualified analyst.
5. Measure duplicated entry, staff time, data loss, and decision quality before authorizing any API work.
6. Invite Odyssey only when a live financing/delivery programme supplies a concrete workflow; hold COMFAR until availability is confirmed.

The intended result is a **co-intelligent support desk connected to specialist systems**, not a replacement for them.
