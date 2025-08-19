'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
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
		<div className="container mx-auto p-6 text-white">
			<h1 className="text-2xl font-bold mb-4">Hugin</h1>

			{/* Added: Recommendation data summary */}
			{!loading && sortedData.length > 0 && (
				<div className="mb-6 p-4 bg-gray-800 rounded border border-white/10">
					<h2 className="text-lg font-semibold mb-3">Recommendation Data Summary</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
						<div className="text-center">
							<div className="text-2xl font-bold text-green-400">
								{sortedData.filter(b => b.recommendation === 'Reach out now').length}
							</div>
							<div className="text-white/70">Reach out now</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-yellow-400">
								{sortedData.filter(b => b.recommendation === 'Monitor').length}
							</div>
							<div className="text-white/70">Monitor</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-blue-400">
								{sortedData.filter(b => b.recommendation === 'Warm outreach').length}
							</div>
							<div className="text-white/70">Warm outreach</div>
						</div>
					</div>
					{sortedData.some(b => b.allvitrScore) && (
						<div className="mt-3 pt-3 border-t border-white/10 text-center">
							<div className="text-sm text-white/70">
								Average Allvitr Score: <span className="font-semibold text-yellow-400">
									{(sortedData.reduce((sum, b) => sum + (b.allvitrScore || 0), 0) / sortedData.filter(b => b.allvitrScore).length).toFixed(2)}
								</span>
							</div>
						</div>
					)}
				</div>
			)}

			<div className="mb-4 max-w-xl">
				<label className="block text-sm mb-1">Filter by industry</label>
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
					className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-white/10"
				/>
				{dropdownOpen && suggestions.length > 0 && dropdownRect && createPortal(
					<div
						ref={dropdownRef}
						className="z-[9999] max-h-64 overflow-auto rounded border border-white/10 bg-gray-900 text-white shadow-xl divide-y divide-white/10"
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
									className="block w-full text-left px-3 py-2 hover:bg-white/20 focus:bg-white/20 focus:outline-none text-sm"
								>
									{label}
								</button>
							)
						})}
					</div>,
					document.body
				)}
				{selectedIndustries.length > 0 && (
					<div className="mt-2 text-sm text-white/80 flex items-center gap-2 flex-wrap">
						<span>Filtering by:</span>
						{selectedIndustries.map(si => (
							<span key={si.value} className="inline-flex items-center gap-1 rounded bg-white/10 px-2 py-0.5">
								<span className="font-mono">{si.label}</span>
								<button className="opacity-80 hover:opacity-100" onClick={() => removeSelectedIndustry(si.value)}>×</button>
							</span>
						))}
						<span className="opacity-80">({total} results)</span>
						<button className="ml-2 underline" onClick={() => { 
							setSelectedIndustries([]); 
							setIndustryQuery(''); 
							setSelectedRevenueRange(''); 
							setSelectedRecommendation('');
							setSelectedScoreRange('');
						}}>clear all filters</button>
					</div>
				)}
			</div>

			<div className="mb-4 max-w-xl">
				<label className="block text-sm mb-1">Filter by revenue</label>
				<select
					value={selectedRevenueRange}
					onChange={(e) => setSelectedRevenueRange(e.target.value)}
					className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-white/10"
				>
					<option value="">All revenue ranges</option>
					<option value="0-1M">0 - 1M NOK</option>
					<option value="1M-10M">1M - 10M NOK</option>
					<option value="10M-100M">10M - 100M NOK</option>
					<option value="100M+">100M+ NOK</option>
				</select>
				{selectedRevenueRange && (
					<div className="mt-2 text-sm text-white/80 flex items-center gap-2">
						<span>Revenue filter:</span>
						<span className="inline-flex items-center gap-1 rounded bg-white/10 px-2 py-0.5">
							<span className="font-mono">{selectedRevenueRange === '0-1M' ? '0 - 1M NOK' : 
								selectedRevenueRange === '1M-10M' ? '1M - 10M NOK' :
								selectedRevenueRange === '10M-100M' ? '10M - 100M NOK' :
								selectedRevenueRange === '100M+' ? '100M+ NOK' : selectedRevenueRange}</span>
							<button className="opacity-80 hover:opacity-100" onClick={() => setSelectedRevenueRange('')}>×</button>
						</span>
						<button className="ml-2 underline" onClick={() => setSelectedRevenueRange('')}>clear</button>
					</div>
				)}
			</div>

			<div className="mb-4 max-w-xl">
				<label className="block text-sm mb-1">Filter by recommendation</label>
				<select
					value={selectedRecommendation}
					onChange={(e) => setSelectedRecommendation(e.target.value)}
					className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-white/10"
				>
					<option value="">All recommendations</option>
					<option value="Reach out now">Reach out now</option>
					<option value="Monitor">Monitor</option>
					<option value="Warm outreach">Warm outreach</option>
				</select>
				{selectedRecommendation && (
					<div className="mt-2 text-sm text-white/80 flex items-center gap-2">
						<span>Recommendation filter:</span>
						<span className="inline-flex items-center gap-1 rounded bg-white/10 px-2 py-0.5">
							<span className="font-mono">{selectedRecommendation}</span>
							<button className="opacity-80 hover:opacity-100" onClick={() => setSelectedRecommendation('')}>×</button>
						</span>
						<button className="ml-2 underline" onClick={() => setSelectedRecommendation('')}>clear</button>
					</div>
				)}
			</div>

			<div className="mb-4 max-w-xl">
				<label className="block text-sm mb-1">Filter by Allvitr Score</label>
				<select
					value={selectedScoreRange}
					onChange={(e) => setSelectedScoreRange(e.target.value)}
					className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-white/10"
				>
					<option value="">All score ranges</option>
					<option value="0-50">0 - 50</option>
					<option value="50-100">50 - 100</option>
					<option value="100-200">100 - 200</option>
					<option value="200+">200+</option>
				</select>
				{selectedScoreRange && (
					<div className="mt-2 text-sm text-white/80 flex items-center gap-2">
						<span>Score filter:</span>
						<span className="inline-flex items-center gap-1 rounded bg-white/10 px-2 py-0.5">
							<span className="font-mono">{selectedScoreRange}</span>
							<button className="opacity-80 hover:opacity-100" onClick={() => setSelectedScoreRange('')}>×</button>
						</span>
						<button className="ml-2 underline" onClick={() => setSelectedScoreRange('')}>clear</button>
					</div>
				)}
			</div>

			<div className="mb-4 max-w-xl">
				<label className="block text-sm mb-1">Sort by</label>
				<select
					value={sortBy}
					onChange={(e) => setSortBy(e.target.value)}
					className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-white/10"
				>
					<option value="updatedAt">Last Updated</option>
					<option value="allvitrScore">Allvitr Score (High to Low)</option>
					<option value="allvitrScoreAsc">Allvitr Score (Low to High)</option>
					<option value="name">Company Name</option>
					<option value="revenue">Revenue (High to Low)</option>
					<option value="employees">Employees (High to Low)</option>
				</select>
			</div>

			{loading ? (
				<div>Loading…</div>
			) : (
				<ul className="space-y-4">
					{sortedData.map(b => (
						<li key={b.orgNumber} className={`border p-4 rounded ${
							b.recommendation === 'Reach out now' ? 'border-green-500 bg-green-900/20' :
							b.recommendation === 'Warm outreach' ? 'border-blue-500 bg-blue-900/20' :
							b.recommendation === 'Monitor' ? 'border-yellow-500 bg-yellow-900/20' :
							'border-white/10'
						}`}>
							<div className="flex justify-between items-start mb-2">
								<div className="font-semibold">{b.name}</div>
								{b.recommendation && (
									<span className={`px-2 py-1 rounded text-xs font-medium ${
										b.recommendation === 'Reach out now' ? 'bg-green-600 text-white' :
										b.recommendation === 'Warm outreach' ? 'bg-blue-600 text-white' :
										b.recommendation === 'Monitor' ? 'bg-yellow-600 text-white' :
										'bg-gray-600 text-white'
									}`}>
										{b.recommendation}
									</span>
								)}
							</div>
							<div className="text-sm text-white/70">Org: {b.orgNumber}</div>
							<div className="text-sm">CEO: {b.ceo || '—'}</div>
							<div className="text-sm">
								Address: {[b.addressStreet, b.addressPostalCode, b.addressCity].filter(Boolean).join(', ') || '—'}
							</div>
							<div className="text-sm">
								Website: {b.website ? (
									<a className="text-sky-400 underline" href={b.website} target="_blank" rel="noreferrer">
										{b.website}
									</a>
								) : (
									'—'
								)}
							</div>
							<div className="text-sm">Employees: {b.employees ?? '—'}</div>
							<div className="text-sm">Revenue: {b.revenue == null ? '—' : `${fmt(b.revenue)}${b.fiscalYear ? ` (FY ${b.fiscalYear})` : ''}`}</div>
							<div className="text-sm mt-2">Industry: {b.industryCode1 ? `${b.industryCode1} ${b.industryText1 || ''}`.trim() : '—'}</div>
							<div className="text-sm">VAT: {b.vatRegistered ? 'Registered' : '—'}{b.vatRegisteredDate ? ` (${new Date(b.vatRegisteredDate).toISOString().slice(0,10)})` : ''}</div>
							<div className="text-sm">Sector: {b.sectorCode ? `${b.sectorCode} ${b.sectorText || ''}`.trim() : '—'}</div>
							
							{/* Added: Recommendation data display */}
							{b.recommendation && (
								<div className="mt-3 pt-3 border-t border-white/10">
									{b.allvitrScore && (
										<div className="text-sm text-yellow-400 font-medium mb-1">
											⭐ Allvitr Score: {b.allvitrScore.toFixed(2)}
										</div>
									)}
									{b.rationale && (
										<div className="text-sm text-white/80">
											<b>Rationale:</b> {b.rationale.length > 150 ? `${b.rationale.substring(0, 150)}...` : b.rationale}
										</div>
									)}
								</div>
							)}
						</li>
					))}
				</ul>
			)}
		</div>
	)
}
