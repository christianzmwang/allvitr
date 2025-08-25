import { NextResponse } from 'next/server'
import { dbConfigured, query } from '@/lib/db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const preferredRegion = ['fra1', 'arn1', 'cdg1']
export const maxDuration = 15

// Shape returned to the client (kept stable for minimal UI churn)
type EventItem = {
  id: string | number
  title: string | null
  description: string | null
  url: string | null
  source: string | null
  date: string | null
  // Raw score for this event from the database (can be null)
  score: number | null
}

// Shape from public.events_public / RPC (snake_case)
type PublicEvent = {
  id: string
  org_number: string
  business_id: string | null
  event_type: string | null
  impact_magnitude: string | null
  certainty: number | null
  date: string | null
  location: string | null
  explanation: string | null
  source_url: string | null
  source_title: string | null
  score: number | null
  created_at: string
}

function mapToClientItem(row: PublicEvent): EventItem {
  return {
    id: row.id,
    // Prefer a human title if available; fall back to event_type
    title: row.source_title || row.event_type || null,
    description: row.explanation,
    url: row.source_url,
    source: row.event_type,
  date: row.date,
  score: row.score,
  }
}

export async function GET(req: Request) {
  if (!dbConfigured) {
    return NextResponse.json({ items: [] })
  }
  const { searchParams } = new URL(req.url)
  const orgNumber = (searchParams.get('orgNumber') || '').trim()
  const eventTypesCsv = (searchParams.get('eventTypes') || '').trim()
  const eventTypes = eventTypesCsv
    ? eventTypesCsv
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : []
  const limit = Math.max(
    1,
    Math.min(50, parseInt(searchParams.get('limit') || '50', 10) || 50),
  )

  try {
    // If orgNumber provided, use RPC first, then view fallback
    if (orgNumber) {
      // Primary: RPC
      const rpc = await query<PublicEvent>(
        `SELECT *
				 FROM public.get_events_by_org($1::text, $2::int)
				 ORDER BY date DESC NULLS LAST, created_at DESC`,
        [orgNumber, limit],
      )
      let rows = rpc.rows

      // Fallback: view (also acts as a secondary source if RPC returns 0)
      if (!rows || rows.length === 0) {
        const view = await query<PublicEvent>(
          `SELECT *
					 FROM public.events_public
					 WHERE org_number = $1
					 ORDER BY date DESC NULLS LAST, created_at DESC
					 LIMIT $2`,
          [orgNumber, limit],
        )
        rows = view.rows
      }

      // Optional in-memory filter by event types when provided
      if (eventTypes.length > 0 && rows && rows.length > 0) {
        rows = rows.filter((r) => !!r.event_type && eventTypes.includes(r.event_type))
      }

      const items: EventItem[] = (rows || []).map(mapToClientItem)
      return NextResponse.json({ items })
    }

    // Without orgNumber: latest events overall from the view
    const view = await query<PublicEvent>(
      `SELECT *
			 FROM public.events_public
			 ORDER BY date DESC NULLS LAST, created_at DESC
			 LIMIT $1`,
      [limit],
    )
    let rows = view.rows
    if (eventTypes.length > 0 && rows && rows.length > 0) {
      rows = rows.filter((r) => !!r.event_type && eventTypes.includes(r.event_type))
    }
    const items: EventItem[] = (rows || []).map(mapToClientItem)
    return NextResponse.json({ items })
  } catch {
    // On any error, return empty list to preserve stability
    return NextResponse.json({ items: [] })
  }
}
