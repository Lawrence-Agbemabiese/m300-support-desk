import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { prisma } from '@/lib/db';
import { getServerSession } from '@/lib/auth';
import { grants } from '@/lib/data/grants';
import { z } from 'zod';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { rejectIfCrossOrigin } from '@/lib/request-security';

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

Return your findings as a JSON array with these EXACT field names:
- "funderName": string (required)
- "programName": string (optional, if different from funder)
- "instrumentType": string (optional)
- "geographicFocus": string (optional)
- "thematicFocus": string (optional)
- "grantSizeMin": number (optional, in USD)
- "grantSizeMax": number (optional, in USD)
- "description": string (required)
- "website": string (optional)
- "confidence": "high" | "medium" | "low"

If you cannot find any NEW grants, return an empty array [].

IMPORTANT:
- Only include grants you are confident about
- Do not make up or hallucinate funders
- Focus on {region} region grants
- Exclude any funders already in our database`;

export async function POST(request: NextRequest) {
  try {
    const originError = rejectIfCrossOrigin(request);
    if (originError) return originError;

    const session = await getServerSession();

    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const ip = getClientIp(request);
    const ipLimit = checkRateLimit(`grant-discover:ip:${ip}`, {
      max: 12,
      windowMs: 10 * 60 * 1000,
    });
    const userLimit = checkRateLimit(`grant-discover:user:${session.id}`, {
      max: 8,
      windowMs: 10 * 60 * 1000,
    });
    if (!ipLimit.allowed || !userLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many discovery requests. Please try again later.' },
        { status: 429 }
      );
    }

    const RequestSchema = z.object({
      query: z.string().trim().min(3).max(300),
      region: z.string().trim().min(2).max(120).optional(),
    });
    const body = await request.json();
    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid discovery request payload' },
        { status: 400 }
      );
    }
    const { query, region } = parsed.data;

    // Check if Anthropic API is configured
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'sk-ant-...') {
      return NextResponse.json(
        { error: 'Please configure a valid ANTHROPIC_API_KEY in your .env.local file to use grant discovery' },
        { status: 500 }
      );
    }

    // Get existing funder names to avoid duplicates
    const existingFunders = grants.map(g => g.funder_name).join('\n- ');

    // Create search record
    const searchRecord = await prisma.grantSearch.create({
      data: {
        query,
        region: region || 'All Africa',
        resultsCount: 0,
        status: 'running',
        triggeredBy: session.id,
      },
    });

    // Call Claude to discover grants
    const client = new Anthropic();

    const prompt = DISCOVERY_PROMPT
      .replace('{existing_funders}', existingFunders)
      .replace('{search_query}', query)
      .replace('{region}', region || 'All Africa')
      .replace('{region}', region || 'All Africa');

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Parse the response
    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Extract JSON from response
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
      // Try to find JSON array in response
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const rawGrants = JSON.parse(jsonMatch[0]);
        // Normalize field names (handle snake_case, camelCase, and various formats)
        discoveredGrants = rawGrants.map((g: Record<string, unknown>) => ({
          funderName: g.funderName || g.funder_name || g.name || g.funder || 'Unknown Funder',
          programName: g.programName || g.program_name || g.program,
          instrumentType: g.instrumentType || g.instrument_type || g.type,
          geographicFocus: g.geographicFocus || g.geographic_focus || g.geography || g.region,
          thematicFocus: g.thematicFocus || g.thematic_focus || g.focus || g.sector,
          grantSizeMin: g.grantSizeMin || g.grant_size_min || g.minAmount || g.min_amount,
          grantSizeMax: g.grantSizeMax || g.grant_size_max || g.maxAmount || g.max_amount,
          description: g.description || g.desc || g.summary || 'No description provided',
          website: g.website || g.url || g.link,
          confidence: g.confidence || g.confidenceLevel || 'low',
        }));
      }
    } catch (parseError) {
      console.error('Failed to parse Claude response:', parseError);
    }

    // Save discovered grants to database
    const savedGrants = await Promise.all(
      discoveredGrants.map(async (grant) => {
        // Check if this funder already exists (case-insensitive)
        const existingDiscovery = await prisma.discoveredGrant.findFirst({
          where: {
            funderName: {
              equals: grant.funderName,
            },
            status: { not: 'rejected' },
          },
        });

        if (existingDiscovery) {
          return null; // Skip duplicates
        }

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
            discoveredBy: 'auto_search',
            searchQuery: query,
            confidence: grant.confidence === 'high' ? 0.9 : grant.confidence === 'medium' ? 0.7 : 0.5,
            status: 'pending',
          },
        });
      })
    );

    const newGrants = savedGrants.filter(Boolean);

    // Update search record
    await prisma.grantSearch.update({
      where: { id: searchRecord.id },
      data: {
        resultsCount: newGrants.length,
        status: 'completed',
      },
    });

    return NextResponse.json({
      searchId: searchRecord.id,
      query,
      region: region || 'All Africa',
      discoveredCount: newGrants.length,
      grants: newGrants,
    });
  } catch (error) {
    console.error('Grant discovery error:', error);

    // Provide more specific error messages
    let errorMessage = 'Failed to discover grants';
    if (error instanceof Error) {
      if (error.message.includes('401') || error.message.includes('authentication')) {
        errorMessage = 'Invalid API key. Please check your ANTHROPIC_API_KEY in .env.local';
      } else if (error.message.includes('rate') || error.message.includes('429')) {
        errorMessage = 'Rate limited. Please wait a moment and try again.';
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your internet connection.';
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// GET - Get search history
export async function GET() {
  try {
    const session = await getServerSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const searches = await prisma.grantSearch.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({ searches });
  } catch (error) {
    console.error('Error fetching search history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch search history' },
      { status: 500 }
    );
  }
}
