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
	
	// Debug: Log all requests with their parameters
	const sortByParam = searchParams.get('sortBy')?.trim() || 'updatedAt'
	console.log(`[businesses] REQUEST: source=${source}, sortBy=${sortByParam}, URL=${req.url}`)

	// Revenue filtering
	const revenueRange = searchParams.get('revenueRange')?.trim()
	let revenueClause = ''
	let revenueParams: number[] = []
	
	if (revenueRange) {
		switch (revenueRange) {
			case '0-1M':
				revenueClause = 'AND f.revenue >= $REVENUE_MIN AND f.revenue < $REVENUE_MAX'
				revenueParams = [0, 1000000]
				break
			case '1M-10M':
				revenueClause = 'AND f.revenue >= $REVENUE_MIN AND f.revenue < $REVENUE_MAX'
				revenueParams = [1000000, 10000000]
				break
			case '10M-100M':
				revenueClause = 'AND f.revenue >= $REVENUE_MIN AND f.revenue < $REVENUE_MAX'
				revenueParams = [10000000, 100000000]
				break
			case '100M+':
				revenueClause = 'AND f.revenue >= $REVENUE_MIN'
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
	// Also skip cache when sorting by score to ensure fresh results with score filtering
	const shouldCache = (!isCsvSource || offset === 0) && !validSortBy.includes('allvitrScore')
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

	// For CSV sources, pre-filter by organization numbers to reduce query size
	let csvOrgNumbersClause = ''
	let csvOrgNumbersParams: string[] = []
	if (isCsvSource) {
		const csvData = csvCache.getCsvData(source as 'accounting' | 'consulting')
		const orgNumbers = Array.from(csvData.set)
		
		if (orgNumbers.length > 0) {
			// Use batched IN clause for better performance - calculate correct parameter indices
			const baseParamsCount = industryParams.length + revenueParams.length + 
				(isCsvSource ? 0 : recommendationParams.length) + 
				(isCsvSource ? 0 : scoreParams.length)
			const placeholders = orgNumbers.map((_, i) => `$${baseParamsCount + i + 1}`).join(', ')
			csvOrgNumbersClause = `AND b."orgNumber" IN (${placeholders})`
			csvOrgNumbersParams = orgNumbers
		}
	}

	// Combine all params - industries first, then revenue, recommendation, score, and CSV org numbers
	// For CSV sources, exclude recommendation and score params since filtering happens after CSV merging
	const params = [
		...industryParams, 
		...revenueParams, 
		...(isCsvSource ? [] : recommendationParams), 
		...(isCsvSource ? [] : scoreParams),
		...csvOrgNumbersParams
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

	// Add score filtering when sorting by score (only show businesses with actual scores, including 0 and negative)
	let scoreFilterClause = ''
	if (!isCsvSource && validSortBy.includes('allvitrScore')) {
		scoreFilterClause = 'AND b."allvitrScore" IS NOT NULL'
	}

	// Optimized query structure - simplify expensive WHERE conditions
	// For CSV sources, skip recommendation and score filtering in DB since CSV data overrides these fields
	const hasActiveFilters = hasIndustries || revenueClause || (!isCsvSource && (recommendationClause || scoreClause))
	const baseWhere = `
		WHERE (b."registeredInForetaksregisteret" = true OR b."orgFormCode" IN ('AS','ASA','ENK','ANS','DA','NUF','SA','SAS','A/S','A/S/ASA'))
		${industryClause}
		${isCsvSource ? '' : recommendationClause}
		${isCsvSource ? '' : scoreClause}
		${csvOrgNumbersClause}
		${scoreFilterClause}
	`
	
	// Much simpler approach - avoid CTEs entirely when possible
	let itemsSqlDirect = ''
	if (revenueClause) {
		// Optimized revenue filtering using correlated subquery instead of CTE
		itemsSqlDirect = `
			SELECT
				b."orgNumber",
				b.name,
				b.website,
				b.employees,
				b."addressStreet",
				b."addressPostalCode",
				b."addressCity",
				${isCsvSource ? 'NULL' : 
					`(SELECT c."fullName" 
					 FROM "CEO" c 
					 WHERE c."businessId" = b.id 
					 ORDER BY c."fromDate" DESC NULLS LAST 
					 LIMIT 1)`} as "ceo",
				b."industryCode1",
				b."industryText1",
				b."industryCode2",
				b."industryText2",
				b."industryCode3",
				b."industryText3",
				b."vatRegistered",
				b."vatRegisteredDate",
				b."sectorCode",
				b."sectorText",
				b."orgFormCode",
				b."orgFormText",
				b."registeredInForetaksregisteret",
				b."isBankrupt",
				b."isUnderLiquidation",
				b."isUnderCompulsory",
				b."createdAt",
				b."updatedAt",
				b.recommendation,
				b.rationale,
				b."allvitrScore",
				(SELECT f."fiscalYear" 
				 FROM "FinancialReport" f 
				 WHERE f."businessId" = b.id 
				 ORDER BY f."fiscalYear" DESC 
				 LIMIT 1) as "fiscalYear",
				(SELECT f.revenue 
				 FROM "FinancialReport" f 
				 WHERE f."businessId" = b.id 
				 ORDER BY f."fiscalYear" DESC 
				 LIMIT 1) as revenue,
				(SELECT f.profit 
				 FROM "FinancialReport" f 
				 WHERE f."businessId" = b.id 
				 ORDER BY f."fiscalYear" DESC 
				 LIMIT 1) as profit,
				(SELECT f."totalAssets" 
				 FROM "FinancialReport" f 
				 WHERE f."businessId" = b.id 
				 ORDER BY f."fiscalYear" DESC 
				 LIMIT 1) as "totalAssets",
				(SELECT f.equity 
				 FROM "FinancialReport" f 
				 WHERE f."businessId" = b.id 
				 ORDER BY f."fiscalYear" DESC 
				 LIMIT 1) as equity,
				(SELECT f."employeesAvg" 
				 FROM "FinancialReport" f 
				 WHERE f."businessId" = b.id 
				 ORDER BY f."fiscalYear" DESC 
				 LIMIT 1) as "employeesAvg"
			FROM "Business" b
			WHERE (b."registeredInForetaksregisteret" = true OR b."orgFormCode" IN ('AS','ASA','ENK','ANS','DA','NUF','SA','SAS','A/S','A/S/ASA'))
			${industryClause}
			${isCsvSource ? '' : recommendationClause}
			${isCsvSource ? '' : scoreClause}
			${csvOrgNumbersClause}
			${scoreFilterClause}
			AND EXISTS (
				SELECT 1 FROM "FinancialReport" f 
				WHERE f."businessId" = b.id 
				${revenueClause.replace(/f\./g, 'f.')}
			)
			${isCsvSource ? '' : `ORDER BY ${(() => {
				switch (validSortBy) {
					case 'allvitrScore':
						return 'b."allvitrScore" DESC, b."updatedAt" DESC'
					case 'allvitrScoreAsc':
						return 'b."allvitrScore" ASC, b."updatedAt" DESC'
					case 'name':
						return 'b.name ASC'
					case 'revenue':
						return '(SELECT f.revenue FROM "FinancialReport" f WHERE f."businessId" = b.id ORDER BY f."fiscalYear" DESC LIMIT 1) DESC NULLS LAST'
					case 'employees':
						return 'b.employees DESC NULLS LAST'
					default:
						return 'b."updatedAt" DESC'
				}
			})()}`}
			${isCsvSource ? '' : `LIMIT 100 OFFSET ${offset}`}
		`
	} else {
		// Direct query without CTE for better performance
		itemsSqlDirect = `
			SELECT
				b."orgNumber",
				b.name,
				b.website,
				b.employees,
				b."addressStreet",
				b."addressPostalCode",
				b."addressCity",
				${isCsvSource ? 'NULL' : 
					`(SELECT c."fullName" 
					 FROM "CEO" c 
					 WHERE c."businessId" = b.id 
					 ORDER BY c."fromDate" DESC NULLS LAST 
					 LIMIT 1)`} as "ceo",
				b."industryCode1",
				b."industryText1",
				b."industryCode2",
				b."industryText2",
				b."industryCode3",
				b."industryText3",
				b."vatRegistered",
				b."vatRegisteredDate",
				b."sectorCode",
				b."sectorText",
				b."orgFormCode",
				b."orgFormText",
				b."registeredInForetaksregisteret",
				b."isBankrupt",
				b."isUnderLiquidation",
				b."isUnderCompulsory",
				b."createdAt",
				b."updatedAt",
				b.recommendation,
				b.rationale,
				b."allvitrScore",
				NULL::int as "fiscalYear",
				NULL::bigint as revenue,
				NULL::bigint as profit,
				NULL::bigint as "totalAssets",
				NULL::bigint as equity,
				NULL::int as "employeesAvg"
			FROM "Business" b
			${baseWhere}
			${isCsvSource ? '' : `ORDER BY ${(() => {
				switch (validSortBy) {
					case 'allvitrScore':
						return 'b."allvitrScore" DESC, b."updatedAt" DESC'
					case 'allvitrScoreAsc':
						return 'b."allvitrScore" ASC, b."updatedAt" DESC'
					case 'name':
						return 'b.name ASC'
					case 'revenue':
						return 'b."updatedAt" DESC' // fallback since no revenue data
					case 'employees':
						return 'b.employees DESC NULLS LAST'
					default:
						return 'b."updatedAt" DESC'
				}
			})()}`}
			${isCsvSource ? '' : `LIMIT 100 OFFSET ${offset}`}
		`
	}

	const itemsSql = itemsSqlDirect

	const countSql = revenueClause ? `
		SELECT COUNT(*)::int as total 
		FROM "Business" b
		WHERE (b."registeredInForetaksregisteret" = true OR b."orgFormCode" IN ('AS','ASA','ENK','ANS','DA','NUF','SA','SAS','A/S','A/S/ASA'))
		${industryClause}
		${isCsvSource ? '' : recommendationClause}
		${isCsvSource ? '' : scoreClause}
		${csvOrgNumbersClause}
		${scoreFilterClause}
		AND EXISTS (
			SELECT 1 FROM "FinancialReport" f 
			WHERE f."businessId" = b.id 
			${revenueClause.replace(/f\./g, 'f.')}
		)
	` : `
		SELECT COUNT(*)::int as total 
		FROM "Business" b
		${baseWhere}
	`
	let itemsRes: { rows: Record<string, unknown>[] } = { rows: [] }
	let total = 0

	if (countOnly) {
		if (isCsvSource) {
			// Need full item set to compute CSV-based total
			const start = Date.now()
			try {
				itemsRes = await query(itemsSql, params)
				console.log(`[businesses] CSV items query took ${Date.now() - start}ms`)
			} catch (error) {
				console.error(`[businesses] CSV items query failed:`, error)
				console.error(`[businesses] Query was:`, itemsSql)
				console.error(`[businesses] Params:`, params)
				throw error
			}
		} else {
			const start = Date.now()
			try {
				const countRes = await query<{ total: number }>(countSql, params)
				console.log(`[businesses] Count query took ${Date.now() - start}ms`)
				total = countRes.rows?.[0]?.total ?? 0
			} catch (error) {
				console.error(`[businesses] Count query failed:`, error)
				console.error(`[businesses] Count query was:`, countSql)
				console.error(`[businesses] Params:`, params)
				throw error
			}
		}
	} else {
		// Normal item fetch always needed
		const start = Date.now()
		
		// Debug: Log SQL when sorting by score
		if (source === 'general' && validSortBy.includes('allvitrScore')) {
			console.log(`[businesses] Executing score sort query:`, itemsSql.substring(0, 500) + '...')
			console.log(`[businesses] Params:`, params)
			console.log(`[businesses] scoreFilterClause:`, scoreFilterClause)
			console.log(`[businesses] revenueClause:`, revenueClause)
			console.log(`[businesses] baseWhere:`, baseWhere)
			console.log(`[businesses] Full query contains scoreFilter:`, itemsSql.includes('IS NOT NULL'))
		}
		
		try {
			itemsRes = await query(itemsSql, params)
			console.log(`[businesses] Items query took ${Date.now() - start}ms (revenue: ${!!revenueClause}) - ${itemsRes.rows.length} rows returned for sortBy=${validSortBy}, source=${source}`)
	
	// Debug: Always log when sortBy includes allvitrScore 
	if (validSortBy.includes('allvitrScore')) {
		console.log(`[businesses] SCORE SORTING DEBUG: sortBy=${validSortBy}, source=${source}, rows=${itemsRes.rows.length}`)
	}
		
		// Debug: Log score distribution for general source when sorting by score
		if (source === 'general' && validSortBy.includes('allvitrScore')) {
			const withPositiveScores = itemsRes.rows.filter(row => row.allvitrScore && Number(row.allvitrScore) > 0).length
			const withZeroScores = itemsRes.rows.filter(row => row.allvitrScore !== null && Number(row.allvitrScore) === 0).length
			const withNegativeScores = itemsRes.rows.filter(row => row.allvitrScore && Number(row.allvitrScore) < 0).length
			const nullScores = itemsRes.rows.filter(row => row.allvitrScore === null || row.allvitrScore === undefined).length
			console.log(`[businesses] Score distribution: ${withPositiveScores} positive, ${withZeroScores} zero, ${withNegativeScores} negative, ${nullScores} NULL scores`)
			
			// Log first few scores to see what we're getting
			const firstFewScores = itemsRes.rows.slice(0, 5).map(row => ({ name: row.name, score: row.allvitrScore }))
			console.log(`[businesses] First few results:`, firstFewScores)
		}
	} catch (error) {
			console.error(`[businesses] Items query failed:`, error)
			console.error(`[businesses] Query was:`, itemsSql)
			console.error(`[businesses] Params:`, params)
			throw error
		}
		if (!skipCount) {
			const countStart = Date.now()
			try {
				const countRes = await query<{ total: number }>(countSql, params)
				console.log(`[businesses] Count query took ${Date.now() - countStart}ms`)
				total = countRes.rows?.[0]?.total ?? 0
			} catch (error) {
				console.error(`[businesses] Count query failed:`, error)
				console.error(`[businesses] Count query was:`, countSql)
				console.error(`[businesses] Params:`, params)
				throw error
			}
		}
	}

	// CSV-based source filtering using cached data

	let filteredItems = itemsRes.rows as Record<string, unknown>[]
	if (isCsvSource) {
		const csvData = csvCache.getCsvData(source as 'accounting' | 'consulting')
		
		// No need to filter by orgNumber anymore since we filter at DB level
		// filteredItems already contains only CSV organizations
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

	// Apply sorting for CSV sources after filtering (since CSV data overrides sort fields)
	if (isCsvSource && filteredItems.length > 0) {
		console.log(`[businesses] Sorting ${filteredItems.length} CSV items by ${validSortBy}`)
		filteredItems.sort((a, b) => {
			switch (validSortBy) {
				case 'allvitrScore': {
					const scoreA = Number(a.allvitrScore) || 0
					const scoreB = Number(b.allvitrScore) || 0
					// Prioritize items with actual scores over 0
					if (scoreA > 0 && scoreB === 0) return -1
					if (scoreB > 0 && scoreA === 0) return 1
					return scoreB - scoreA
				}
				case 'allvitrScoreAsc': {
					const scoreA = Number(a.allvitrScore) || 0
					const scoreB = Number(b.allvitrScore) || 0
					// Prioritize items with actual scores over 0
					if (scoreA > 0 && scoreB === 0) return -1
					if (scoreB > 0 && scoreA === 0) return 1
					return scoreA - scoreB
				}
				case 'name':
					return String(a.name || '').localeCompare(String(b.name || ''))
				case 'revenue':
					return (Number(b.revenue) || 0) - (Number(a.revenue) || 0)
				case 'employees':
					return (Number(b.employees) || 0) - (Number(a.employees) || 0)
				default:
					// Sort by updatedAt - assume it's a string timestamp
					return String(b.updatedAt || '').localeCompare(String(a.updatedAt || ''))
			}
		})
		
		if (validSortBy.includes('allvitrScore')) {
			const withScores = filteredItems.filter(item => Number(item.allvitrScore) > 0).length
			console.log(`[businesses] After score sorting: ${withScores} items have scores > 0`)
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