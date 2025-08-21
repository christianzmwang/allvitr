'use client'

import { useEffect, useMemo, useRef, useState, memo, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'

const numberFormatter = new Intl.NumberFormat('no-NO')

function useDebounce<T>(value: T, delay = 100) {
	const [debounced, setDebounced] = useState(value)
	useEffect(() => {
		const t = setTimeout(() => setDebounced(value), delay)
		return () => clearTimeout(t)
	}, [value, delay])
	return debounced
}

type Business = {
	orgNumber: string
	name: string
	website: string | null
	employees: number | null
	addressStreet: string | null
	addressPostalCode: string | null
	addressCity: string | null
	ceo: string | null
	fiscalYear?: number | null
	revenue?: string | number | null
	profit?: string | number | null
	totalAssets?: string | number | null
	equity?: string | number | null
	employeesAvg?: number | null
	industryCode1?: string | null
	industryText1?: string | null
	industryCode2?: string | null
	industryText2?: string | null
	industryCode3?: string | null
	industryText3?: string | null
	vatRegistered?: boolean | null
	vatRegisteredDate?: string | null
	sectorCode?: string | null
	sectorText?: string | null
	// Added: CSV recommendation data
	recommendation?: string | null
	rationale?: string | null
	allvitrScore?: number | null
}

type IndustryOpt = { code: string | null; text: string | null; count: number }

type BusinessesResponse = { items: Business[]; total: number }
type SelectedIndustry = { value: string; label: string }

// Memoized business card component for better performance
const BusinessCard = memo(({ 
	business, 
	numberFormatter, 
	expandedRationalOrgs, 
	setExpandedRationalOrgs 
}: {
	business: Business
	numberFormatter: Intl.NumberFormat
	expandedRationalOrgs: Record<string, boolean>
	setExpandedRationalOrgs: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
}) => {
	const fmt = (v: number | string | null | undefined) => (v === null || v === undefined ? '—' : numberFormatter.format(Number(v)))
	
	return (
		<div className={`border p-6 transition-all hover:shadow-lg ${
			(business.allvitrScore != null) ? 'border-white/10 bg-gray-900 hover:bg-gray-800' :
			business.recommendation === 'Reach out now' ? 'border-green-500 bg-green-900/10 hover:bg-green-900/20' :
			business.recommendation === 'Warm outreach' ? 'border-blue-500 bg-blue-900/10 hover:bg-blue-900/20' :
			business.recommendation === 'Monitor' ? 'border-yellow-500 bg-yellow-900/10 hover:bg-yellow-900/20' :
			'border-white/10 bg-gray-900 hover:bg-gray-800'
		}`}> 
			<div className="flex justify-between items-start mb-4">
				<div className="flex-1">
					<h3 className="text-xl font-semibold mb-2">{business.name}</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
						<div>
							<div className="mb-2"><span className="font-medium">Org:</span> {business.orgNumber}</div>
							<div className="mb-2"><span className="font-medium">CEO:</span> {business.ceo || '—'}</div>
							<div className="mb-2"><span className="font-medium">Employees:</span> {business.employees ?? '—'}</div>
							<div className="mb-2"><span className="font-medium">Revenue:</span> {business.revenue == null ? '—' : `${fmt(business.revenue)}${business.fiscalYear ? ` (FY ${business.fiscalYear})` : ''}`}</div>
						</div>
						<div>
							<div className="mb-2"><span className="font-medium">Address:</span> {[business.addressStreet, business.addressPostalCode, business.addressCity].filter(Boolean).join(', ') || '—'}</div>
							<div className="mb-2"><span className="font-medium">Website:</span> {business.website ? (
								<a className="text-sky-400 underline hover:text-sky-300" href={business.website} target="_blank" rel="noreferrer">
									{business.website}
								</a>
							) : (
								'—'
							)}</div>
							<div className="mb-2"><span className="font-medium">Industry:</span> {business.industryCode1 ? `${business.industryCode1} ${business.industryText1 || ''}`.trim() : '—'}</div>
							<div className="mb-2"><span className="font-medium">Sector:</span> {business.sectorCode ? `${business.sectorCode} ${business.sectorText || ''}`.trim() : '—'}</div>
						</div>
					</div>
				</div>
				<div className="ml-6 flex flex-col items-end gap-3">
					{business.recommendation && (
						<span className={`px-3 py-2 text-sm font-medium ${
							business.recommendation === 'Reach out now' ? 'bg-green-600 text-white' :
							business.recommendation === 'Warm outreach' ? 'bg-blue-600 text-white' :
							business.recommendation === 'Monitor' ? 'bg-yellow-600 text-white' :
							'bg-gray-600 text-white'
						}`}>
							{business.recommendation}
						</span>
					)}
					{(business.allvitrScore != null) && (
						<div className="text-center">
							<div className="text-2xl font-bold text-yellow-400">
								{business.allvitrScore.toFixed(2)}
							</div>
							<div className="text-xs text-yellow-400/70">Hugin Score</div>
						</div>
					)}
				</div>
			</div>
			
			{/* Recommendation Rationale */}
			{business.recommendation && business.rationale && (
				<div className="mt-4 pt-4 border-t border-white/10">
					<div className="text-sm">
						<span className="font-medium text-gray-300 block mb-2">Rationale:</span>
					{(() => {
							const all = (business.rationale || '')
								.split(/\r?\n|;|(?<=\.)\s+/)
								.map(s => s.trim())
								.filter(Boolean)
							const isExpanded = !!expandedRationalOrgs[business.orgNumber]
							const source = isExpanded ? all : all.slice(0, 2)
							const items = source
								.map((line, idx) => {
									let cleaned = String(line).replace(/\(n\/a\)/gi, '').trim()
									let impactDisplay: string | null = null
									let impactRawForRemoval: string | null = null
									let badgeColor = 'bg-gray-600'

									const signed = cleaned.match(/([+-]\s*\d+(?:[.,]\d+)?%?)/)
									if (signed) {
										impactRawForRemoval = signed[1]
										impactDisplay = signed[1].replace(/\s+/g, '')
										badgeColor = impactDisplay.trim().startsWith('-') ? 'bg-red-600' : 'bg-green-600'
									} else {
										const labeled = cleaned.match(/impact\s*direction\s*: ?\s*([+-]?\s*\d+(?:[.,]\d+)?%?)/i)
										if (labeled) {
											impactRawForRemoval = labeled[1]
											const normalized = labeled[1].replace(/\s+/g, '')
											if (/^0([.,]0+)?%?$/.test(normalized)) {
												badgeColor = 'bg-gray-600'
												impactDisplay = '0'
											} else {
												impactDisplay = normalized
												badgeColor = normalized.trim().startsWith('-') ? 'bg-red-600' : 'bg-green-600'
											}
										}
									}

									cleaned = cleaned.replace(/impact\s*direction\s*:?/i, '').trim()
									if (impactRawForRemoval) {
										const esc = impactRawForRemoval.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
										cleaned = cleaned
											.replace(new RegExp(esc), '')
											.replace(/\(\s*\)/g, '')
											.replace(/\s{2,}/g, ' ')
											.trim()
									}

									return { key: idx, text: cleaned, impactDisplay, badgeColor }
								})

							const rendered = items.map((it, i) => {
								const isHalf = !isExpanded && i === 1 && items.length > 1
								return (
									<div key={it.key} className="p-3 bg-gray-800 border border-white/10 whitespace-pre-wrap flex items-start justify-between gap-3">
										<div className="flex-1 overflow-hidden" style={isHalf ? ({ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' } as CSSProperties) : undefined}>{it.text}</div>
										{it.impactDisplay && (
											<span className={`shrink-0 inline-flex items-center justify-center w-16 py-1 text-sm font-semibold ${it.badgeColor} text-white font-mono`}>{it.impactDisplay}</span>
										)}
									</div>
								)
							})

							return (
								<>
									{rendered}
									{all.length > 2 && (
										<button
											onClick={() => setExpandedRationalOrgs(prev => ({ ...prev, [business.orgNumber]: !isExpanded }))}
											className="mt-2 self-start inline-flex items-center gap-2 px-2 py-1 bg-gray-800 border border-white/10 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors text-xs"
										>
											{isExpanded ? '▾ Show less' : '▸ Show all'}
										</button>
									)}
								</>
							)
						})()}
					</div>
				</div>
			)}
		</div>
	)
})

BusinessCard.displayName = 'BusinessCard'

export default function BrregPage() {
	const [data, setData] = useState<Business[]>([])
	const [total, setTotal] = useState<number>(0)
	const [loading, setLoading] = useState(true)
	const [industryQuery, setIndustryQuery] = useState('')
	const [selectedIndustries, setSelectedIndustries] = useState<SelectedIndustry[]>(() => {
		if (typeof window === 'undefined') return []
		const sp = new URLSearchParams(window.location.search)
		const inds = sp.getAll('industries')
		return inds.map(v => ({ value: v, label: v }))
	})
	const [allIndustries, setAllIndustries] = useState<IndustryOpt[]>([])
	const [suggestions, setSuggestions] = useState<IndustryOpt[]>([])
	const [selectedRevenueRange, setSelectedRevenueRange] = useState<string>(() => {
		if (typeof window === 'undefined') return ''
		return new URLSearchParams(window.location.search).get('revenueRange') || ''
	})
	const [selectedRecommendation, setSelectedRecommendation] = useState<string>(() => {
		if (typeof window === 'undefined') return ''
		return new URLSearchParams(window.location.search).get('recommendation') || ''
	})
	const [selectedScoreRange, setSelectedScoreRange] = useState<string>(() => {
		if (typeof window === 'undefined') return ''
		return new URLSearchParams(window.location.search).get('scoreRange') || ''
	})
	const [selectedSource, setSelectedSource] = useState<'general' | 'accounting' | 'consulting'>(() => {
		if (typeof window === 'undefined') return 'general'
		const v = new URLSearchParams(window.location.search).get('source') || 'general'
		return v === 'general' || v === 'accounting' || v === 'consulting' ? v : 'general'
	})
	const [sortBy, setSortBy] = useState<string>(() => {
		if (typeof window === 'undefined') return 'updatedAt'
		const v = new URLSearchParams(window.location.search).get('sortBy') || 'updatedAt'
		const allowed = new Set(['updatedAt', 'allvitrScore', 'allvitrScoreAsc', 'name', 'revenue', 'employees'])
		return allowed.has(v) ? v : 'updatedAt'
	})
	const [offset, setOffset] = useState<number>(0)
	const debouncedIndustry = useDebounce(industryQuery, 100)
	const inputRef = useRef<HTMLInputElement | null>(null)
	const dropdownRef = useRef<HTMLDivElement | null>(null)
	const [dropdownRect, setDropdownRect] = useState<{ top: number; left: number; width: number } | null>(null)
	const [dropdownOpen, setDropdownOpen] = useState(false)
	const [expandedRationalOrgs, setExpandedRationalOrgs] = useState<Record<string, boolean>>({})

	const queryParam = useMemo(() => {
		const sp = new URLSearchParams()
		selectedIndustries.forEach(si => sp.append('industries', si.value))
		if (selectedRevenueRange) {
			sp.append('revenueRange', selectedRevenueRange)
		}
		if (selectedRecommendation) {
			sp.append('recommendation', selectedRecommendation)
		}
		if (selectedScoreRange) {
			sp.append('scoreRange', selectedScoreRange)
		}
		if (selectedSource) {
			sp.append('source', selectedSource)
		}
		if (sortBy) {
			sp.append('sortBy', sortBy)
		}
		if (offset) {
			sp.append('offset', String(offset))
		}
		// On initial industry search changes, show items fast and defer counting
		if (selectedIndustries.length > 0 && offset === 0) {
			sp.append('skipCount', '1')
		}
		return sp.toString() ? `?${sp.toString()}` : ''
	}, [selectedIndustries, selectedRevenueRange, selectedRecommendation, selectedScoreRange, selectedSource, sortBy, offset])

	const addSelectedIndustry = (value: string, label?: string) => {
		const v = value.trim()
		if (!v) return
		setSelectedIndustries(prev => {
			const exists = prev.some(p => p.value.toLowerCase() === v.toLowerCase())
			if (exists) return prev
			return [...prev, { value: v, label: (label ?? v).trim() }]
		})
	}

	const removeSelectedIndustry = (value: string) => {
		setSelectedIndustries(prev => prev.filter(p => p.value.toLowerCase() !== value.toLowerCase()))
	}

	useEffect(() => {
		setLoading(true)
		fetch('/api/businesses' + queryParam)
			.then(r => r.json())
			.then((res: BusinessesResponse | Business[]) => {
				if (Array.isArray(res)) {
					// Legacy shape
					setData(prev => (offset > 0 ? [...prev, ...res] : res))
					setTotal(res.length)
				} else {
					setData(prev => (offset > 0 ? [...prev, ...res.items] : res.items))
					// If server skipped count, keep current total for snappy UI
					if (typeof res.total === 'number' && res.total > 0) setTotal(res.total)
				}
			})
			.finally(() => setLoading(false))
	}, [queryParam, offset])

	// Background count refresh when industries change and we asked server to skip count
	useEffect(() => {
		if (selectedIndustries.length === 0) return
		const sp = new URLSearchParams(queryParam.replace(/^\?/, ''))
		sp.delete('skipCount')
		sp.set('countOnly', '1')
		fetch('/api/businesses?' + sp.toString())
			.then(r => r.json())
			.then((res: { total?: number }) => {
				if (typeof res.total === 'number') setTotal(res.total)
			})
			.catch(() => {})
	}, [queryParam, selectedIndustries.length])

	// Reset pagination when filters or sorting change
	useEffect(() => {
		setOffset(0)
		setData([])
	}, [selectedIndustries, selectedRevenueRange, selectedRecommendation, selectedScoreRange, selectedSource, sortBy])

	// Preload all industries on component mount for fast client-side filtering
	useEffect(() => {
		fetch('/api/industries')
			.then(r => r.json())
			.then((rows: IndustryOpt[]) => {
				setAllIndustries(rows)
				setSuggestions(rows) // Show all initially
			})
			.catch(() => {
				setAllIndustries([])
				setSuggestions([])
			})
	}, [])

	// Client-side filtering for instant results
	const [totalFilteredCount, setTotalFilteredCount] = useState(0)
	
	useEffect(() => {
		if (!debouncedIndustry.trim()) {
			setSuggestions(allIndustries)
			setTotalFilteredCount(allIndustries.length)
			return
		}

		const query = debouncedIndustry.toLowerCase()
		const filtered = allIndustries.filter(industry => {
			const code = (industry.code || '').toLowerCase()
			const text = (industry.text || '').toLowerCase()
			return code.includes(query) || text.includes(query)
		})

		setTotalFilteredCount(filtered.length)

		// Sort by relevance - exact matches first, then starts with, then contains
		filtered.sort((a, b) => {
			const aCode = (a.code || '').toLowerCase()
			const aText = (a.text || '').toLowerCase()
			const bCode = (b.code || '').toLowerCase()
			const bText = (b.text || '').toLowerCase()

			const aExact = aCode === query || aText === query
			const bExact = bCode === query || bText === query
			if (aExact !== bExact) return aExact ? -1 : 1

			const aStarts = aCode.startsWith(query) || aText.startsWith(query)
			const bStarts = bCode.startsWith(query) || bText.startsWith(query)
			if (aStarts !== bStarts) return aStarts ? -1 : 1

			return aCode.localeCompare(bCode)
		})

		setSuggestions(filtered.slice(0, 100)) // Show more options for better UX
	}, [debouncedIndustry, allIndustries])

	// Keep dropdown positioned to the input using a portal so layout below never shifts
	useEffect(() => {
		if (!dropdownOpen) return
		const updateRect = () => {
			const el = inputRef.current
			if (!el) return
			const rect = el.getBoundingClientRect()
			setDropdownRect({ top: rect.bottom + 8, left: rect.left, width: rect.width })
		}
		updateRect()
		window.addEventListener('resize', updateRect)
		window.addEventListener('scroll', updateRect, true)
		return () => {
			window.removeEventListener('resize', updateRect)
			window.removeEventListener('scroll', updateRect, true)
		}
	}, [dropdownOpen])

	// Close on outside click
	useEffect(() => {
		if (!dropdownOpen) return
		const handleDown = (e: MouseEvent) => {
			const input = inputRef.current
			const menu = dropdownRef.current
			const target = e.target as Node
			if (menu && menu.contains(target)) return
			if (input && input.contains(target)) return
			setDropdownOpen(false)
		}
		document.addEventListener('mousedown', handleDown)
		return () => document.removeEventListener('mousedown', handleDown)
	}, [dropdownOpen])

	// Data is now sorted server-side, no need for client-side sorting
	const sortedData = data

	return (
		<div className="min-h-screen bg-black text-white">
			{/* Header */}
			<div className="bg-black border-b border-white/10">
				<div className="py-4 px-6">
					<h1 className="text-xl font-bold">Allvitr / <span className="text-red-600">Hugin</span></h1>
				</div>
			</div>

			<div className="flex">
				{/* Left Sidebar - Recommendation & Score Filters */}
				<div className="w-80 bg-black border-r border-white/10 min-h-screen p-6">
					<div className="sticky top-6">
						<h2 className="text-xl font-semibold mb-6">Parameters</h2>
						{/* Source Filter */}
						<div className="mb-6">
							<label className="block text-sm font-medium mb-2">Industry</label>
							<div className="flex flex-col items-start gap-2">
								<label className={`px-3 py-2 border cursor-pointer ${selectedSource === 'general' ? 'bg-white/10 border-white/40' : 'border-white/10'}`}>
									<input type="radio" name="srcSide" className="sr-only" checked={selectedSource === 'general'} onChange={() => setSelectedSource('general')} />
									<span>General</span>
								</label>
								<label className={`px-3 py-2 border cursor-pointer ${selectedSource === 'accounting' ? 'bg-white/10 border-white/40' : 'border-white/10'}`}>
									<input type="radio" name="srcSide" className="sr-only" checked={selectedSource === 'accounting'} onChange={() => setSelectedSource('accounting')} />
									<span>Accounting</span>
								</label>
								<label className={`px-3 py-2 border cursor-pointer ${selectedSource === 'consulting' ? 'bg-white/10 border-white/40' : 'border-white/10'}`}>
									<input type="radio" name="srcSide" className="sr-only" checked={selectedSource === 'consulting'} onChange={() => setSelectedSource('consulting')} />
									<span>Consulting</span>
								</label>
							</div>
						</div>
						
						{/* Recommendation Filter */}
						<div className="mb-6">
							<label className="block text-sm font-medium mb-2">Recommendation Priority</label>
							<select
								value={selectedRecommendation}
								onChange={(e) => setSelectedRecommendation(e.target.value)}
								className="w-full px-3 py-2 bg-gray-900 text-white border border-white/10 focus:border-green-400 focus:ring-1 focus:ring-green-400"
							>
								<option value="">All recommendations</option>
								<option value="Reach out now">Reach out now</option>
								<option value="Monitor">Monitor</option>
								<option value="Warm outreach">Warm outreach</option>
							</select>
						</div>

						{/* Score Range Filter */}
						<div className="mb-6">
							<label className="block text-sm font-medium mb-2">Hugin Score Range</label>
							<select
								value={selectedScoreRange}
								onChange={(e) => setSelectedScoreRange(e.target.value)}
								className="w-full px-3 py-2 bg-gray-900 text-white border border-white/10 focus:border-green-400 focus:ring-1 focus:ring-green-400"
							>
								<option value="">All score ranges</option>
								<option value="0-50">0 - 50 (Low Priority)</option>
								<option value="50-100">50 - 100 (Medium Priority)</option>
								<option value="100-200">100 - 200 (High Priority)</option>
								<option value="200+">200+ (Top Priority)</option>
							</select>
						</div>

						{/* Sort Options */}
						<div className="mb-6">
							<label className="block text-sm font-medium mb-2">Sort By</label>
							<select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								className="w-full px-3 py-2 bg-gray-900 text-white border border-white/10 focus:border-green-400 focus:ring-1 focus:ring-green-400"
							>
								<option value="updatedAt">Last Updated</option>
								<option value="allvitrScore">Score (High to Low)</option>
								<option value="allvitrScoreAsc">Score (Low to High)</option>
								<option value="name">Company Name</option>
								<option value="revenue">Revenue (High to Low)</option>
								<option value="employees">Employees (High to Low)</option>
							</select>
						</div>

						{/* Active Filters Display */}
						{(selectedRecommendation || selectedScoreRange) && (
							<div className="mb-6 p-4 bg-gray-900 border border-white/10">
								<h3 className="text-sm font-medium mb-3 text-gray-300">Active Filters</h3>
								<div className="space-y-2">
									{selectedRecommendation && (
										<div className="flex items-center justify-between text-sm">
											<span className="text-gray-400">Recommendation:</span>
											<div className="flex items-center gap-2">
												<span className="px-2 py-1 bg-green-600 text-white text-xs">
													{selectedRecommendation}
												</span>
												<button 
													onClick={() => setSelectedRecommendation('')}
													className="text-red-400 hover:text-red-300"
												>
													×
												</button>
											</div>
										</div>
									)}
									{selectedScoreRange && (
										<div className="flex items-center justify-between text-sm">
											<span className="text-gray-400">Score Range:</span>
											<div className="flex items-center gap-2">
												<span className="px-2 py-1 bg-blue-600 text-white text-xs">
													{selectedScoreRange}
												</span>
												<button 
													onClick={() => setSelectedScoreRange('')}
													className="text-red-400 hover:text-red-300"
												>
													×
												</button>
											</div>
										</div>
									)}
								</div>
								<button 
									onClick={() => { 
										setSelectedRecommendation(''); 
										setSelectedScoreRange(''); 
									}}
									className="w-full mt-3 px-3 py-2 text-sm bg-red-600 hover:bg-red-700 transition-colors"
								>
									Clear All Filters
								</button>
							</div>
						)}

						{/* Results Count */}
						<div className="text-center p-4 bg-gray-900">
							<div className="text-2xl font-bold">{total}</div>
							<div className="text-sm text-gray-400">Businesses Found</div>
						</div>
					</div>
				</div>

				{/* Main Content Area */}
				<div className="flex-1 p-6">
					{/* Top Panel - Industry & Revenue Filters */}
					<div className="mb-8 space-y-6">
						{/* Combined Industry & Revenue Filters */}
						<div className="bg-gray-900 border border-white/10 p-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<h3 className="text-lg font-semibold mb-4">Industry Filter</h3>
									<div>
										<input
											type="text"
											value={industryQuery}
											onChange={(e) => setIndustryQuery(e.target.value)}
											ref={inputRef}
											onFocus={() => {
												// Show all suggestions if no query, otherwise show filtered results
												if (!industryQuery.trim() && allIndustries.length > 0) {
													setSuggestions(allIndustries)
												}
												setDropdownOpen(true)
											}}
											onKeyDown={(e) => {
												if (e.key === 'Enter') {
													addSelectedIndustry(industryQuery)
													setIndustryQuery('')
													setSuggestions([])
													setDropdownOpen(false)
												} else if (e.key === 'Escape') {
													setDropdownOpen(false)
												} else if (e.key === 'Backspace' && industryQuery.length === 0 && selectedIndustries.length > 0) {
													removeSelectedIndustry(selectedIndustries[selectedIndustries.length - 1].value)
												}
											}}
											placeholder="Type industry code or text..."
											className="w-full px-4 py-3 bg-gray-900 text-white border border-white/10 focus:border-green-400 focus:ring-1 focus:ring-green-400"
										/>
										{dropdownOpen && suggestions.length > 0 && dropdownRect && createPortal(
																				<div
										ref={dropdownRef}
										className="z-[9999] max-h-80 overflow-auto border border-white/10 bg-black text-white shadow-xl divide-y divide-white/10"
												style={{ position: 'fixed', top: dropdownRect.top, left: dropdownRect.left, width: dropdownRect.width }}
											>
												{/* Show count of available options */}
												{industryQuery.trim() && (
													<div className="px-4 py-2 text-xs text-gray-400 bg-gray-800 border-b border-white/10">
														{suggestions.length} of {totalFilteredCount} industries match "{industryQuery}"
													</div>
												)}
												{!industryQuery.trim() && allIndustries.length > 0 && (
													<div className="px-4 py-2 text-xs text-gray-400 bg-gray-800 border-b border-white/10">
														{suggestions.length} of {allIndustries.length} industries shown
													</div>
												)}
												{suggestions.map((s, idx) => {
													const label = [s.code, s.text].filter(Boolean).join(' – ')
													const term = (s.code || s.text || '').toString()
													return (
														<button
															key={idx}
															onClick={() => {
																addSelectedIndustry(term, label)
																setIndustryQuery('')
																setSuggestions([])
																setDropdownOpen(false)
															}}
															className="block w-full text-left px-4 py-3 hover:bg-white/20 focus:bg-white/20 focus:outline-none text-sm"
														>
															{label}
														</button>
													)
												})}
											</div>,
											document.body
										)}
										{selectedIndustries.length > 0 && (
											<div className="mt-4 flex items-center gap-2 flex-wrap">
												<span className="text-sm text-gray-400">Filtering by:</span>
												{selectedIndustries.map(si => (
													<span key={si.value} className="inline-flex items-center gap-2 bg-green-600 px-3 py-1 text-sm">
														<span className="font-medium">{si.label}</span>
														<button className="opacity-80 hover:opacity-100" onClick={() => removeSelectedIndustry(si.value)}>×</button>
													</span>
												))}
												<button className="text-sm text-red-400 hover:text-red-300 underline" onClick={() => { 
													setSelectedIndustries([]); 
													setIndustryQuery(''); 
												}}>clear all</button>
											</div>
										)}
									</div>
								</div>
								<div className="hidden">
									<h3 className="text-lg font-semibold mb-4">Source Filter</h3>
									<div className="flex items-center gap-3">
										<label className={`px-3 py-2 border cursor-pointer ${selectedSource === 'general' ? 'bg-white/10 border-white/40' : 'border-white/10'}`}>
											<input type="radio" name="src" className="sr-only" checked={selectedSource === 'general'} onChange={() => setSelectedSource('general')} />
											<span>General</span>
										</label>
										<label className={`px-3 py-2 border cursor-pointer ${selectedSource === 'accounting' ? 'bg-white/10 border-white/40' : 'border-white/10'}`}>
											<input type="radio" name="src" className="sr-only" checked={selectedSource === 'accounting'} onChange={() => setSelectedSource('accounting')} />
											<span>Accounting</span>
										</label>
										<label className={`px-3 py-2 border cursor-pointer ${selectedSource === 'consulting' ? 'bg-white/10 border-white/40' : 'border-white/10'}`}>
											<input type="radio" name="src" className="sr-only" checked={selectedSource === 'consulting'} onChange={() => setSelectedSource('consulting')} />
											<span>Consulting</span>
										</label>
									</div>
								</div>
								<div>
									<h3 className="text-lg font-semibold mb-4">Revenue Filter</h3>
									<div>
										<select
											value={selectedRevenueRange}
											onChange={(e) => setSelectedRevenueRange(e.target.value)}
											className="w-full px-4 py-3 bg-gray-900 text-white border border-white/10 focus:border-green-400 focus:ring-1 focus:ring-green-400"
										>
											<option value="">All revenue ranges</option>
																				<option value="0-1M">0 - 1M NOK</option>
									<option value="1M-10M">1M - 10M NOK</option>
									<option value="10M-100M">10M - 100M NOK</option>
									<option value="100M+">100M+ NOK</option>
										</select>
										{selectedRevenueRange && (
											<div className="mt-3 flex items-center gap-3">
												<span className="text-sm text-gray-400">Revenue filter:</span>
												<span className="inline-flex items-center gap-2 bg-blue-600 px-3 py-1 text-sm">
													<span className="font-medium">
														{selectedRevenueRange === '0-1M' ? '0 - 1M NOK' : 
														selectedRevenueRange === '1M-10M' ? '1M - 10M NOK' :
														selectedRevenueRange === '10M-100M' ? '10M - 100M NOK' :
														selectedRevenueRange === '100M+' ? '100M+ NOK' : selectedRevenueRange}
													</span>
													<button className="opacity-80 hover:opacity-100" onClick={() => setSelectedRevenueRange('')}>×</button>
												</span>
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Business List */}
					{loading ? (
						<div className="flex items-center justify-center py-12">
							<div className="text-center">
								<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
								<div className="text-lg text-gray-400">Loading businesses...</div>
							</div>
						</div>
					) : (
						<div className="space-y-4">
							{sortedData.map(business => (
								<BusinessCard
									key={business.orgNumber}
									business={business}
									numberFormatter={numberFormatter}
									expandedRationalOrgs={expandedRationalOrgs}
									setExpandedRationalOrgs={setExpandedRationalOrgs}
								/>
							))}
						</div>
					)}
					<div className="mt-8 flex items-center justify-between gap-4">
						<button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="px-4 py-2 border border-white/10 bg-gray-900 hover:bg-gray-800 text-sm">Go to top</button>
						{data.length < total && (
							<button onClick={() => setOffset(prev => prev + 100)} className="ml-auto px-4 py-2 border border-white/10 bg-gray-900 hover:bg-gray-800 text-sm">Load more</button>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
