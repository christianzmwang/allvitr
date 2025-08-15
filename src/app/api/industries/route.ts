import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim()

  const sql = `
    WITH inds AS (
      SELECT b."industryCode1" AS code, b."industryText1" AS text FROM "Business" b
      UNION ALL
      SELECT b."industryCode2" AS code, b."industryText2" AS text FROM "Business" b
      UNION ALL
      SELECT b."industryCode3" AS code, b."industryText3" AS text FROM "Business" b
    ),
    filtered AS (
      SELECT code, text
      FROM inds
      WHERE (code IS NOT NULL OR text IS NOT NULL)
        AND (
          ($1::text) IS NULL OR (
            COALESCE(code,'') ILIKE ('%' || ($1::text) || '%') OR
            COALESCE(text,'') ILIKE ('%' || ($1::text) || '%')
          )
        )
    )
    SELECT
      code,
      text,
      COUNT(*) AS count,
      MIN(
        CASE
          WHEN ($1::text) IS NULL THEN NULL
          ELSE LEAST(
            NULLIF(POSITION(LOWER($1::text) IN LOWER(COALESCE(code, ''))), 0),
            NULLIF(POSITION(LOWER($1::text) IN LOWER(COALESCE(text, ''))), 0)
          )
        END
      ) AS pos
    FROM filtered
    GROUP BY code, text
    ORDER BY
      CASE
        WHEN ($1::text) IS NULL THEN 1
        WHEN (COALESCE(code,'') ILIKE (($1::text) || '%') OR COALESCE(text,'') ILIKE (($1::text) || '%')) THEN 0
        ELSE 1
      END,
      pos NULLS LAST,
      count DESC NULLS LAST,
      text ASC NULLS LAST
    LIMIT 50
  `

  const params: (string | null)[] = [q || null]
  const { rows } = await query(sql, params)
  return NextResponse.json(rows)
}
