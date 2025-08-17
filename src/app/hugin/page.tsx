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
		return sp.toString() ? `?${sp.toString()}` : ''
	}, [selectedIndustries, selectedRevenueRange])

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

	return (
		<div className="container mx-auto p-6 text-white">
			<h1 className="text-2xl font-bold mb-4">Hugin</h1>

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
						<button className="ml-2 underline" onClick={() => { setSelectedIndustries([]); setIndustryQuery(''); setSelectedRevenueRange(''); }}>clear all filters</button>
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

			{loading ? (
				<div>Loading…</div>
			) : (
				<ul className="space-y-4">
					{data.map(b => (
						<li key={b.orgNumber} className="border border-white/10 p-4 rounded">
							<div className="font-semibold">{b.name}</div>
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
						</li>
					))}
				</ul>
			)}
		</div>
	)
}
