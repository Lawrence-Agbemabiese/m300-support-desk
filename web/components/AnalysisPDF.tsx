'use client';

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
import type { AnalysisResult } from '@/lib/schemas';

const styles = StyleSheet.create({
  page: {
    padding: 50,
    paddingBottom: 70,
    fontSize: 10,
    fontFamily: 'Helvetica',
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 25,
    borderBottomWidth: 2,
    borderBottomColor: '#10B981',
    paddingBottom: 20,
  },
  logo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  projectMeta: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 4,
  },
  section: {
    marginTop: 10,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    backgroundColor: '#F3F4F6',
    padding: 10,
    borderRadius: 4,
  },
  subsectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 14,
    marginBottom: 8,
  },
  text: {
    fontSize: 10,
    color: '#374151',
    marginBottom: 8,
    lineHeight: 1.5,
  },
  scoreBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#ECFDF5',
    borderRadius: 6,
  },
  scoreNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#059669',
    marginRight: 20,
    width: 60,
    textAlign: 'center',
  },
  scoreDetails: {
    flex: 1,
    paddingLeft: 5,
  },
  scoreLabel: {
    fontSize: 10,
    color: '#065F46',
    marginBottom: 8,
  },
  tierBadge: {
    backgroundColor: '#10B981',
    color: 'white',
    padding: '4 10',
    borderRadius: 4,
    fontSize: 9,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  tierBadgeYellow: {
    backgroundColor: '#F59E0B',
  },
  tierBadgeOrange: {
    backgroundColor: '#F97316',
  },
  tierBadgeRed: {
    backgroundColor: '#EF4444',
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingLeft: 10,
  },
  bullet: {
    width: 18,
    color: '#10B981',
    fontSize: 10,
  },
  listText: {
    flex: 1,
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.5,
  },
  grantCard: {
    marginBottom: 18,
    padding: 14,
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  grantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  grantName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
    paddingRight: 15,
  },
  grantScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
    minWidth: 50,
    textAlign: 'right',
  },
  grantMeta: {
    fontSize: 9,
    color: '#6B7280',
    marginBottom: 10,
  },
  proposalSection: {
    marginBottom: 14,
    padding: 12,
    backgroundColor: '#FAFAFA',
    borderRadius: 5,
  },
  proposalSectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  proposalSectionText: {
    fontSize: 9,
    color: '#4B5563',
    lineHeight: 1.6,
  },
  // Readiness summary box
  readinessSummaryBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    marginBottom: 20,
  },
  readinessStat: {
    alignItems: 'center',
    width: 100,
    paddingHorizontal: 10,
  },
  readinessNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  readinessLabel: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  // Checklist styles
  checklistItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
    paddingVertical: 2,
  },
  checklistStatus: {
    width: 75,
    fontSize: 8,
    fontWeight: 'bold',
    padding: '4 8',
    borderRadius: 3,
    textAlign: 'center',
    marginRight: 12,
  },
  statusReady: {
    backgroundColor: '#D1FAE5',
    color: '#065F46',
  },
  statusNotReady: {
    backgroundColor: '#FEE2E2',
    color: '#991B1B',
  },
  statusUnknown: {
    backgroundColor: '#E5E7EB',
    color: '#4B5563',
  },
  checklistText: {
    flex: 1,
    fontSize: 9,
    color: '#374151',
  },
  checklistPriority: {
    fontSize: 8,
    color: '#9CA3AF',
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: '#9CA3AF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
  },
  // Highlight box
  highlightBox: {
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 4,
    marginTop: 10,
  },
  highlightTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#065F46',
    marginBottom: 4,
  },
  highlightText: {
    fontSize: 9,
    color: '#047857',
  },
});

const sectionLabels: Record<string, string> = {
  problem_statement: 'Problem Statement',
  theory_of_change: 'Theory of Change',
  community_ownership_governance: 'Community Ownership & Governance',
  technical_approach: 'Technical Approach',
  affordability_tariff_principles: 'Affordability & Tariff Principles',
  implementation_plan: 'Implementation Plan',
  mel_framework: 'M&E Framework',
  risk_register: 'Risk Register',
};

interface AnalysisPDFProps {
  result: AnalysisResult;
}

export function AnalysisPDF({ result }: AnalysisPDFProps) {
  const { project, policy, grants, coach } = result;
  const generatedDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const getTierStyle = (tier: string | undefined) => {
    switch (tier) {
      case 'tier_2':
        return styles.tierBadgeYellow;
      case 'tier_3':
        return styles.tierBadgeOrange;
      case 'tier_4':
        return styles.tierBadgeRed;
      default:
        return {};
    }
  };

  const Footer = () => (
    <View style={styles.footer} fixed>
      <Text>Generated: {generatedDate}</Text>
      <Text>M300 Co-Intelligent Support Desk</Text>
      <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
    </View>
  );

  return (
    <Document>
      {/* Page 1: Overview & Policy Analysis */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>M300 Support Desk</Text>
          <Text style={styles.subtitle}>Debt-Sensitive Grant Matching for African Energy Projects</Text>
          <Text style={styles.title}>{project.project_name}</Text>
          <Text style={styles.projectMeta}>
            {project.country} | {project.technology_type.replace(/_/g, ' ')} | ${project.estimated_cost_usd.toLocaleString()}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>M300 Policy Alignment</Text>

          <View style={styles.scoreBox}>
            <Text style={styles.scoreNumber}>{policy.m300_alignment_score}</Text>
            <View style={styles.scoreDetails}>
              <Text style={styles.scoreLabel}>M300 Alignment Score (out of 100)</Text>
              <Text style={[styles.tierBadge, getTierStyle(policy.debt_sensitivity_tier)]}>
                {policy.debt_sensitivity_tier?.replace('_', ' ').toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={styles.subsectionTitle}>Analysis</Text>
          <Text style={styles.text}>{policy.alignment_narrative}</Text>

          <Text style={styles.subsectionTitle}>Grant-Suitable Elements</Text>
          {policy.grant_suitable_elements.map((element, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bullet}>+</Text>
              <Text style={styles.listText}>{element}</Text>
            </View>
          ))}

          <Text style={styles.subsectionTitle}>Debt Exposure Risks</Text>
          {policy.debt_exposure_risks.map((risk, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={[styles.bullet, { color: '#F59E0B' }]}>!</Text>
              <Text style={styles.listText}>{risk}</Text>
            </View>
          ))}

          {policy.recommended_framing && (
            <View style={styles.highlightBox}>
              <Text style={styles.highlightTitle}>Recommended Framing</Text>
              <Text style={styles.highlightText}>{policy.recommended_framing}</Text>
            </View>
          )}
        </View>

        <Footer />
      </Page>

      {/* Page 2: Grant Matches */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>M300 Support Desk</Text>
          <Text style={styles.subtitle}>Grant Matching Results</Text>
          <Text style={styles.title}>{project.project_name}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Grant Matches</Text>

          {grants.matches.slice(0, 3).map((match, index) => (
            <View key={index} style={styles.grantCard}>
              <View style={styles.grantHeader}>
                <Text style={styles.grantName}>{index + 1}. {match.funder_name}</Text>
                <Text style={styles.grantScore}>{match.fit_score}/100</Text>
              </View>
              <Text style={styles.grantMeta}>
                Instrument: {match.instrument_type.replace(/_/g, ' ')} | Debt Tier: {match.debt_sensitivity_tier?.replace('_', ' ').toUpperCase()}
              </Text>
              <Text style={styles.subsectionTitle}>Why This Funder</Text>
              {match.fit_rationale.slice(0, 3).map((rationale, i) => (
                <View key={i} style={styles.listItem}>
                  <Text style={styles.bullet}>-</Text>
                  <Text style={styles.listText}>{rationale}</Text>
                </View>
              ))}
              {match.red_flags && match.red_flags.length > 0 && (
                <>
                  <Text style={[styles.subsectionTitle, { color: '#DC2626', marginTop: 8 }]}>Red Flags</Text>
                  {match.red_flags.map((flag, i) => (
                    <View key={i} style={styles.listItem}>
                      <Text style={[styles.bullet, { color: '#DC2626' }]}>!</Text>
                      <Text style={styles.listText}>{flag}</Text>
                    </View>
                  ))}
                </>
              )}
              <Text style={styles.subsectionTitle}>Next Actions</Text>
              {match.next_actions.slice(0, 4).map((action, i) => (
                <View key={i} style={styles.listItem}>
                  <Text style={styles.bullet}>{i + 1}.</Text>
                  <Text style={styles.listText}>{action}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        <Footer />
      </Page>

      {/* Page 3: Additional Grant Matches + Strategy */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>M300 Support Desk</Text>
          <Text style={styles.subtitle}>Grant Matching Results (continued)</Text>
          <Text style={styles.title}>{project.project_name}</Text>
        </View>

        <View style={styles.section}>
          {grants.matches.slice(3, 5).map((match, index) => (
            <View key={index} style={styles.grantCard}>
              <View style={styles.grantHeader}>
                <Text style={styles.grantName}>{index + 4}. {match.funder_name}</Text>
                <Text style={styles.grantScore}>{match.fit_score}/100</Text>
              </View>
              <Text style={styles.grantMeta}>
                Instrument: {match.instrument_type.replace(/_/g, ' ')} | Debt Tier: {match.debt_sensitivity_tier?.replace('_', ' ').toUpperCase()}
              </Text>
              <Text style={styles.subsectionTitle}>Why This Funder</Text>
              {match.fit_rationale.slice(0, 3).map((rationale, i) => (
                <View key={i} style={styles.listItem}>
                  <Text style={styles.bullet}>-</Text>
                  <Text style={styles.listText}>{rationale}</Text>
                </View>
              ))}
              <Text style={styles.subsectionTitle}>Next Actions</Text>
              {match.next_actions.slice(0, 3).map((action, i) => (
                <View key={i} style={styles.listItem}>
                  <Text style={styles.bullet}>{i + 1}.</Text>
                  <Text style={styles.listText}>{action}</Text>
                </View>
              ))}
            </View>
          ))}

          <View style={styles.highlightBox}>
            <Text style={styles.highlightTitle}>Recommended Funding Strategy</Text>
            <Text style={styles.highlightText}>{grants.overall_funding_strategy}</Text>
          </View>
        </View>

        <Footer />
      </Page>

      {/* Page 4: Proposal Outline Part 1 */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>M300 Support Desk</Text>
          <Text style={styles.subtitle}>Proposal Outline</Text>
          <Text style={styles.title}>{project.project_name}</Text>
          <Text style={styles.projectMeta}>Target Funder: {coach.target_funder}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Grant Proposal Sections</Text>

          {Object.entries(coach.proposal_outline).slice(0, 4).map(([key, content]) => (
            <View key={key} style={styles.proposalSection}>
              <Text style={styles.proposalSectionTitle}>
                {sectionLabels[key] || key.replace(/_/g, ' ')}
              </Text>
              <Text style={styles.proposalSectionText}>{content}</Text>
            </View>
          ))}
        </View>

        <Footer />
      </Page>

      {/* Page 5: Proposal Outline Part 2 */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>M300 Support Desk</Text>
          <Text style={styles.subtitle}>Proposal Outline (continued)</Text>
          <Text style={styles.title}>{project.project_name}</Text>
        </View>

        <View style={styles.section}>
          {Object.entries(coach.proposal_outline).slice(4).map(([key, content]) => (
            <View key={key} style={styles.proposalSection}>
              <Text style={styles.proposalSectionTitle}>
                {sectionLabels[key] || key.replace(/_/g, ' ')}
              </Text>
              <Text style={styles.proposalSectionText}>{content}</Text>
            </View>
          ))}

          {coach.m300_alignment_statement && (
            <View style={styles.highlightBox}>
              <Text style={styles.highlightTitle}>M300 Alignment Statement</Text>
              <Text style={styles.highlightText}>{coach.m300_alignment_statement}</Text>
            </View>
          )}
        </View>

        <Footer />
      </Page>

      {/* Page 6: Readiness Checklist */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>M300 Support Desk</Text>
          <Text style={styles.subtitle}>Readiness Checklist</Text>
          <Text style={styles.title}>{project.project_name}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Submission Readiness</Text>

          {coach.readiness_summary && (
            <View style={styles.readinessSummaryBox}>
              <View style={styles.readinessStat}>
                <Text style={[styles.readinessNumber, { color: '#059669' }]}>
                  {coach.readiness_summary.ready_count}
                </Text>
                <Text style={styles.readinessLabel}>Ready</Text>
              </View>
              <View style={styles.readinessStat}>
                <Text style={[styles.readinessNumber, { color: '#DC2626' }]}>
                  {coach.readiness_summary.not_ready_count}
                </Text>
                <Text style={styles.readinessLabel}>Not Ready</Text>
              </View>
              <View style={styles.readinessStat}>
                <Text style={[styles.readinessNumber, { color: '#6B7280' }]}>
                  {coach.readiness_summary.unknown_count}
                </Text>
                <Text style={styles.readinessLabel}>Unknown</Text>
              </View>
            </View>
          )}

          <Text style={styles.subsectionTitle}>Checklist Items</Text>
          {coach.readiness_checklist.map((item, index) => (
            <View key={index} style={styles.checklistItem}>
              <Text style={[
                styles.checklistStatus,
                item.status === 'ready' ? styles.statusReady :
                item.status === 'not_ready' ? styles.statusNotReady :
                styles.statusUnknown
              ]}>
                {item.status === 'ready' ? 'READY' : item.status === 'not_ready' ? 'NOT READY' : 'UNKNOWN'}
              </Text>
              <Text style={styles.checklistText}>
                {item.item}
                {item.priority && (
                  <Text style={styles.checklistPriority}> ({item.priority.replace(/_/g, ' ')})</Text>
                )}
              </Text>
            </View>
          ))}

          <Text style={[styles.subsectionTitle, { marginTop: 15 }]}>Questions to Answer</Text>
          {coach.missing_info_questionnaire.slice(0, 8).map((question, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bullet}>{index + 1}.</Text>
              <Text style={styles.listText}>{question}</Text>
            </View>
          ))}
        </View>

        <Footer />
      </Page>
    </Document>
  );
}
