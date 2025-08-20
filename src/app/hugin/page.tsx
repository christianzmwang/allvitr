'use client'

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'

function useDebounce<T>(value: T, delay = 250) {
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

export default function BrregPage() {
	const [data, setData] = useState<Business[]>([])
	const [total, setTotal] = useState<number>(0)
	const [loading, setLoading] = useState(true)
	const [industryQuery, setIndustryQuery] = useState('')
	const [selectedIndustries, setSelectedIndustries] = useState<SelectedIndustry[]>([])
	const [suggestions, setSuggestions] = useState<IndustryOpt[]>([])
	const [selectedRevenueRange, setSelectedRevenueRange] = useState<string>('')
	const [selectedRecommendation, setSelectedRecommendation] = useState<string>('')
	const [selectedScoreRange, setSelectedScoreRange] = useState<string>('')
	const [sortBy, setSortBy] = useState<string>('updatedAt')
	const debouncedIndustry = useDebounce(industryQuery, 250)
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
		return sp.toString() ? `?${sp.toString()}` : ''
	}, [selectedIndustries, selectedRevenueRange, selectedRecommendation, selectedScoreRange])

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
					setData(res)
					setTotal(res.length)
				} else {
					setData(res.items)
					setTotal(res.total)
				}
			})
			.finally(() => setLoading(false))
	}, [queryParam])

	useEffect(() => {
		const url = debouncedIndustry
			? '/api/industries?q=' + encodeURIComponent(debouncedIndustry)
			: '/api/industries'
		fetch(url)
			.then(r => r.json())
			.then((rows: IndustryOpt[]) => setSuggestions(rows))
			.catch(() => setSuggestions([]))
	}, [debouncedIndustry])

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

	const fmt = (v: number | string | null | undefined) => (v === null || v === undefined ? '—' : new Intl.NumberFormat('no-NO').format(Number(v)))

	// Sort data based on selected criteria
	const sortedData = useMemo(() => {
		const sorted = [...data]
		switch (sortBy) {
			case 'allvitrScore':
				return sorted.sort((a, b) => (b.allvitrScore || 0) - (a.allvitrScore || 0))
			case 'allvitrScoreAsc':
				return sorted.sort((a, b) => (a.allvitrScore || 0) - (b.allvitrScore || 0))
			case 'name':
				return sorted.sort((a, b) => a.name.localeCompare(b.name))
			case 'revenue':
				return sorted.sort((a, b) => (Number(b.revenue) || 0) - (Number(a.revenue) || 0))
			case 'employees':
				return sorted.sort((a, b) => (b.employees || 0) - (a.employees || 0))
			default:
				return sorted
		}
	}, [data, sortBy])

	return (
		<div className="min-h-screen bg-black text-white">
			{/* Header */}
			<div className="bg-black border-b border-white/10">
				<div className="py-4 px-6">
					<h1 className="text-2xl font-bold">Allvitr / <span className="text-red-600">Hugin</span></h1>
				</div>
			</div>

			<div className="flex">
				{/* Left Sidebar - Recommendation & Score Filters */}
				<div className="w-80 bg-black border-r border-white/10 min-h-screen p-6">
					<div className="sticky top-6">
						<h2 className="text-xl font-semibold mb-6">Parameters</h2>
						
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
												const url = industryQuery
													? '/api/industries?q=' + encodeURIComponent(industryQuery)
													: '/api/industries'
												fetch(url)
													.then(r => r.json())
													.then((rows: IndustryOpt[]) => setSuggestions(rows))
													.catch(() => setSuggestions([]))
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
										className="z-[9999] max-h-64 overflow-auto border border-white/10 bg-black text-white shadow-xl divide-y divide-white/10"
												style={{ position: 'fixed', top: dropdownRect.top, left: dropdownRect.left, width: dropdownRect.width }}
											>
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
							{sortedData.map(b => (
								<div key={b.orgNumber} className={`border p-6 transition-all hover:shadow-lg ${
									b.recommendation === 'Reach out now' ? 'border-green-500 bg-green-900/10 hover:bg-green-900/20' :
									b.recommendation === 'Warm outreach' ? 'border-blue-500 bg-blue-900/10 hover:bg-blue-900/20' :
									b.recommendation === 'Monitor' ? 'border-yellow-500 bg-yellow-900/10 hover:bg-yellow-900/20' :
									'border-white/10 bg-gray-900 hover:bg-gray-800'
								}`}>
									<div className="flex justify-between items-start mb-4">
										<div className="flex-1">
											<h3 className="text-xl font-semibold mb-2">{b.name}</h3>
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
												<div>
													<div className="mb-2"><span className="font-medium">Org:</span> {b.orgNumber}</div>
													<div className="mb-2"><span className="font-medium">CEO:</span> {b.ceo || '—'}</div>
													<div className="mb-2"><span className="font-medium">Employees:</span> {b.employees ?? '—'}</div>
													<div className="mb-2"><span className="font-medium">Revenue:</span> {b.revenue == null ? '—' : `${fmt(b.revenue)}${b.fiscalYear ? ` (FY ${b.fiscalYear})` : ''}`}</div>
												</div>
												<div>
													<div className="mb-2"><span className="font-medium">Address:</span> {[b.addressStreet, b.addressPostalCode, b.addressCity].filter(Boolean).join(', ') || '—'}</div>
													<div className="mb-2"><span className="font-medium">Website:</span> {b.website ? (
														<a className="text-sky-400 underline hover:text-sky-300" href={b.website} target="_blank" rel="noreferrer">
															{b.website}
														</a>
													) : (
														'—'
													)}</div>
													<div className="mb-2"><span className="font-medium">Industry:</span> {b.industryCode1 ? `${b.industryCode1} ${b.industryText1 || ''}`.trim() : '—'}</div>
													<div className="mb-2"><span className="font-medium">Sector:</span> {b.sectorCode ? `${b.sectorCode} ${b.sectorText || ''}`.trim() : '—'}</div>
												</div>
											</div>
										</div>
										<div className="ml-6 flex flex-col items-end gap-3">
											{b.recommendation && (
												<span className={`px-3 py-2 text-sm font-medium ${
													b.recommendation === 'Reach out now' ? 'bg-green-600 text-white' :
													b.recommendation === 'Warm outreach' ? 'bg-blue-600 text-white' :
													b.recommendation === 'Monitor' ? 'bg-yellow-600 text-white' :
													'bg-gray-600 text-white'
												}`}>
													{b.recommendation}
												</span>
											)}
											{b.allvitrScore && (
												<div className="text-center">
													<div className="text-2xl font-bold text-yellow-400">
														{b.allvitrScore.toFixed(2)}
													</div>
													<div className="text-xs text-yellow-400/70">Hugin Score</div>
												</div>
											)}
										</div>
									</div>
									
									{/* Recommendation Rationale */}
									{b.recommendation && b.rationale && (
										<div className="mt-4 pt-4 border-t border-white/10">
											<div className="text-sm">
												<span className="font-medium text-gray-300">Rationale:</span>
											{(() => {
													const all = (b.rationale || '')
														.split(/\r?\n|;|(?<=\.)\s+/)
														.map(s => s.trim())
														.filter(Boolean)
													const isExpanded = !!expandedRationalOrgs[b.orgNumber]
													const items = all
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
																const labeled = cleaned.match(/impact\s*direction\s*:?\s*([+-]?\s*\d+(?:[.,]\d+)?%?)/i)
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

													const rendered = (isExpanded ? items : items.slice(0, 2)).map((it, i) => {
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
															{items.length > 2 && (
																<button
																	onClick={() => setExpandedRationalOrgs(prev => ({ ...prev, [b.orgNumber]: !isExpanded }))}
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
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
