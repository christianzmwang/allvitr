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

export default function LeadsPage() {
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
    a.download = 'leads.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="page container-95 py-8">
      <h1 className="text-2xl font-bold text-white mb-4">Leads</h1>
      <form
        onSubmit={onSearch}
        className="grid grid-cols-1 md:grid-cols-6 gap-3 bg-black/40 p-4 rounded"
      >
        <input
          placeholder="Søk nøkkelord"
          className="input md:col-span-2"
          value={form.keywords}
          onChange={(e) => setForm((f) => ({ ...f, keywords: e.target.value }))}
        />
        <input
          placeholder="Kategori (f.eks. Kafé)"
          className="input"
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
        />
        <input
          placeholder="By"
          className="input"
          value={form.location}
          onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
        />
        <input
          type="number"
          placeholder="Radius (km)"
          className="input"
          value={form.radiusKm}
          onChange={(e) =>
            setForm((f) => ({ ...f, radiusKm: Number(e.target.value) }))
          }
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Søker...' : 'Søk'}
        </button>

        <div className="md:col-span-6 grid grid-cols-2 md:grid-cols-6 gap-3 items-center mt-2">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.hiring}
              onChange={(e) =>
                setForm((f) => ({ ...f, hiring: e.target.checked }))
              }
            />{' '}
            Ansetter
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.ads}
              onChange={(e) =>
                setForm((f) => ({ ...f, ads: e.target.checked }))
              }
            />{' '}
            Annonser
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.newlyOpened}
              onChange={(e) =>
                setForm((f) => ({ ...f, newlyOpened: e.target.checked }))
              }
            />{' '}
            Nyåpnet
          </label>
          <div className="flex items-center gap-2">
            <span>Min rating</span>
            <input
              type="number"
              step="0.1"
              className="input"
              value={form.minRating}
              onChange={(e) =>
                setForm((f) => ({ ...f, minRating: Number(e.target.value) }))
              }
            />
          </div>
          <div className="flex items-center gap-2">
            <span>Min anmeldelser</span>
            <input
              type="number"
              className="input"
              value={form.minReviews}
              onChange={(e) =>
                setForm((f) => ({ ...f, minReviews: Number(e.target.value) }))
              }
            />
          </div>
          <div className="text-right">
            <button
              type="button"
              className="btn btn-outline"
              onClick={exportCsv}
              disabled={!Object.values(selected).some(Boolean)}
            >
              Eksporter
            </button>
          </div>
        </div>
      </form>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-gray-300">
            <tr>
              <th className="p-2">
                <input
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
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-white/5">
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={!!selected[r.id]}
                    onChange={(e) =>
                      setSelected((s) => ({ ...s, [r.id]: e.target.checked }))
                    }
                  />
                </td>
                <td className="p-2">{r.name}</td>
                <td className="p-2">{r.category}</td>
                <td className="p-2">{r.city}</td>
                <td className="p-2">{r.zip}</td>
                <td className="p-2">{r.phone ?? ''}</td>
                <td className="p-2">
                  <a
                    className="text-sky-400 underline"
                    href={r.website ?? '#'}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {r.website ?? ''}
                  </a>
                </td>
                <td className="p-2">
                  <div className="flex items-center gap-3 text-xs">
                    {r.signals.rating !== null && (
                      <span>
                        ⭐{' '}
                        {r.signals.rating.toLocaleString('nb-NO', {
                          minimumFractionDigits: 1,
                          maximumFractionDigits: 1,
                        })}
                      </span>
                    )}
                    {r.signals.reviews !== null && (
                      <span>({numberFmt.format(r.signals.reviews)})</span>
                    )}
                    {r.signals.hiring && (
                      <span className="px-2 py-0.5 rounded bg-emerald-600/20 text-emerald-300">
                        Ansetter
                      </span>
                    )}
                    {r.signals.ads && (
                      <span className="px-2 py-0.5 rounded bg-indigo-600/20 text-indigo-300">
                        Annonser
                      </span>
                    )}
                    {r.signals.new && (
                      <span className="px-2 py-0.5 rounded bg-yellow-600/20 text-yellow-300">
                        Ny
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-2 font-semibold">
                  {numberFmt.format(r.score)}
                </td>
                <td className="p-2">{r.source}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="p-4 text-gray-400" colSpan={10}>
                  Ingen resultater
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
