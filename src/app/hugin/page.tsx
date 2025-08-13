'use client'

import { useEffect, useMemo, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'

type LeadRow = {
  id: string
  name: string
  category: string
  website: string | null
  city: string
  zip: string
  phone: string | null
  email: string | null
  signals: {
    rating: number | null
    reviews: number | null
    hiring: boolean
    ads: boolean
    new: boolean
  }
  score: number
  source: string
}

type SearchForm = {
  keywords: string
  category: string
  location: string
  radiusKm: number
  hiring: boolean
  ads: boolean
  newlyOpened: boolean
  minRating: number
  minReviews: number
}

function toCsv(rows: LeadRow[]): string {
  const header = [
    'id',
    'navn',
    'kategori',
    'nettsted',
    'by',
    'postnr',
    'telefon',
    'epost',
    'rating',
    'anmeldelser',
    'ansettelser',
    'annonser',
    'ny',
    'score',
    'kilde',
  ]
  const safe = (v: unknown) => {
    if (v === null || v === undefined) return ''
    const s = String(v)
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return '"' + s.replace(/"/g, '""') + '"'
    }
    return s
  }
  const lines = [header.join(',')]
  for (const r of rows) {
    lines.push(
      [
        r.id,
        r.name,
        r.category,
        r.website ?? '',
        r.city,
        r.zip,
        r.phone ?? '',
        r.email ?? '',
        r.signals.rating ?? '',
        r.signals.reviews ?? '',
        r.signals.hiring ? 'ja' : 'nei',
        r.signals.ads ? 'ja' : 'nei',
        r.signals.new ? 'ja' : 'nei',
        r.score,
        r.source,
      ]
        .map(safe)
        .join(','),
    )
  }
  return lines.join('\n')
}

export default function HuginPage() {
  const [form, setForm] = useState<SearchForm>({
    keywords: '',
    category: '',
    location: '',
    radiusKm: 25,
    hiring: false,
    ads: false,
    newlyOpened: false,
    minRating: 0,
    minReviews: 0,
  })
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<LeadRow[]>([])
  const [selected, setSelected] = useState<Record<string, boolean>>({})

  const numberFmt = useMemo(() => new Intl.NumberFormat('nb-NO'), [])

  useEffect(() => {
    // initial load with seed data
    void onSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function onSearch(e?: React.FormEvent) {
    e?.preventDefault()
    setLoading(true)
    try {
      const resp = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          keywords: form.keywords || undefined,
          category: form.category || undefined,
          location: form.location || undefined,
          radiusKm: form.radiusKm || undefined,
          minRating: form.minRating || undefined,
          minReviews: form.minReviews || undefined,
        }),
      })
      const data = await resp.json()
      setRows(data.results ?? [])
      setSelected({})
    } catch {
      console.error('search error')
    } finally {
      setLoading(false)
    }
  }

  function toggleAll(selectedValue: boolean) {
    const next: Record<string, boolean> = {}
    rows.forEach((r) => (next[r.id] = selectedValue))
    setSelected(next)
  }

  function exportCsv() {
    const chosen = rows.filter((r) => selected[r.id])
    const csv = toCsv(chosen)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'hugin.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  function resetFilters() {
    setForm({
      keywords: '',
      category: '',
      location: '',
      radiusKm: 25,
      hiring: false,
      ads: false,
      newlyOpened: false,
      minRating: 0,
      minReviews: 0,
    })
  }

  const selectedCount = useMemo(
    () => Object.values(selected).filter(Boolean).length,
    [selected],
  )

  function displayHostname(url?: string | null) {
    if (!url) return ''
    try {
      const u = new URL(url.startsWith('http') ? url : `https://${url}`)
      return u.hostname.replace(/^www\./, '')
    } catch {
      return url
    }
  }

  function clampNumber(value: number, min?: number, max?: number) {
    if (min !== undefined && value < min) return min
    if (max !== undefined && value > max) return max
    return value
  }

  return (
    <>
      <div className="border-b-2 border-gray-400">
        <div className="container-95 py-5">
          <div className="text-sm md:text-base font-semibold text-white"><Link href="/" className="hover:text-gray-300">Allvitr</Link> / <span className="text-red-600">Hugin</span></div>
        </div>
      </div>
      <div className="container-95 py-6 min-h-full flex flex-col gap-5 relative">
      <div>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="text-sm md:text-base font-semibold text-white">Market Research</div>
          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-300">
            <span className="px-2 py-1 rounded-none bg-white/5">{numberFmt.format(rows.length)} resultater</span>
            <span className="px-2 py-1 rounded-none bg-white/5">{numberFmt.format(selectedCount)} valgt</span>
          </div>
        </div>
        <div className="border-b border-white/10 mt-2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Filters panel */}
        <aside className="md:col-span-4 lg:col-span-3">
          <form
            onSubmit={onSearch}
            className="panel rounded-none p-4 sticky top-24"
          >
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Nøkkelord</label>
                <input
                  placeholder="f.eks. pizza, rørlegger"
                  className="input rounded-none"
                  value={form.keywords}
                  onChange={(e) => setForm((f) => ({ ...f, keywords: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Kategori</label>
                  <input
                    placeholder="Kafé, Butikk..."
                    className="input rounded-none"
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">By</label>
                  <input
                    placeholder="Oslo"
                    className="input rounded-none"
                    value={form.location}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Radius (km)</label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      step={1}
                      className="input rounded-none pr-10"
                      value={form.radiusKm}
                      onChange={(e) => setForm((f) => ({ ...f, radiusKm: Number(e.target.value) }))}
                    />
                    <div className="absolute right-0 inset-y-0 w-10 flex flex-col">
                      <button
                        type="button"
                        className="flex-1 flex items-center justify-center text-gray-400 hover:text-white p-0 bg-transparent"
                        onClick={() => setForm((f) => ({ ...f, radiusKm: clampNumber((f.radiusKm ?? 0) + 1, 1) }))}
                        aria-label="Øk radius"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        className="flex-1 flex items-center justify-center text-gray-400 hover:text-white p-0 bg-transparent"
                        onClick={() => setForm((f) => ({ ...f, radiusKm: clampNumber((f.radiusKm ?? 0) - 1, 1) }))}
                        aria-label="Reduser radius"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-end">
                  <button type="button" className="btn btn-outline w-full" onClick={resetFilters}>
                    Nullstill
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <label className="inline-flex items-center gap-2 text-sm text-gray-200">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={form.hiring}
                    onChange={(e) => setForm((f) => ({ ...f, hiring: e.target.checked }))}
                  />
                  <span className="h-5 w-5 rounded-none border border-white/30 bg-white/5 ring-1 ring-white/10 grid place-items-center peer-focus:ring-white/30 peer-checked:bg-red-600/20 peer-checked:border-red-600">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-red-400 opacity-0 peer-checked:opacity-100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                  Ansetter
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-gray-200">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={form.ads}
                    onChange={(e) => setForm((f) => ({ ...f, ads: e.target.checked }))}
                  />
                  <span className="h-5 w-5 rounded-none border border-white/30 bg-white/5 ring-1 ring-white/10 grid place-items-center peer-focus:ring-white/30 peer-checked:bg-red-600/20 peer-checked:border-red-600">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-red-400 opacity-0 peer-checked:opacity-100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                  Annonser
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-gray-200">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={form.newlyOpened}
                    onChange={(e) => setForm((f) => ({ ...f, newlyOpened: e.target.checked }))}
                  />
                  <span className="h-5 w-5 rounded-none border border-white/30 bg-white/5 ring-1 ring-white/10 grid place-items-center peer-focus:ring-white/30 peer-checked:bg-red-600/20 peer-checked:border-red-600">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-red-400 opacity-0 peer-checked:opacity-100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                  Nyåpnet
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Min rating</label>
                  <div className="relative">
                    <input
                      type="number"
                      step={0.1}
                      min={0}
                      max={5}
                      className="input rounded-none pr-10"
                      value={form.minRating}
                      onChange={(e) => setForm((f) => ({ ...f, minRating: Number(e.target.value) }))}
                    />
                    <div className="absolute right-0 inset-y-0 w-10 flex flex-col">
                      <button
                        type="button"
                        className="flex-1 flex items-center justify-center text-gray-400 hover:text-white p-0 bg-transparent"
                        onClick={() => setForm((f) => ({ ...f, minRating: clampNumber(Number((f.minRating ?? 0) + 0.1).toFixed(1) as unknown as number, 0, 5) }))}
                        aria-label="Øk rating"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        className="flex-1 flex items-center justify-center text-gray-400 hover:text-white p-0 bg-transparent"
                        onClick={() => setForm((f) => ({ ...f, minRating: clampNumber(Number((f.minRating ?? 0) - 0.1).toFixed(1) as unknown as number, 0, 5) }))}
                        aria-label="Reduser rating"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Min anmeldelser</label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      step={10}
                      className="input rounded-none pr-10"
                      value={form.minReviews}
                      onChange={(e) => setForm((f) => ({ ...f, minReviews: Number(e.target.value) }))}
                    />
                    <div className="absolute right-0 inset-y-0 w-10 flex flex-col">
                      <button
                        type="button"
                        className="flex-1 flex items-center justify-center text-gray-400 hover:text-white p-0 bg-transparent"
                        onClick={() => setForm((f) => ({ ...f, minReviews: clampNumber((f.minReviews ?? 0) + 10, 0) }))}
                        aria-label="Øk anmeldelser"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        className="flex-1 flex items-center justify-center text-gray-400 hover:text-white p-0 bg-transparent"
                        onClick={() => setForm((f) => ({ ...f, minReviews: clampNumber((f.minReviews ?? 0) - 10, 0) }))}
                        aria-label="Reduser anmeldelser"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button type="submit" className="btn btn-primary flex-1" disabled={loading}>
                  {loading ? 'Søker...' : 'Søk'}
                </button>
              </div>
            </div>
          </form>
        </aside>

        {/* Results */}
        <main className="md:col-span-8 lg:col-span-9">
          <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => toggleAll(true)}
                disabled={rows.length === 0}
              >
                Velg alle
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setSelected({})}
                disabled={selectedCount === 0}
              >
                Tøm valg
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="btn btn-outline"
                onClick={exportCsv}
                disabled={selectedCount === 0}
              >
                Eksporter valgte
              </button>
            </div>
          </div>

          <div className="overflow-x-auto ring-1 ring-white/10">
            <table className="min-w-full text-sm">
              <thead className="text-left text-gray-300 sticky z-[1] border-b border-white/10">
                <tr>
                  <th className="p-3 w-10" />
                  <th className="p-3">Navn</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3">By</th>
                  <th className="p-3">Postnr</th>
                  <th className="p-3">Telefon</th>
                  <th className="p-3">Nettsted</th>
                  <th className="p-3">Signal</th>
                  <th className="p-3 text-right">Score</th>
                  <th className="p-3">Kilde</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {!loading &&
                  rows.map((r) => (
                    <tr key={r.id} className="hover:bg-white/5">
                      <td className="p-3 align-top">
                        <label className="inline-flex items-center">
                          <input
                            aria-label={`Velg ${r.name}`}
                            type="checkbox"
                            className="sr-only peer"
                            checked={!!selected[r.id]}
                            onChange={(e) => setSelected((s) => ({ ...s, [r.id]: e.target.checked }))}
                          />
                          <span className="h-5 w-5 rounded-none border border-white/30 bg-white/5 ring-1 ring-white/10 grid place-items-center peer-focus:ring-white/30 peer-checked:bg-red-600/20 peer-checked:border-red-600">
                            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-red-400 opacity-0 peer-checked:opacity-100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>
                        </label>
                      </td>
                      <td className="p-3 align-top font-medium text-white">
                        {r.name}
                        <div className="text-xs text-gray-400">{r.city}, {r.zip}</div>
                      </td>
                      <td className="p-3 align-top">{r.category}</td>
                      <td className="p-3 align-top">{r.city}</td>
                      <td className="p-3 align-top">{r.zip}</td>
                      <td className="p-3 align-top">
                        {r.phone ? (
                          <a className="text-sky-400 underline underline-offset-2 hover:text-sky-300" href={`tel:${r.phone}`}>{r.phone}</a>
                        ) : (
                          ''
                        )}
                        {r.email && (
                          <div>
                            <a className="text-sky-400 underline underline-offset-2 hover:text-sky-300" href={`mailto:${r.email}`}>{r.email}</a>
                          </div>
                        )}
                      </td>
                      <td className="p-3 align-top">
                        {r.website ? (
                          <a
                            className="text-sky-400 underline underline-offset-2 hover:text-sky-300 break-all"
                            href={r.website}
                            target="_blank"
                            rel="noreferrer"
                            title={r.website}
                          >
                            {displayHostname(r.website)}
                          </a>
                        ) : (
                          ''
                        )}
                      </td>
                      <td className="p-3 align-top">
                        <div className="flex items-center gap-3 text-xs flex-wrap">
                          {r.signals.rating !== null && (
                            <span className="inline-flex items-center gap-1">
                              <span>⭐</span>
                              {r.signals.rating.toLocaleString('nb-NO', {
                                minimumFractionDigits: 1,
                                maximumFractionDigits: 1,
                              })}
                            </span>
                          )}
                          {r.signals.reviews !== null && (
                            <span className="text-gray-400">({numberFmt.format(r.signals.reviews)})</span>
                          )}
                          {r.signals.hiring && (
                            <span className="px-2 py-0.5 rounded-none bg-emerald-600/20 text-emerald-300">Ansetter</span>
                          )}
                          {r.signals.ads && (
                            <span className="px-2 py-0.5 rounded-none bg-indigo-600/20 text-indigo-300">Annonser</span>
                          )}
                          {r.signals.new && (
                            <span className="px-2 py-0.5 rounded-none bg-yellow-600/20 text-yellow-300">Ny</span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 align-top font-semibold text-right">{numberFmt.format(r.score)}</td>
                      <td className="p-3 align-top">{r.source}</td>
                    </tr>
                  ))}

                {loading &&
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={`skeleton-${i}`} className="animate-pulse">
                      <td className="p-3"><div className="h-4 w-4 bg-white/10 rounded-none" /></td>
                      <td className="p-3"><div className="h-4 w-40 bg-white/10 rounded-none" /></td>
                      <td className="p-3"><div className="h-4 w-24 bg-white/10 rounded-none" /></td>
                      <td className="p-3"><div className="h-4 w-16 bg-white/10 rounded-none" /></td>
                      <td className="p-3"><div className="h-4 w-16 bg-white/10 rounded-none" /></td>
                      <td className="p-3"><div className="h-4 w-28 bg-white/10 rounded-none" /></td>
                      <td className="p-3"><div className="h-4 w-32 bg-white/10 rounded-none" /></td>
                      <td className="p-3"><div className="h-4 w-24 bg-white/10 rounded-none" /></td>
                      <td className="p-3"><div className="h-4 w-10 bg-white/10 rounded-none" /></td>
                      <td className="p-3"><div className="h-4 w-16 bg-white/10 rounded-none" /></td>
                    </tr>
                  ))}

                {!loading && rows.length === 0 && (
                  <tr>
                    <td className="p-6 text-gray-400 text-center" colSpan={10}>
                      Ingen resultater. Prøv å utvide radius eller fjerne noen filtre.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
    </>
  )
}


