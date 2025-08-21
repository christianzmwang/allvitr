import { NextResponse } from 'next/server'
import { dbConfigured } from '@/lib/db'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 30
export const preferredRegion = ['fra1', 'arn1', 'cdg1']
import { query } from '@/lib/db'
import * as fs from 'fs'

export async function GET(req: Request) {
  if (!dbConfigured) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }
	const { searchParams } = new URL(req.url)
	const source = (searchParams.get('source')?.trim() || 'general').toLowerCase()
	const offset = Math.max(0, parseInt(searchParams.get('offset') || '0', 10) || 0)
	const skipCount = ['1','true'].includes((searchParams.get('skipCount') || '').toLowerCase())
	const countOnly = ['1','true'].includes((searchParams.get('countOnly') || '').toLowerCase())
	const singleIndustry = searchParams.get('industry')?.trim() || ''
	const industries = [
		...searchParams.getAll('industries').map((s) => s.trim()).filter(Boolean),
		singleIndustry || undefined,
	].filter(Boolean) as string[]

	// Revenue filtering
	const revenueRange = searchParams.get('revenueRange')?.trim()
	let revenueClause = ''
	let revenueParams: number[] = []
	
	if (revenueRange) {
		switch (revenueRange) {
			case '0-1M':
				revenueClause = 'AND lf.revenue >= $REVENUE_MIN AND lf.revenue < $REVENUE_MAX'
				revenueParams = [0, 1000000]
				break
			case '1M-10M':
				revenueClause = 'AND lf.revenue >= $REVENUE_MIN AND lf.revenue < $REVENUE_MAX'
				revenueParams = [1000000, 10000000]
				break
			case '10M-100M':
				revenueClause = 'AND lf.revenue >= $REVENUE_MIN AND lf.revenue < $REVENUE_MAX'
				revenueParams = [10000000, 100000000]
				break
			case '100M+':
				revenueClause = 'AND lf.revenue >= $REVENUE_MIN'
				revenueParams = [100000000]
				break
		}
	}

	// Recommendation filtering
	const recommendation = searchParams.get('recommendation')?.trim()
	let recommendationClause = ''
	let recommendationParams: string[] = []
	
	if (recommendation) {
		recommendationClause = 'AND b.recommendation = $RECOMMENDATION'
		recommendationParams = [recommendation]
	}

	// Score range filtering
	const scoreRange = searchParams.get('scoreRange')?.trim()
	let scoreClause = ''
	let scoreParams: number[] = []
	
	if (scoreRange) {
		switch (scoreRange) {
			case '0-50':
				scoreClause = 'AND b."allvitrScore" >= $SCORE_MIN AND b."allvitrScore" < $SCORE_MAX'
				scoreParams = [0, 50]
				break
			case '50-100':
				scoreClause = 'AND b."allvitrScore" >= $SCORE_MIN AND b."allvitrScore" < $SCORE_MAX'
				scoreParams = [50, 100]
				break
			case '100-200':
				scoreClause = 'AND b."allvitrScore" >= $SCORE_MIN AND b."allvitrScore" < $SCORE_MAX'
				scoreParams = [100, 200]
				break
			case '200+':
				scoreClause = 'AND b."allvitrScore" >= $SCORE_MIN'
				scoreParams = [200]
				break
		}
	}

	const hasIndustries = industries.length > 0
	const industryParams = industries.map((v) => `%${v}%`)
	const perColumnClause = (col: string) =>
		industries.length > 0 ? industries.map((_, i) => `${col} ILIKE $${i + 1}`).join(' OR ') : ''
	const industryClause = hasIndustries
		? `AND ((${perColumnClause('b."industryCode1"')} ) OR (${perColumnClause('b."industryText1"')}) OR (${perColumnClause('b."industryCode2"')}) OR (${perColumnClause('b."industryText2"')}) OR (${perColumnClause('b."industryCode3"')}) OR (${perColumnClause('b."industryText3"')}))`
		: ''

	// Combine all params - industries first, then revenue, recommendation, and score params
	const params = [...industryParams, ...revenueParams, ...recommendationParams, ...scoreParams]
	
	// Update clause placeholders with actual parameter positions
	if (revenueClause) {
		const revenueStartIndex = industryParams.length + 1
		revenueClause = revenueClause
			.replace('$REVENUE_MIN', `$${revenueStartIndex}`)
			.replace('$REVENUE_MAX', `$${revenueStartIndex + 1}`)
	}
	
	if (recommendationClause) {
		const recommendationIndex = industryParams.length + revenueParams.length + 1
		recommendationClause = recommendationClause.replace('$RECOMMENDATION', `$${recommendationIndex}`)
	}
	
	if (scoreClause) {
		const scoreStartIndex = industryParams.length + revenueParams.length + recommendationParams.length + 1
		scoreClause = scoreClause
			.replace('$SCORE_MIN', `$${scoreStartIndex}`)
			.replace('$SCORE_MAX', `$${scoreStartIndex + 1}`)
	}

	const baseCte = `
		WITH latest_fin AS (
			SELECT DISTINCT ON (f."businessId")
				f."businessId",
				f."fiscalYear",
				f.revenue,
				f.profit,
				f."totalAssets",
				f.equity,
				f."employeesAvg"
			FROM "FinancialReport" f
			ORDER BY f."businessId", f."fiscalYear" DESC
		),
		businesses AS (
			SELECT 
				b.*,
				lf."fiscalYear",
				lf.revenue,
				lf.profit,
				lf."totalAssets",
				lf.equity,
				lf."employeesAvg"
			FROM "Business" b
			LEFT JOIN latest_fin lf ON lf."businessId" = b.id
			WHERE
				(COALESCE(b."registeredInForetaksregisteret", false) = true OR b."orgFormCode" IN ('AS','ASA','ENK','ANS','DA','NUF','SA','SAS','A/S','A/S/ASA'))
				${industryClause}
				${revenueClause}
				${recommendationClause}
				${scoreClause}
		)
	`

	const isCsvSource = source === 'accounting' || source === 'consulting'

	const itemsSql = `
		${baseCte}
		SELECT
			b."orgNumber" as "orgNumber",
			b.name as "name",
			b.website as "website",
			b.employees as "employees",
			b."addressStreet" as "addressStreet",
			b."addressPostalCode" as "addressPostalCode",
			b."addressCity" as "addressCity",
			(SELECT c."fullName"
			 FROM "CEO" c
			 WHERE c."businessId" = b.id
			 ORDER BY c."fromDate" DESC NULLS LAST
			 LIMIT 1
			) as "ceo",
			b."industryCode1" as "industryCode1",
			b."industryText1" as "industryText1",
			b."industryCode2" as "industryCode2",
			b."industryText2" as "industryText2",
			b."industryCode3" as "industryCode3",
			b."industryText3" as "industryText3",
			b."vatRegistered" as "vatRegistered",
			b."vatRegisteredDate" as "vatRegisteredDate",
			b."sectorCode" as "sectorCode",
			b."sectorText" as "sectorText",
			b."orgFormCode" as "orgFormCode",
			b."orgFormText" as "orgFormText",
			b."registeredInForetaksregisteret" as "registeredInForetaksregisteret",
			b."fiscalYear" as "fiscalYear",
			b.revenue as "revenue",
			b.profit as "profit",
			b."totalAssets" as "totalAssets",
			b.equity as "equity",
			b."employeesAvg" as "employeesAvg",
			b.recommendation as "recommendation",
			b.rationale as "rationale",
			b."allvitrScore" as "allvitrScore"
		FROM businesses b
		ORDER BY b."updatedAt" DESC
		${isCsvSource ? '' : `LIMIT 100 OFFSET ${offset}`}
	`

	const countSql = `
		${baseCte}
		SELECT COUNT(*)::int as total FROM businesses
	`
	let itemsRes: { rows: any[] } = { rows: [] }
	let total = 0

	if (countOnly) {
		if (isCsvSource) {
			// Need full item set to compute CSV-based total
			itemsRes = await query(itemsSql, params)
		} else {
			const countRes = await query<{ total: number }>(countSql, params)
			total = countRes.rows?.[0]?.total ?? 0
		}
	} else {
		// Normal item fetch always needed
		itemsRes = await query(itemsSql, params)
		if (!skipCount) {
			const countRes = await query<{ total: number }>(countSql, params)
			total = countRes.rows?.[0]?.total ?? 0
		}
	}

	// Optional CSV-based source filtering without touching the database
	const splitCsvLine = (line: string): string[] => {
		const out: string[] = []
		let cur = ''
		let inQuotes = false
		for (let i = 0; i < line.length; i++) {
			const ch = line[i]
			if (ch === '"') {
				if (inQuotes && line[i + 1] === '"') {
					cur += '"'
					i++
				} else {
					inQuotes = !inQuotes
				}
			} else if (ch === ',' && !inQuotes) {
				out.push(cur)
				cur = ''
			} else {
				cur += ch
			}
		}
		out.push(cur)
		return out
	}

	const loadOrgNumbers = (csvAbsPath: string): Set<string> => {
		try {
			const content = fs.readFileSync(csvAbsPath, 'utf8')
			const lines = content.split(/\r?\n/).filter(Boolean)
			if (lines.length === 0) return new Set<string>()
			const header = lines.shift() as string
			const columns = splitCsvLine(header)
			const orgIdx = columns.findIndex((c) => c.trim().toLowerCase() === 'orgnr')
			const set = new Set<string>()
			if (orgIdx === -1) return set
			for (const line of lines) {
				const cols = splitCsvLine(line)
				const org = (cols[orgIdx] || '').trim()
				if (org) set.add(org)
			}
			return set
		} catch {
			return new Set<string>()
		}
	}

	const loadCsvInfo = (csvAbsPath: string): { set: Set<string>; map: Map<string, { recommendation: string | null; rationale: string | null; allvitrScore: number | null }> } => {
		try {
			const content = fs.readFileSync(csvAbsPath, 'utf8')
			const lines = content.split(/\r?\n/).filter(Boolean)
			if (lines.length === 0) return { set: new Set<string>(), map: new Map() }
			const header = lines.shift() as string
			const columns = splitCsvLine(header).map(c => c.trim().toLowerCase())
			const orgIdx = columns.findIndex((c) => c === 'orgnr')
			const recIdx = columns.findIndex((c) => c === 'recommendation')
			const ratIdx = columns.findIndex((c) => c === 'rationale')
			const scoreIdx = columns.findIndex((c) => c === 'allvitr_score')
			const set = new Set<string>()
			const map = new Map<string, { recommendation: string | null; rationale: string | null; allvitrScore: number | null }>()
			if (orgIdx === -1) return { set, map }
			for (const line of lines) {
				const cols = splitCsvLine(line)
				const org = (cols[orgIdx] || '').trim()
				if (!org) continue
				set.add(org)
				const recommendation = recIdx >= 0 ? (cols[recIdx] || '').trim() : ''
				const rationale = ratIdx >= 0 ? (cols[ratIdx] || '').trim() : ''
				const scoreRaw = scoreIdx >= 0 ? (cols[scoreIdx] || '').trim() : ''
				const allvitrScore = scoreRaw ? Number.parseFloat(scoreRaw) : NaN
				map.set(org, {
					recommendation: recommendation || null,
					rationale: rationale || null,
					allvitrScore: Number.isFinite(allvitrScore) ? allvitrScore : null,
				})
			}
			return { set, map }
		} catch {
			return { set: new Set<string>(), map: new Map() }
		}
	}

	let filteredItems = itemsRes.rows as any[]
	if (isCsvSource) {
		const contaPath = process.cwd() + '/public/csv/contaData.csv'
		const konsulentPath = process.cwd() + '/public/csv/konsulentData.csv'
		const info = source === 'accounting' ? loadCsvInfo(contaPath) : loadCsvInfo(konsulentPath)
		filteredItems = filteredItems.filter((row) => info.set.has(String(row.orgNumber)))
		// Merge CSV recommendation, rationale, and score, overriding DB values when CSV has them
		filteredItems = filteredItems.map((row) => {
			const org = String(row.orgNumber)
			const m = info.map.get(org)
			if (!m) return row
			const next = { ...row }
			if (m.recommendation && m.recommendation.trim()) next.recommendation = m.recommendation
			if (m.rationale && m.rationale.trim()) next.rationale = m.rationale
			if (m.allvitrScore != null) next.allvitrScore = m.allvitrScore
			return next
		})
	}

	// Apply pagination for CSV sources at response level; general uses SQL LIMIT/OFFSET
	if (countOnly) {
		const responseTotal = isCsvSource ? filteredItems.length : total
		return NextResponse.json({ items: [], total: responseTotal })
	}

	const responseItems = isCsvSource ? filteredItems.slice(offset, offset + 100) : filteredItems
	const responseTotal = isCsvSource ? filteredItems.length : total
	return NextResponse.json({ items: responseItems, total: responseTotal })
}