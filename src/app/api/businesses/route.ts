import { NextResponse } from 'next/server'
import { dbConfigured } from '@/lib/db'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 30
export const preferredRegion = ['fra1', 'arn1', 'cdg1']
import { query } from '@/lib/db'
import { csvCache } from '@/lib/csv-cache'
import { apiCache } from '@/lib/api-cache'

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
	
	// Sorting
	const sortBy = searchParams.get('sortBy')?.trim() || 'updatedAt'
	const allowedSorts = ['updatedAt', 'allvitrScore', 'allvitrScoreAsc', 'name', 'revenue', 'employees']
	const validSortBy = allowedSorts.includes(sortBy) ? sortBy : 'updatedAt'
	
	const isCsvSource = source === 'accounting' || source === 'consulting'
	
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

	// Create cache key from request parameters
	const cacheParams = {
		source,
		offset,
		skipCount,
		countOnly,
		industries: industries.sort(), // Sort for consistent cache keys
		revenueRange,
		recommendation,
		scoreRange,
		sortBy: validSortBy
	}
	
	// Check cache first (skip cache for CSV sources with offset > 0 for now)
	const shouldCache = !isCsvSource || offset === 0
	if (shouldCache) {
		const cached = apiCache.get<{ items: Record<string, unknown>[]; total: number }>(cacheParams)
		if (cached) {
			return NextResponse.json(cached)
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
	// For CSV sources, exclude recommendation and score params since filtering happens after CSV merging
	const params = [
		...industryParams, 
		...revenueParams, 
		...(isCsvSource ? [] : recommendationParams), 
		...(isCsvSource ? [] : scoreParams)
	]
	
	// Update clause placeholders with actual parameter positions
	if (revenueClause) {
		const revenueStartIndex = industryParams.length + 1
		revenueClause = revenueClause
			.replace('$REVENUE_MIN', `$${revenueStartIndex}`)
			.replace('$REVENUE_MAX', `$${revenueStartIndex + 1}`)
	}
	
	if (recommendationClause && !isCsvSource) {
		const recommendationIndex = industryParams.length + revenueParams.length + 1
		recommendationClause = recommendationClause.replace('$RECOMMENDATION', `$${recommendationIndex}`)
	}
	
	if (scoreClause && !isCsvSource) {
		const scoreStartIndex = industryParams.length + revenueParams.length + recommendationParams.length + 1
		scoreClause = scoreClause
			.replace('$SCORE_MIN', `$${scoreStartIndex}`)
			.replace('$SCORE_MAX', `$${scoreStartIndex + 1}`)
	}

	// Optimized query structure - avoid CTE when possible
	// For CSV sources, skip recommendation and score filtering in DB since CSV data overrides these fields
	const baseWhere = `
		WHERE (COALESCE(b."registeredInForetaksregisteret", false) = true 
			   OR b."orgFormCode" IN ('AS','ASA','ENK','ANS','DA','NUF','SA','SAS','A/S','A/S/ASA'))
		${industryClause}
		${isCsvSource ? '' : recommendationClause}
		${isCsvSource ? '' : scoreClause}
	`
	
	// Only use CTE for financial data when revenue filtering is needed
	const baseCte = revenueClause ? `
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
			${baseWhere}
			${revenueClause}
		)
	` : `
		WITH businesses AS (
			SELECT 
				b.*,
				NULL::int as "fiscalYear",
				NULL::bigint as revenue,
				NULL::bigint as profit,
				NULL::bigint as "totalAssets",
				NULL::bigint as equity,
				NULL::int as "employeesAvg"
			FROM "Business" b
			${baseWhere}
		)
	`

	const itemsSql = `
		${baseCte},
		latest_ceo AS (
			SELECT DISTINCT ON (c."businessId")
				c."businessId",
				c."fullName"
			FROM "CEO" c
			ORDER BY c."businessId", c."fromDate" DESC NULLS LAST
		)
		SELECT
			b."orgNumber" as "orgNumber",
			b.name as "name",
			b.website as "website",
			b.employees as "employees",
			b."addressStreet" as "addressStreet",
			b."addressPostalCode" as "addressPostalCode",
			b."addressCity" as "addressCity",
			lc."fullName" as "ceo",
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
		LEFT JOIN latest_ceo lc ON lc."businessId" = b.id
		ORDER BY ${(() => {
			switch (validSortBy) {
				case 'allvitrScore':
					return 'b."allvitrScore" DESC NULLS LAST'
				case 'allvitrScoreAsc':
					return 'b."allvitrScore" ASC NULLS LAST'
				case 'name':
					return 'b.name ASC'
				case 'revenue':
					return 'b.revenue DESC NULLS LAST'
				case 'employees':
					return 'b.employees DESC NULLS LAST'
				default:
					return 'b."updatedAt" DESC'
			}
		})()}
		${isCsvSource ? '' : `LIMIT 100 OFFSET ${offset}`}
	`

	const countSql = `
		${baseCte}
		SELECT COUNT(*)::int as total FROM businesses
	`
	let itemsRes: { rows: Record<string, unknown>[] } = { rows: [] }
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

	// CSV-based source filtering using cached data

	let filteredItems = itemsRes.rows as Record<string, unknown>[]
	if (isCsvSource) {
		const csvData = csvCache.getCsvData(source as 'accounting' | 'consulting')
		filteredItems = filteredItems.filter((row) => csvData.set.has(String(row.orgNumber)))
		// Merge CSV recommendation, rationale, and score, overriding DB values when CSV has them
		filteredItems = filteredItems.map((row) => {
			const org = String(row.orgNumber)
			const csvInfo = csvData.map.get(org)
			if (!csvInfo) return row
			const next = { ...row }
			if (csvInfo.recommendation && csvInfo.recommendation.trim()) next.recommendation = csvInfo.recommendation
			if (csvInfo.rationale && csvInfo.rationale.trim()) next.rationale = csvInfo.rationale
			if (csvInfo.allvitrScore != null) next.allvitrScore = csvInfo.allvitrScore
			return next
		})
		
		// Apply recommendation filter after CSV data merging (since CSV overrides DB recommendation)
		if (recommendation) {
			filteredItems = filteredItems.filter((row) => String(row.recommendation) === recommendation)
		}
		
		// Apply score range filter after CSV data merging (since CSV overrides DB score)
		if (scoreRange) {
			filteredItems = filteredItems.filter((row) => {
				const score = Number(row.allvitrScore)
				if (isNaN(score)) return false
				
				switch (scoreRange) {
					case '0-50':
						return score >= 0 && score < 50
					case '50-100':
						return score >= 50 && score < 100
					case '100-200':
						return score >= 100 && score < 200
					case '200+':
						return score >= 200
					default:
						return true
				}
			})
		}
	}

	// Apply pagination for CSV sources at response level; general uses SQL LIMIT/OFFSET
	if (countOnly) {
		const responseTotal = isCsvSource ? filteredItems.length : total
		const countResponse = { items: [], total: responseTotal }
		
		// Cache count-only responses
		if (shouldCache) {
			apiCache.set(cacheParams, countResponse, 30 * 1000) // 30s cache for counts
		}
		
		return NextResponse.json(countResponse)
	}

	const responseItems = isCsvSource ? filteredItems.slice(offset, offset + 100) : filteredItems
	const responseTotal = isCsvSource ? filteredItems.length : total
	
	const response = { items: responseItems, total: responseTotal }
	
	// Cache the response for future requests
	if (shouldCache) {
		// Use shorter TTL for CSV sources since they have dynamic filtering
		const cacheTtl = isCsvSource ? 30 * 1000 : 2 * 60 * 1000 // 30s vs 2min
		apiCache.set(cacheParams, response, cacheTtl)
	}
	
	return NextResponse.json(response)
}