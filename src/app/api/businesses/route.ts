import { NextResponse } from 'next/server'
import { dbConfigured } from '@/lib/db'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
import { query } from '@/lib/db'

export async function GET(req: Request) {
  if (!dbConfigured) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }
	const { searchParams } = new URL(req.url)
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

	const hasIndustries = industries.length > 0
	const industryParams = industries.map((v) => `%${v}%`)
	const perColumnClause = (col: string) =>
		industries.length > 0 ? industries.map((_, i) => `${col} ILIKE $${i + 1}`).join(' OR ') : ''
	const industryClause = hasIndustries
		? `AND ((${perColumnClause('b."industryCode1"')} ) OR (${perColumnClause('b."industryText1"')}) OR (${perColumnClause('b."industryCode2"')}) OR (${perColumnClause('b."industryText2"')}) OR (${perColumnClause('b."industryCode3"')}) OR (${perColumnClause('b."industryText3"')}))`
		: ''

	// Combine all params - industries first, then revenue params
	const params = [...industryParams, ...revenueParams]
	
	// Update revenue clause placeholders with actual parameter positions
	if (revenueClause) {
		const revenueStartIndex = industryParams.length + 1
		revenueClause = revenueClause
			.replace('$REVENUE_MIN', `$${revenueStartIndex}`)
			.replace('$REVENUE_MAX', `$${revenueStartIndex + 1}`)
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
		)
	`

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
			b."employeesAvg" as "employeesAvg"
		FROM businesses b
		ORDER BY b."updatedAt" DESC
		LIMIT 100
	`

	const countSql = `
		${baseCte}
		SELECT COUNT(*)::int as total FROM businesses
	`
	const [itemsRes, countRes] = await Promise.all([
		query(itemsSql, params),
		query<{ total: number }>(countSql, params),
	])
	const total = countRes.rows?.[0]?.total ?? 0
	return NextResponse.json({ items: itemsRes.rows, total })
}
