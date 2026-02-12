#!/usr/bin/env python3
"""
Grant Matching Scoring Module for M300 Co-Intelligent Support Desk

This module implements the scoring logic for matching energy projects
to grant funding sources, with explicit debt-sensitivity alignment.
"""

import json
import os
from typing import Dict, List, Tuple, Any


def load_json_file(filename: str) -> Any:
    """Load a JSON file from the data directory."""
    # Try relative paths
    paths_to_try = [
        os.path.join(os.path.dirname(__file__), '..', 'data', filename),
        os.path.join('data', filename),
        filename
    ]

    for path in paths_to_try:
        if os.path.exists(path):
            with open(path, 'r', encoding='utf-8') as f:
                return json.load(f)

    raise FileNotFoundError(f"Could not find {filename} in expected locations")


def score_geography(grant: Dict, project_country: str) -> Tuple[float, str]:
    """
    Score geography match (25% weight).

    Returns:
        Tuple of (score 0-100, explanation string)
    """
    country_lower = project_country.lower()

    # Check priority countries
    priority_countries = grant.get('geography_focus', {}).get('priority_countries', [])
    if any(c.lower() == country_lower for c in priority_countries):
        return 100, f"{project_country} is a priority country for this funder"

    # Check regions
    regions = grant.get('geography_focus', {}).get('regions', [])

    # Africa-specific matching
    african_regions = ['Sub-Saharan Africa', 'West Africa', 'East Africa',
                       'Southern Africa', 'Africa', 'Gavi-eligible countries']

    if any(r in regions for r in african_regions):
        # Assume African countries match if funder covers Africa
        return 60, f"{project_country} within funder's regional scope (Africa)"

    # Global South
    scope = grant.get('geography_focus', {}).get('scope', '')
    if scope == 'global_south':
        return 50, f"{project_country} eligible under Global South scope"

    return 0, f"{project_country} not clearly within funder's geographic focus"


def score_thematic(grant: Dict, project: Dict) -> Tuple[float, str]:
    """
    Score thematic alignment (30% weight).

    Returns:
        Tuple of (score 0-100, explanation string)
    """
    tech_type = project.get('technology_type', '').lower()
    productive_uses = project.get('productive_uses', [])

    primary_focus = grant.get('thematic_focus', {}).get('primary', [])
    secondary_focus = grant.get('thematic_focus', {}).get('secondary', [])

    # Check primary focus match
    primary_match = False
    for focus in primary_focus:
        focus_lower = focus.lower()
        if focus_lower in tech_type or tech_type in focus_lower:
            primary_match = True
            break
        # Handle common variations
        if 'mini_grid' in focus_lower and 'mini_grid' in tech_type:
            primary_match = True
            break
        if 'mini-grid' in focus_lower and 'mini' in tech_type:
            primary_match = True
            break

    # Health facility matching
    if 'health' in tech_type or any('cold_chain' in u or 'medical' in u for u in productive_uses):
        if 'vaccine_cold_chain' in primary_focus or 'health_facility_electrification' in primary_focus:
            return 100, "Strong match: Health/cold chain focus aligns with funder priorities"

    if primary_match:
        return 100, f"Strong match: {tech_type.replace('_', ' ')} aligns with funder's primary focus"

    # Check secondary focus
    for focus in secondary_focus:
        if focus.lower() in tech_type or tech_type in focus.lower():
            return 80, f"Good match: {tech_type.replace('_', ' ')} aligns with funder's secondary focus"

    # Productive use match
    if productive_uses and 'productive_use' in primary_focus + secondary_focus:
        return 80, f"Good match: Productive use component ({', '.join(productive_uses[:2])}) aligns"

    # General energy access
    if 'energy_access' in primary_focus + secondary_focus:
        return 60, "Moderate match: General energy access alignment"

    return 30, "Weak thematic alignment - verify funder accepts this technology type"


def score_size(grant: Dict, estimated_cost: float) -> Tuple[float, str]:
    """
    Score project size fit (15% weight).

    Returns:
        Tuple of (score 0-100, explanation string)
    """
    size_range = grant.get('typical_ticket_size_range', {})
    min_usd = size_range.get('min_usd', 0)
    max_usd = size_range.get('max_usd', float('inf'))

    if min_usd <= estimated_cost <= max_usd:
        return 100, f"Project cost ${estimated_cost:,.0f} within typical range (${min_usd:,.0f}-${max_usd:,.0f})"

    # Within 50% of boundaries
    lower_bound = min_usd * 0.5
    upper_bound = max_usd * 1.5

    if lower_bound <= estimated_cost <= upper_bound:
        return 60, f"Project cost ${estimated_cost:,.0f} near typical range (${min_usd:,.0f}-${max_usd:,.0f})"

    return 30, f"Project cost ${estimated_cost:,.0f} outside typical range (${min_usd:,.0f}-${max_usd:,.0f})"


def score_ownership(grant: Dict, ownership_model: str) -> Tuple[float, str]:
    """
    Score ownership model alignment (20% weight).

    This is critical for M300 debt-sensitivity alignment.

    Returns:
        Tuple of (score 0-100, explanation string)
    """
    community_note = grant.get('notes_on_alignment_to_community_ownership', '')

    # Community cooperative is best for grants
    if ownership_model == 'community_cooperative':
        if 'community' in community_note.lower() and 'support' in community_note.lower():
            return 100, "Excellent: Community cooperative ownership explicitly supported by funder"
        return 90, "Strong: Community cooperative ownership aligns with grant principles"

    # Public/hybrid models
    if ownership_model in ['public_utility', 'public_community_hybrid']:
        return 85, f"{ownership_model.replace('_', ' ').title()} ownership compatible with grant funding"

    # Private with benefit sharing
    if ownership_model == 'private_with_benefit_sharing':
        return 50, "Moderate: Private ownership with benefit-sharing may be acceptable to some funders"

    # Pure private IPP
    if ownership_model == 'private_ipp':
        return 20, "Weak: Private IPP model less suited for grant funding; may require guarantees"

    return 60, "Ownership model not clearly classified"


def score_eligibility(grant: Dict, project: Dict) -> Tuple[float, str]:
    """
    Score eligibility criteria match (10% weight).

    Returns:
        Tuple of (score 0-100, explanation string)
    """
    # This is a simplified check - in production, would need more detailed matching
    requirements = grant.get('key_eligibility', [])

    # Basic checks
    has_entity = project.get('project_stage', '') not in ['idea']
    has_engagement = bool(project.get('community_engagement', ''))

    if has_entity and has_engagement:
        return 70, "Most eligibility criteria likely met (pending verification)"
    elif has_entity or has_engagement:
        return 50, "Some eligibility criteria may be met; gaps to address"
    else:
        return 30, "Eligibility criteria unclear; detailed review needed"


def identify_red_flags(grant: Dict, project: Dict) -> List[str]:
    """
    Identify red flags that might reduce match quality.

    Returns:
        List of red flag descriptions
    """
    flags = []

    instrument_type = grant.get('instrument_type', '')
    debt_preference = project.get('debt_preference', 'grant_preferred')

    # RBF bridge financing
    if instrument_type == 'results_based_grant':
        flags.append("Results-based payment requires bridge financing for construction phase")

    # Blended finance for grant-only preference
    if 'blended' in instrument_type and debt_preference == 'grant_only':
        flags.append("Blended finance structure may include non-grant components")

    # Size concerns
    size_range = grant.get('typical_ticket_size_range', {})
    cost = project.get('estimated_cost_usd', 0)
    if cost < size_range.get('min_usd', 0) * 0.5:
        flags.append(f"Project may be too small for this funder (typical min: ${size_range.get('min_usd', 0):,.0f})")
    if cost > size_range.get('max_usd', float('inf')) * 1.5:
        flags.append(f"Project may be too large for this funder (typical max: ${size_range.get('max_usd', 0):,.0f})")

    # Disallowed patterns
    disallowed = grant.get('disallowed_or_risky_patterns', [])
    ownership = project.get('ownership_model', '')
    if ownership == 'private_ipp' and any('private' in d.lower() or 'guarantee' in d.lower() for d in disallowed):
        flags.append("Private IPP model may conflict with funder restrictions")

    return flags


def generate_next_actions(grant: Dict, project: Dict) -> List[str]:
    """
    Generate specific next actions for this funder.

    Returns:
        List of action items
    """
    actions = []

    funder_name = grant.get('funder_name', '')
    requirements = grant.get('typical_requirements', [])

    # Add standard first actions
    if 'website' in grant:
        actions.append(f"Review {funder_name} website and current call guidelines")

    # Add based on requirements
    for req in requirements[:4]:  # Take first 4 requirements
        if 'demand' in req.lower():
            actions.append("Complete demand assessment survey (check if funder has template)")
        elif 'technical' in req.lower() or 'design' in req.lower():
            actions.append("Commission preliminary technical design from qualified engineer")
        elif 'financial' in req.lower() or 'business' in req.lower():
            actions.append("Develop 5-year financial projection")
        elif 'community' in req.lower():
            actions.append("Document community engagement and contribution")

    # Add ownership-specific
    ownership = project.get('ownership_model', '')
    if ownership == 'community_cooperative':
        actions.append("Obtain cooperative registration certificate")
    elif 'public' in ownership:
        actions.append("Obtain government endorsement letter")

    # Deduplicate and limit
    seen = set()
    unique_actions = []
    for action in actions:
        if action not in seen:
            seen.add(action)
            unique_actions.append(action)

    return unique_actions[:6]  # Return max 6 actions


def calculate_final_score(
    geo_score: float,
    thematic_score: float,
    size_score: float,
    ownership_score: float,
    eligibility_score: float,
    red_flags: List[str],
    debt_tier: str,
    weights: Dict
) -> int:
    """
    Calculate weighted final score with penalties.

    Returns:
        Final score as integer 0-100
    """
    # Get weights (with defaults) - handle nested structure
    # weights can be {'geography': {'weight': 0.25, ...}} or {'geography': 0.25}
    def get_weight(key: str, default: float) -> float:
        val = weights.get(key, default)
        if isinstance(val, dict):
            return val.get('weight', default)
        return val

    w_geo = get_weight('geography', 0.25)
    w_thematic = get_weight('thematic', 0.30)
    w_size = get_weight('size', 0.15)
    w_ownership = get_weight('ownership', 0.20)
    w_elig = get_weight('eligibility', 0.10)

    # Calculate base score
    base_score = (
        geo_score * w_geo +
        thematic_score * w_thematic +
        size_score * w_size +
        ownership_score * w_ownership +
        eligibility_score * w_elig
    )

    # Apply red flag penalty (10% per flag, max 30%)
    flag_penalty = min(len(red_flags) * 0.10, 0.30)

    # Apply debt sensitivity modifier
    debt_modifiers = {
        'tier_1': 1.0,
        'tier_2': 0.95,
        'tier_3': 0.75,
        'tier_4': 0.50
    }
    debt_modifier = debt_modifiers.get(debt_tier, 1.0)

    # Calculate final score
    final_score = base_score * (1 - flag_penalty) * debt_modifier

    return round(final_score)


def score_all_grants(project: Dict, grants: List[Dict], weights: Dict) -> List[Dict]:
    """
    Score all grants against a project and return ranked results.

    Args:
        project: Project intake dictionary
        grants: List of grant source dictionaries
        weights: Scoring weights dictionary

    Returns:
        List of match dictionaries, sorted by score descending
    """
    results = []

    country = project.get('country', '')
    ownership = project.get('ownership_model', '')
    cost = project.get('estimated_cost_usd', 0)

    for grant in grants:
        # Calculate component scores
        geo_score, geo_explain = score_geography(grant, country)
        thematic_score, thematic_explain = score_thematic(grant, project)
        size_score, size_explain = score_size(grant, cost)
        ownership_score, ownership_explain = score_ownership(grant, ownership)
        eligibility_score, eligibility_explain = score_eligibility(grant, project)

        # Get red flags
        red_flags = identify_red_flags(grant, project)

        # Get debt tier
        debt_tier = grant.get('debt_sensitivity_tier', 'tier_1')

        # Calculate final score
        final_score = calculate_final_score(
            geo_score, thematic_score, size_score,
            ownership_score, eligibility_score,
            red_flags, debt_tier,
            weights.get('component_weights', {})
        )

        # Generate next actions
        next_actions = generate_next_actions(grant, project)

        # Build result
        results.append({
            'funder_id': grant.get('id', ''),
            'funder_name': grant.get('funder_name', ''),
            'instrument_type': grant.get('instrument_type', ''),
            'fit_score': final_score,
            'debt_sensitivity_tier': debt_tier,
            'score_breakdown': {
                'geography_score': geo_score,
                'thematic_score': thematic_score,
                'size_score': size_score,
                'ownership_score': ownership_score,
                'eligibility_score': eligibility_score
            },
            'fit_rationale': [
                geo_explain,
                thematic_explain,
                size_explain,
                ownership_explain
            ],
            'red_flags': red_flags,
            'next_actions': next_actions
        })

    # Sort by score descending
    results.sort(key=lambda x: x['fit_score'], reverse=True)

    return results


def match_grants(project: Dict) -> Dict:
    """
    Main entry point: match a project to grant sources.

    Args:
        project: Project intake dictionary

    Returns:
        Grant match result dictionary
    """
    # Load data files
    grants = load_json_file('grants_seed.json')
    weights = load_json_file('scoring_weights.json')

    # Score all grants
    all_results = score_all_grants(project, grants, weights)

    # Split into matches and excluded
    threshold = weights.get('final_score_calculation', {}).get('minimum_threshold', 30)
    matches = [r for r in all_results if r['fit_score'] >= threshold][:5]
    excluded = [
        {'funder_name': r['funder_name'], 'exclusion_reason': f"Fit score {r['fit_score']} below threshold {threshold}"}
        for r in all_results if r['fit_score'] < threshold
    ]

    # Generate funding strategy
    if matches:
        top = matches[0]
        strategy = f"Lead with {top['funder_name']} application ({top['fit_score']}/100 fit score, {top['instrument_type']}). "
        if len(matches) > 1:
            strategy += f"Consider {matches[1]['funder_name']} as secondary option. "
        if project.get('debt_preference') == 'grant_only':
            strategy += "Prioritize grant instruments to maintain debt-free status."
    else:
        strategy = "No strong matches found. Consider adjusting project parameters or ownership model."

    return {
        'project_name': project.get('project_name', 'Unnamed Project'),
        'matches': matches,
        'excluded_funders': excluded[:3],  # Limit excluded list
        'overall_funding_strategy': strategy,
        'matching_metadata': {
            'total_funders_evaluated': len(all_results),
            'scoring_weights_version': weights.get('version', '1.0')
        }
    }


# CLI usage
if __name__ == '__main__':
    import sys

    # Example project for testing
    example_project = {
        "project_name": "Test Community Mini-Grid",
        "country": "Nigeria",
        "location_description": "Rural community, 40km from grid",
        "technology_type": "solar_mini_grid",
        "capacity_kw": 50,
        "target_beneficiaries": "200 households",
        "ownership_model": "community_cooperative",
        "productive_uses": ["cassava_processing"],
        "estimated_cost_usd": 285000,
        "project_stage": "concept",
        "community_engagement": "Cooperative active since 2021",
        "debt_preference": "grant_only"
    }

    # Accept JSON from stdin if provided
    if not sys.stdin.isatty():
        try:
            input_data = sys.stdin.read()
            if input_data.strip():
                example_project = json.loads(input_data)
        except json.JSONDecodeError as e:
            print(f"Error parsing JSON input: {e}", file=sys.stderr)
            sys.exit(1)

    # Run matching
    try:
        result = match_grants(example_project)
        print(json.dumps(result, indent=2))
    except FileNotFoundError as e:
        print(f"Error: {e}", file=sys.stderr)
        print("Make sure to run from repository root or src directory.", file=sys.stderr)
        sys.exit(1)
