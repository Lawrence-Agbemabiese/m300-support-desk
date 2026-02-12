#!/usr/bin/env python3
"""
M300 Co-Intelligent Support Desk - CLI Demo

This script demonstrates the full pipeline:
1. Project Intake (from file or interactive)
2. Policy Interpretation
3. Grant Matching
4. Proposal Coaching

Usage:
    python run_demo.py                      # Interactive mode with example project
    python run_demo.py --intake file.json   # Load project from JSON file
    cat project.json | python run_demo.py   # Pipe JSON input
"""

import json
import sys
import argparse
from typing import Dict, List, Any
from datetime import datetime

# Import local scoring module
from score_match import match_grants, load_json_file


# ============================================================================
# POLICY INTERPRETER
# ============================================================================

def interpret_policy(project: Dict) -> Dict:
    """
    Agent 1: Policy Interpreter

    Analyzes the project against M300 debt-sensitivity principles.
    """
    ownership = project.get('ownership_model', 'undecided')
    productive_uses = project.get('productive_uses', [])
    debt_preference = project.get('debt_preference', 'grant_preferred')
    country = project.get('country', '')

    # Calculate M300 alignment score
    score = 50  # Base

    # Ownership scoring
    ownership_scores = {
        'community_cooperative': 30,
        'public_utility': 25,
        'public_community_hybrid': 28,
        'private_with_benefit_sharing': 10,
        'private_ipp': 0
    }
    score += ownership_scores.get(ownership, 0)

    # Productive use bonus
    if productive_uses:
        score += 10

    # Debt preference bonus
    if debt_preference == 'grant_only':
        score += 10

    score = min(score, 100)

    # Determine debt sensitivity tier
    tier_map = {
        'community_cooperative': 'tier_1',
        'public_utility': 'tier_1',
        'public_community_hybrid': 'tier_1',
        'private_with_benefit_sharing': 'tier_2',
        'private_ipp': 'tier_3'
    }
    debt_tier = tier_map.get(ownership, 'tier_2')

    # Generate grant-suitable elements
    grant_suitable = []
    if ownership == 'community_cooperative':
        grant_suitable.append('Community cooperative ownership eliminates profit extraction')
    if ownership in ['public_utility', 'public_community_hybrid']:
        grant_suitable.append('Public ownership keeps infrastructure in government/community hands')
    if productive_uses:
        grant_suitable.append(f'Productive use component: {", ".join(productive_uses[:3])}')
    grant_suitable.append('Last-mile rural electrification focus')
    if debt_preference == 'grant_only':
        grant_suitable.append('Explicit grant-only preference aligns with M300 recommendations')

    # Generate debt risks
    debt_risks = []
    if ownership == 'private_ipp':
        debt_risks.append('Private IPP model may require sovereign guarantees')
        debt_risks.append('Profit extraction creates capital flight risk')
    elif 'private' in ownership:
        debt_risks.append('Private component may create guarantee requirements')
    else:
        debt_risks.append('None identified under current structure')

    # Generate private capital risks
    private_risks = []
    if ownership != 'private_ipp':
        private_risks.append('If private developer introduced later, ensure community retains asset ownership')
        private_risks.append('Avoid performance guarantees that create contingent government liabilities')

    # Generate alignment narrative
    tech_type = project.get('technology_type', 'energy').replace('_', ' ')
    alignment_level = 'strong' if score >= 70 else ('moderate' if score >= 50 else 'weak')

    narrative = (
        f"This {tech_type} project in {country} demonstrates {alignment_level} alignment "
        f"with M300 debt-sensitivity principles (score: {score}/100). "
        f"The {ownership.replace('_', ' ')} ownership model "
    )
    if score >= 70:
        narrative += "supports grant eligibility by ensuring revenues remain local and no sovereign debt is created."
    else:
        narrative += "may face challenges with grant funders who prefer community/public ownership."

    if productive_uses:
        narrative += f" The productive use component ({', '.join(productive_uses[:2])}) strengthens the business case for grant investment."

    # Generate assumptions list
    assumptions = [
        'Project entity is legally registered and in good standing',
        'Land/site tenure is secured or securable',
        'Community engagement and buy-in is genuine and documented',
        'Demand assessment confirms project viability',
        'Technical feasibility has been preliminarily assessed'
    ]

    # Generate recommended framing
    framing = f"Position as {'community-led' if 'community' in ownership else 'locally-owned'} "
    framing += f"energy access project that advances M300 electrification goals without adding to {country}'s debt burden."

    return {
        'project_name': project.get('project_name', 'Unnamed Project'),
        'm300_alignment_score': score,
        'alignment_narrative': narrative,
        'ownership_classification': ownership,
        'grant_suitable_elements': grant_suitable,
        'debt_exposure_risks': debt_risks,
        'private_capital_risks': private_risks,
        'community_ownership_justification': (
            f"The {ownership.replace('_', ' ')} structure keeps revenues within {country}, "
            "builds local capacity, and prevents capital flight that occurs when external investors extract profits."
        ),
        'assumptions_list': assumptions,
        'recommended_framing': framing,
        'debt_sensitivity_tier': debt_tier
    }


# ============================================================================
# PROPOSAL COACH
# ============================================================================

def coach_proposal(project: Dict, interpretation: Dict, grant_match: Dict) -> Dict:
    """
    Agent 3: Proposal Coach

    Generates proposal outline, readiness checklist, and missing info questionnaire.
    """
    matches = grant_match.get('matches', [])
    target_funder = matches[0]['funder_name'] if matches else 'General'

    ownership = project.get('ownership_model', '')
    tech_type = project.get('technology_type', '').replace('_', ' ')
    country = project.get('country', '')
    location = project.get('location_description', country)
    beneficiaries = project.get('target_beneficiaries', 'target beneficiaries')
    productive_uses = project.get('productive_uses', [])
    capacity = project.get('capacity_kw')
    cost = project.get('estimated_cost_usd', 0)
    existing = project.get('existing_funding', '')

    # Generate proposal outline
    proposal_outline = {
        'problem_statement': (
            f"Approximately [X] people in {location} lack access to reliable electricity. "
            f"{'Health facilities operate without reliable power, affecting service delivery.' if 'health' in tech_type.lower() else 'This energy poverty constrains economic development and quality of life.'} "
            f"{'Without electricity, productive activities like ' + ', '.join(productive_uses[:2]) + ' cannot operate at full potential.' if productive_uses else ''}"
        ),

        'theory_of_change': (
            f"IF {project.get('project_name', 'this project')} is implemented with {ownership.replace('_', ' ')} ownership, "
            f"THEN {beneficiaries} will gain electricity access"
            f"{' AND ' + ', '.join(productive_uses[:2]) + ' activities will be enabled' if productive_uses else ''}, "
            f"LEADING TO improved livelihoods, economic opportunities, and demonstrated model for "
            f"{'community-owned' if 'community' in ownership else 'locally-owned'} electrification in {country}."
        ),

        'community_ownership_governance': (
            f"The project will be owned under a {ownership.replace('_', ' ')} structure. "
            + ('Governance includes: (1) General Assembly meeting quarterly, (2) Elected Management Committee with term limits and gender representation, (3) Trained local operators, (4) Transparent tariff-setting with community input, (5) Revenue allocation with maintenance reserves.'
               if ownership == 'community_cooperative'
               else 'Governance arrangements will ensure local participation and accountability.')
            + f" {interpretation.get('community_ownership_justification', '')}"
        ),

        'technical_approach': (
            f"{str(capacity) + 'kW' if capacity else 'Appropriately sized'} {tech_type} system serving {beneficiaries}. "
            f"{'System designed for reliability with battery storage, smart metering, and local maintainability.' if capacity else 'Technical specifications to be finalized.'} "
            f"{'Productive use loads (' + ', '.join(productive_uses[:2]) + ') integrated into system design.' if productive_uses else ''}"
        ),

        'affordability_tariff_principles': (
            'N/A - Public infrastructure funded by grant. Operational costs covered by government budget.'
            if 'health' in tech_type.lower() or ownership == 'public_utility'
            else 'Tariff structure designed around ability-to-pay: (1) Lifeline rate for basic consumption, (2) Standard rate for higher usage. Pre-paid metering ensures payment discipline. Tariff review every 2 years with community input.'
        ),

        'implementation_plan': (
            'Phased implementation:\n'
            '- Month 1-2: Detailed design, procurement, community mobilization\n'
            '- Month 3-4: Site preparation, procurement finalization\n'
            '- Month 5-6: Equipment installation and commissioning\n'
            '- Month 7-8: Connections, training, operational handover\n'
            '- Month 9-12: Performance monitoring, optimization, documentation'
        ),

        'mel_framework': (
            'Output indicators: Connections completed, capacity installed, system uptime\n'
            'Outcome indicators: Beneficiary satisfaction, energy expenditure changes, income changes\n'
            'Data collection: Smart meter analytics, quarterly surveys, annual audit\n'
            'Learning: Quarterly reviews, annual case study, sector knowledge sharing'
        ),

        'risk_register': (
            'Technical: Equipment failure - mitigated by warranties, service agreements, spare parts\n'
            f"Financial: {'Budget constraints - mitigated by Ministry commitment' if 'health' in tech_type.lower() else 'Payment delays - mitigated by pre-paid metering'}\n"
            'Governance: Capacity gaps - mitigated by training, oversight, term limits\n'
            'External: Policy changes - mitigated by community ownership resilience\n\n'
            f"DEBT SENSITIVITY: {'; '.join(interpretation.get('debt_exposure_risks', ['None identified']))} "
            f"This project {'creates no debt obligations' if interpretation.get('debt_sensitivity_tier') == 'tier_1' else 'has debt implications requiring management'}."
        )
    }

    # Generate readiness checklist
    readiness_checklist = [
        {'item': 'Legal entity registration', 'status': 'unknown', 'notes': 'Verify certificate is current', 'priority': 'critical'},
        {'item': 'Land/site documentation', 'status': 'unknown', 'notes': 'Obtain lease or allocation letter', 'priority': 'critical'},
        {'item': 'Community/stakeholder endorsement', 'status': 'unknown', 'notes': 'Document formal support', 'priority': 'critical'},
        {'item': 'Demand assessment', 'status': 'not_ready', 'notes': 'Conduct beneficiary survey', 'priority': 'critical'},
        {'item': 'Technical design', 'status': 'not_ready', 'notes': 'Commission preliminary design', 'priority': 'important'},
        {'item': 'Detailed budget', 'status': 'not_ready', 'notes': 'Obtain equipment quotes', 'priority': 'important'},
        {'item': 'Financial projections', 'status': 'not_ready', 'notes': 'Develop 5-year model', 'priority': 'important'},
        {'item': f'Co-financing documentation', 'status': 'unknown' if existing else 'not_ready', 'notes': f'Document {existing or "any contributions"}', 'priority': 'important'},
        {'item': 'Implementation timeline', 'status': 'ready', 'notes': 'Outlined in proposal', 'priority': 'nice_to_have'},
        {'item': 'M&E framework', 'status': 'ready', 'notes': 'Outlined in proposal', 'priority': 'nice_to_have'}
    ]

    # Add health-specific items
    if 'health' in tech_type.lower() or any('cold' in str(u).lower() or 'medical' in str(u).lower() for u in productive_uses):
        readiness_checklist.insert(3, {'item': 'Health Ministry endorsement', 'status': 'unknown', 'notes': 'Obtain formal letter', 'priority': 'critical'})

    # Generate missing info questionnaire
    missing_info = [
        f"What is the exact location (GPS coordinates) of the project site?",
        f"What is the registration number of the {ownership.replace('_', ' ')} entity?",
        f"What is the current energy situation? (grid access, diesel/kerosene expenditure)",
        f"What community contribution is committed? (amount, cash vs in-kind)",
        f"Has any technical feasibility study been conducted?",
        f"What is the governance structure? (committee composition, decision-making)",
        f"What permits are required and what is their status?",
        f"Who is the primary contact person?"
    ]

    if productive_uses:
        missing_info.append(f"What is the status of productive use anchor(s)? ({', '.join(productive_uses[:2])})")
    if ownership == 'community_cooperative':
        missing_info.append("How many registered members does the cooperative have?")
        missing_info.append("What is the cooperative's track record?")

    # Calculate readiness summary
    ready = sum(1 for item in readiness_checklist if item['status'] == 'ready')
    not_ready = sum(1 for item in readiness_checklist if item['status'] == 'not_ready')
    unknown = sum(1 for item in readiness_checklist if item['status'] == 'unknown')

    if ready >= 8:
        overall = 'ready_to_submit'
    elif ready >= 5:
        overall = 'nearly_ready'
    elif not_ready >= 5:
        overall = 'significant_gaps'
    else:
        overall = 'major_work_needed'

    return {
        'project_name': project.get('project_name', 'Unnamed Project'),
        'target_funder': target_funder,
        'proposal_outline': proposal_outline,
        'readiness_checklist': readiness_checklist,
        'missing_info_questionnaire': missing_info,
        'readiness_summary': {
            'overall_readiness': overall,
            'ready_count': ready,
            'not_ready_count': not_ready,
            'unknown_count': unknown
        }
    }


# ============================================================================
# CONSOLE OUTPUT FORMATTING
# ============================================================================

def print_separator(char: str = '=', width: int = 70):
    """Print a separator line."""
    print(char * width)


def print_header(title: str):
    """Print a section header."""
    print()
    print_separator()
    print(f"  {title}")
    print_separator()
    print()


def format_policy_output(interpretation: Dict):
    """Format policy interpretation for console display."""
    print_header("M300 POLICY INTERPRETATION")

    score = interpretation['m300_alignment_score']
    tier = interpretation['debt_sensitivity_tier']

    # Score visualization
    bar_width = 40
    filled = int((score / 100) * bar_width)
    bar = '[' + '#' * filled + '-' * (bar_width - filled) + ']'

    print(f"M300 Alignment Score: {score}/100  {bar}")
    print(f"Debt Sensitivity Tier: {tier.upper().replace('_', ' ')}")
    print()

    print("Alignment Narrative:")
    print(f"  {interpretation['alignment_narrative']}")
    print()

    print("Grant-Suitable Elements:")
    for elem in interpretation['grant_suitable_elements']:
        print(f"  + {elem}")
    print()

    print("Debt Exposure Risks:")
    for risk in interpretation['debt_exposure_risks']:
        print(f"  ! {risk}")
    print()

    print("Recommended Framing:")
    print(f"  {interpretation['recommended_framing']}")


def format_grant_match_output(grant_match: Dict):
    """Format grant matching results for console display."""
    print_header("GRANT MATCHING RESULTS")

    matches = grant_match['matches']

    if not matches:
        print("No suitable grant matches found.")
        print("Consider adjusting project ownership model or parameters.")
        return

    print(f"Top {len(matches)} Matches:\n")

    for i, match in enumerate(matches, 1):
        score = match['fit_score']
        tier = match['debt_sensitivity_tier']
        tier_emoji = {'tier_1': '[G]', 'tier_2': '[Y]', 'tier_3': '[O]', 'tier_4': '[R]'}.get(tier, '[?]')

        print(f"{i}. {match['funder_name']}")
        print(f"   Score: {score}/100  |  Instrument: {match['instrument_type']}  |  Debt: {tier_emoji}")
        print()
        print("   Rationale:")
        for rationale in match['fit_rationale'][:3]:
            print(f"     - {rationale}")

        if match['red_flags']:
            print("   Red Flags:")
            for flag in match['red_flags']:
                print(f"     ! {flag}")

        print("   Next Actions:")
        for action in match['next_actions'][:3]:
            print(f"     > {action}")
        print()

    print("Funding Strategy:")
    print(f"  {grant_match['overall_funding_strategy']}")


def format_proposal_coach_output(coach: Dict):
    """Format proposal coaching output for console display."""
    print_header("PROPOSAL COACHING")

    print(f"Target Funder: {coach['target_funder']}")
    print()

    # Readiness summary
    summary = coach['readiness_summary']
    print(f"Readiness Status: {summary['overall_readiness'].upper().replace('_', ' ')}")
    print(f"  Ready: {summary['ready_count']} | Not Ready: {summary['not_ready_count']} | Unknown: {summary['unknown_count']}")
    print()

    # Proposal outline (abbreviated)
    print("Proposal Outline Sections:")
    outline = coach['proposal_outline']
    for section in ['problem_statement', 'theory_of_change', 'community_ownership_governance']:
        print(f"\n  {section.replace('_', ' ').title()}:")
        text = outline[section]
        # Truncate long sections
        if len(text) > 200:
            text = text[:200] + '...'
        print(f"    {text}")

    print("\n  [Additional sections: Technical Approach, Tariff Principles, Implementation, M&E, Risk Register]")

    # Readiness checklist
    print("\nReadiness Checklist:")
    for item in coach['readiness_checklist'][:6]:
        status_icon = {'ready': '[x]', 'not_ready': '[ ]', 'unknown': '[?]'}.get(item['status'], '[?]')
        priority = item.get('priority', '')
        priority_tag = f" ({priority})" if priority == 'critical' else ''
        print(f"  {status_icon} {item['item']}{priority_tag}")
    if len(coach['readiness_checklist']) > 6:
        print(f"  ... and {len(coach['readiness_checklist']) - 6} more items")

    # Missing info
    print("\nKey Questions to Answer:")
    for q in coach['missing_info_questionnaire'][:5]:
        print(f"  ? {q}")
    if len(coach['missing_info_questionnaire']) > 5:
        print(f"  ... and {len(coach['missing_info_questionnaire']) - 5} more questions")


def print_json_output(data: Dict, label: str):
    """Print JSON output to file or stdout."""
    print(f"\n--- {label} (JSON) ---")
    print(json.dumps(data, indent=2))


# ============================================================================
# MAIN DEMO RUNNER
# ============================================================================

def run_demo(project: Dict, output_json: bool = False):
    """
    Run the full demo pipeline.

    Args:
        project: Project intake dictionary
        output_json: If True, output raw JSON instead of formatted text
    """
    print()
    print_separator('*')
    print("  M300 CO-INTELLIGENT SUPPORT DESK - DEMO")
    print_separator('*')
    print()
    print(f"Project: {project.get('project_name', 'Unnamed')}")
    print(f"Country: {project.get('country', 'Unknown')}")
    print(f"Technology: {project.get('technology_type', 'Unknown').replace('_', ' ')}")
    print(f"Ownership: {project.get('ownership_model', 'Unknown').replace('_', ' ')}")
    print(f"Cost: ${project.get('estimated_cost_usd', 0):,.0f}")
    print()

    # Step 1: Policy Interpretation
    print("Running Policy Interpreter...")
    interpretation = interpret_policy(project)

    if output_json:
        print_json_output(interpretation, "policy_interpretation")
    else:
        format_policy_output(interpretation)

    # Step 2: Grant Matching
    print("\nRunning Grant Matcher...")
    try:
        grant_match = match_grants(project)
    except FileNotFoundError as e:
        print(f"\nError loading data files: {e}")
        print("Creating minimal grant match output...")
        grant_match = {
            'project_name': project.get('project_name', 'Unnamed'),
            'matches': [],
            'excluded_funders': [],
            'overall_funding_strategy': 'Unable to match - data files not found'
        }

    if output_json:
        print_json_output(grant_match, "grant_match")
    else:
        format_grant_match_output(grant_match)

    # Step 3: Proposal Coaching
    print("\nRunning Proposal Coach...")
    proposal_coach = coach_proposal(project, interpretation, grant_match)

    if output_json:
        print_json_output(proposal_coach, "proposal_coach")
    else:
        format_proposal_coach_output(proposal_coach)

    # Final summary
    print_header("SUMMARY")
    print(f"M300 Alignment: {interpretation['m300_alignment_score']}/100 ({interpretation['debt_sensitivity_tier'].replace('_', ' ').title()})")
    if grant_match['matches']:
        top = grant_match['matches'][0]
        print(f"Top Match: {top['funder_name']} ({top['fit_score']}/100)")
    print(f"Readiness: {proposal_coach['readiness_summary']['overall_readiness'].replace('_', ' ').title()}")
    print()
    print("Next Step: Address items in readiness checklist, then prepare application for top funder.")
    print_separator()


# Example projects for testing
EXAMPLE_PROJECTS = {
    'minigrid': {
        "project_name": "Kaduna Community Solar Mini-Grid",
        "country": "Nigeria",
        "location_description": "Rural community in Kaduna State, 45km from grid",
        "technology_type": "solar_mini_grid",
        "capacity_kw": 50,
        "target_beneficiaries": "200 households, 1 cassava processing cooperative",
        "ownership_model": "community_cooperative",
        "productive_uses": ["cassava_processing", "phone_charging"],
        "estimated_cost_usd": 285000,
        "existing_funding": "Community committed $15,000 cash and in-kind",
        "project_stage": "concept",
        "community_engagement": "Cooperative formed 2021, 180 members",
        "additional_context": "DISCO confirms no grid extension planned",
        "debt_preference": "grant_only"
    },
    'health': {
        "project_name": "Plateau Health Clinic Electrification",
        "country": "Nigeria",
        "location_description": "5 rural health clinics in Plateau State",
        "technology_type": "solar_standalone",
        "capacity_kw": 25,
        "target_beneficiaries": "5 health clinics serving 25,000 people",
        "ownership_model": "public_community_hybrid",
        "productive_uses": ["vaccine_cold_chain", "medical_equipment"],
        "estimated_cost_usd": 175000,
        "existing_funding": "Ministry provides sites and recurrent budget",
        "project_stage": "early_development",
        "community_engagement": "Ward Development Committees active",
        "additional_context": "State cannot take new loans due to debt",
        "debt_preference": "grant_only"
    }
}


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description='M300 Co-Intelligent Support Desk - CLI Demo',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python run_demo.py                        # Run with example mini-grid project
  python run_demo.py --example health       # Run with health facility example
  python run_demo.py --intake project.json  # Load project from file
  python run_demo.py --json                 # Output raw JSON
  cat project.json | python run_demo.py     # Pipe JSON input
        """
    )
    parser.add_argument('--intake', '-i', type=str, help='Path to project intake JSON file')
    parser.add_argument('--example', '-e', choices=['minigrid', 'health'], default='minigrid',
                        help='Use built-in example project (default: minigrid)')
    parser.add_argument('--json', '-j', action='store_true', help='Output raw JSON instead of formatted text')

    args = parser.parse_args()

    # Determine project source
    project = None

    # Check for stdin input
    if not sys.stdin.isatty():
        try:
            input_data = sys.stdin.read()
            if input_data.strip():
                project = json.loads(input_data)
                print("Loaded project from stdin")
        except json.JSONDecodeError as e:
            print(f"Error parsing JSON from stdin: {e}", file=sys.stderr)
            sys.exit(1)

    # Check for file input
    if project is None and args.intake:
        try:
            with open(args.intake, 'r', encoding='utf-8') as f:
                project = json.load(f)
            print(f"Loaded project from {args.intake}")
        except FileNotFoundError:
            print(f"Error: File not found: {args.intake}", file=sys.stderr)
            sys.exit(1)
        except json.JSONDecodeError as e:
            print(f"Error parsing JSON from file: {e}", file=sys.stderr)
            sys.exit(1)

    # Use example project
    if project is None:
        project = EXAMPLE_PROJECTS[args.example]
        print(f"Using built-in example: {args.example}")

    # Run the demo
    run_demo(project, output_json=args.json)


if __name__ == '__main__':
    main()
