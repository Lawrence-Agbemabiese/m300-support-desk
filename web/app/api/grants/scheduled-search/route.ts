import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { prisma } from '@/lib/db';
import { grants } from '@/lib/data/grants';

// Predefined search queries for scheduled runs
const SCHEDULED_SEARCHES = [
  { query: 'new renewable energy grant programs Africa 2024 2025', region: 'All Africa' },
  { query: 'climate finance grants sub-saharan africa energy access', region: 'Sub-Saharan Africa' },
  { query: 'mini-grid funding opportunities West Africa Ghana Nigeria', region: 'West Africa' },
  { query: 'clean cooking grants Africa donor funding', region: 'All Africa' },
  { query: 'solar energy grants East Africa Kenya Uganda Tanzania', region: 'East Africa' },
  { query: 'rural electrification grants Southern Africa SADC', region: 'Southern Africa' },
  { query: 'off-grid energy funding Central Africa DRC', region: 'Central Africa' },
  { query: 'health facility electrification grants Africa', region: 'All Africa' },
];

const DISCOVERY_PROMPT = `You are a grant funding research assistant specializing in African energy access programs. Your task is to identify NEW grant funding opportunities that are NOT already in our database.

EXISTING FUNDERS IN DATABASE (do NOT include these):
{existing_funders}

SEARCH FOCUS: {search_query}
REGION FOCUS: {region}

Please search your knowledge for grant programs, funds, and donor initiatives that:
1. Provide GRANTS (not loans) or grant components for energy projects in Africa
2. Support renewable energy, mini-grids, solar, clean cooking, or energy access
3. Are currently active or have regular funding cycles
4. Accept applications from NGOs, community organizations, cooperatives, or governments

For each NEW grant opportunity you find, provide:
1. Funder Name (official name)
2. Program/Fund Name (if different)
3. Instrument Type (grant, results_based_grant, blended_grant_loan, etc.)
4. Geographic Focus (which African countries/regions)
5. Thematic Focus (energy types, sectors)
6. Typical Grant Size Range (USD)
7. Brief Description (2-3 sentences)
8. Website (if known)
9. Your confidence level (high/medium/low) that this is accurate and currently active

Return your findings as a JSON array. If you cannot find any NEW grants, return an empty array.

IMPORTANT:
- Only include grants you are confident about
- Do not make up or hallucinate funders
- Focus on {region} region grants
- Exclude any funders already in our database`;

// This endpoint can be called by a cron job (e.g., Vercel Cron, GitHub Actions, etc.)
// Protected by a secret key for security
export async function POST(request: NextRequest) {
  try {
    // Verify shared secret for scheduled calls
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || cronSecret.trim().length < 20) {
      return NextResponse.json(
        { error: 'CRON_SECRET is not configured securely' },
        { status: 500 }
      );
    }

    const isValidBearerToken = authHeader === `Bearer ${cronSecret}`;
    if (!isValidBearerToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if Anthropic API is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not configured' },
        { status: 500 }
      );
    }

    const existingFunders = grants.map(g => g.funder_name).join('\n- ');
    const client = new Anthropic();

    // Pick a random search from the list
    const searchConfig = SCHEDULED_SEARCHES[Math.floor(Math.random() * SCHEDULED_SEARCHES.length)];

    // Create search record
    const searchRecord = await prisma.grantSearch.create({
      data: {
        query: searchConfig.query,
        region: searchConfig.region,
        resultsCount: 0,
        status: 'running',
        triggeredBy: 'scheduled',
      },
    });

    const prompt = DISCOVERY_PROMPT
      .replace('{existing_funders}', existingFunders)
      .replace('{search_query}', searchConfig.query)
      .replace('{region}', searchConfig.region)
      .replace('{region}', searchConfig.region);

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    let discoveredGrants: Array<{
      funderName: string;
      programName?: string;
      instrumentType?: string;
      geographicFocus?: string;
      thematicFocus?: string;
      grantSizeMin?: number;
      grantSizeMax?: number;
      description: string;
      website?: string;
      confidence?: string;
    }> = [];

    try {
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        discoveredGrants = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error('Failed to parse Claude response:', parseError);
    }

    // Save discovered grants
    const savedGrants = await Promise.all(
      discoveredGrants.map(async (grant) => {
        const existingDiscovery = await prisma.discoveredGrant.findFirst({
          where: {
            funderName: { equals: grant.funderName },
            status: { not: 'rejected' },
          },
        });

        if (existingDiscovery) return null;

        return prisma.discoveredGrant.create({
          data: {
            funderName: grant.funderName + (grant.programName ? ` - ${grant.programName}` : ''),
            instrumentType: grant.instrumentType,
            geographyFocus: grant.geographicFocus,
            thematicFocus: grant.thematicFocus,
            ticketSizeMin: grant.grantSizeMin,
            ticketSizeMax: grant.grantSizeMax,
            description: grant.description,
            website: grant.website,
            discoveredBy: 'scheduled',
            searchQuery: searchConfig.query,
            confidence: grant.confidence === 'high' ? 0.9 : grant.confidence === 'medium' ? 0.7 : 0.5,
            status: 'pending',
          },
        });
      })
    );

    const newGrants = savedGrants.filter(Boolean);

    await prisma.grantSearch.update({
      where: { id: searchRecord.id },
      data: {
        resultsCount: newGrants.length,
        status: 'completed',
      },
    });

    return NextResponse.json({
      success: true,
      searchId: searchRecord.id,
      query: searchConfig.query,
      region: searchConfig.region,
      discoveredCount: newGrants.length,
    });
  } catch (error) {
    console.error('Scheduled search error:', error);
    return NextResponse.json(
      { error: 'Scheduled search failed' },
      { status: 500 }
    );
  }
}

// GET - Info about scheduled search configuration
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
