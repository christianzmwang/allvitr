'use client'

import { useEffect, useMemo, useState } from 'react'

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

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-20 border-b-2 border-white/40">
        <div className="container-95 py-5">
          <div className="text-sm md:text-base font-semibold text-white">Allvitr / Hugin</div>
        </div>
      </div>
      <div className="container-95 py-6 min-h-full flex flex-col gap-4 relative pt-24">
      <div className="sticky top-24 z-10">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="text-sm md:text-base font-semibold text-white">Market Research</div>
          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-300">
            <span className="px-2 py-1 rounded bg-white/5">{numberFmt.format(rows.length)} resultater</span>
            <span className="px-2 py-1 rounded bg-white/5">{numberFmt.format(selectedCount)} valgt</span>
          </div>
        </div>
        <div className="border-b border-white/10 mt-2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Filters panel */}
        <aside className="md:col-span-4 lg:col-span-3">
          <form
            onSubmit={onSearch}
            className="panel bg-black/40 p-4 rounded ring-1 ring-white/10 sticky top-24"
          >
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Nøkkelord</label>
                <input
                  placeholder="f.eks. pizza, rørlegger"
                  className="input"
                  value={form.keywords}
                  onChange={(e) => setForm((f) => ({ ...f, keywords: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Kategori</label>
                  <input
                    placeholder="Kafé, Butikk..."
                    className="input"
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">By</label>
                  <input
                    placeholder="Oslo"
                    className="input"
                    value={form.location}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Radius (km)</label>
                  <input
                    type="number"
                    min={1}
                    step={1}
                    className="input"
                    value={form.radiusKm}
                    onChange={(e) => setForm((f) => ({ ...f, radiusKm: Number(e.target.value) }))}
                  />
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
                    checked={form.hiring}
                    onChange={(e) => setForm((f) => ({ ...f, hiring: e.target.checked }))}
                  />
                  Ansetter
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-gray-200">
                  <input
                    type="checkbox"
                    checked={form.ads}
                    onChange={(e) => setForm((f) => ({ ...f, ads: e.target.checked }))}
                  />
                  Annonser
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-gray-200">
                  <input
                    type="checkbox"
                    checked={form.newlyOpened}
                    onChange={(e) => setForm((f) => ({ ...f, newlyOpened: e.target.checked }))}
                  />
                  Nyåpnet
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Min rating</label>
                  <input
                    type="number"
                    step={0.1}
                    min={0}
                    max={5}
                    className="input"
                    value={form.minRating}
                    onChange={(e) => setForm((f) => ({ ...f, minRating: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Min anmeldelser</label>
                  <input
                    type="number"
                    min={0}
                    step={10}
                    className="input"
                    value={form.minReviews}
                    onChange={(e) => setForm((f) => ({ ...f, minReviews: Number(e.target.value) }))}
                  />
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

          <div className="overflow-x-auto ring-1 ring-white/10 rounded">
            <table className="min-w-full text-sm">
              <thead className="text-left text-gray-300 bg-white/5 sticky top-0">
                <tr>
                  <th className="p-2 w-10">
                    <input
                      aria-label="Velg alle"
                      type="checkbox"
                      onChange={(e) => toggleAll(e.target.checked)}
                      checked={rows.length > 0 && rows.every((r) => selected[r.id])}
                    />
                  </th>
                  <th className="p-2">Navn</th>
                  <th className="p-2">Kategori</th>
                  <th className="p-2">By</th>
                  <th className="p-2">Postnr</th>
                  <th className="p-2">Telefon</th>
                  <th className="p-2">Nettsted</th>
                  <th className="p-2">Signal</th>
                  <th className="p-2">Score</th>
                  <th className="p-2">Kilde</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {!loading &&
                  rows.map((r) => (
                    <tr key={r.id} className="hover:bg-white/5">
                      <td className="p-2 align-top">
                        <input
                          aria-label={`Velg ${r.name}`}
                          type="checkbox"
                          checked={!!selected[r.id]}
                          onChange={(e) => setSelected((s) => ({ ...s, [r.id]: e.target.checked }))}
                        />
                      </td>
                      <td className="p-2 align-top font-medium text-white">
                        {r.name}
                        <div className="text-xs text-gray-400">{r.city}, {r.zip}</div>
                      </td>
                      <td className="p-2 align-top">{r.category}</td>
                      <td className="p-2 align-top">{r.city}</td>
                      <td className="p-2 align-top">{r.zip}</td>
                      <td className="p-2 align-top">
                        {r.phone ? (
                          <a className="text-sky-400 underline" href={`tel:${r.phone}`}>{r.phone}</a>
                        ) : (
                          ''
                        )}
                        {r.email && (
                          <div>
                            <a className="text-sky-400 underline" href={`mailto:${r.email}`}>{r.email}</a>
                          </div>
                        )}
                      </td>
                      <td className="p-2 align-top">
                        {r.website ? (
                          <a
                            className="text-sky-400 underline break-all"
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
                      <td className="p-2 align-top">
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
                            <span className="px-2 py-0.5 rounded bg-emerald-600/20 text-emerald-300">Ansetter</span>
                          )}
                          {r.signals.ads && (
                            <span className="px-2 py-0.5 rounded bg-indigo-600/20 text-indigo-300">Annonser</span>
                          )}
                          {r.signals.new && (
                            <span className="px-2 py-0.5 rounded bg-yellow-600/20 text-yellow-300">Ny</span>
                          )}
                        </div>
                      </td>
                      <td className="p-2 align-top font-semibold">{numberFmt.format(r.score)}</td>
                      <td className="p-2 align-top">{r.source}</td>
                    </tr>
                  ))}

                {loading &&
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={`skeleton-${i}`} className="animate-pulse">
                      <td className="p-2"><div className="h-4 w-4 bg-white/10 rounded" /></td>
                      <td className="p-2"><div className="h-4 w-40 bg-white/10 rounded" /></td>
                      <td className="p-2"><div className="h-4 w-24 bg-white/10 rounded" /></td>
                      <td className="p-2"><div className="h-4 w-16 bg-white/10 rounded" /></td>
                      <td className="p-2"><div className="h-4 w-16 bg-white/10 rounded" /></td>
                      <td className="p-2"><div className="h-4 w-28 bg-white/10 rounded" /></td>
                      <td className="p-2"><div className="h-4 w-32 bg-white/10 rounded" /></td>
                      <td className="p-2"><div className="h-4 w-24 bg-white/10 rounded" /></td>
                      <td className="p-2"><div className="h-4 w-10 bg-white/10 rounded" /></td>
                      <td className="p-2"><div className="h-4 w-16 bg-white/10 rounded" /></td>
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


