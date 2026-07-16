import { useState, useEffect, useCallback } from 'react'
import { fetchRefData, addRefRow, isSheetsConfigured } from '../../services/googleSheets'

export interface ColumnDef {
  key: string
  label: string
  placeholder?: string
}

interface Props<T> {
  sheetName: string
  columns: ColumnDef[]
  mapper: (row: string[]) => T | null
  displayLabel: (item: T) => string
  displayDetail?: (item: T) => string
  selectedItems: T[]
  onSelectionChange: (items: T[]) => void
  searchPlaceholder?: string
}

export default function ReferencePanel<T extends Record<string, any>>({
  sheetName, columns, mapper, displayLabel, displayDetail,
  selectedItems, onSelectionChange, searchPlaceholder,
}: Props<T>) {
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newRow, setNewRow] = useState<string[]>(columns.map(() => ''))
  const [saving, setSaving] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const load = useCallback(async () => {
    if (!isSheetsConfigured()) return
    setLoading(true); setError('')
    try { setItems(await fetchRefData<T>(sheetName, mapper)) }
    catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }, [sheetName, mapper])

  useEffect(() => { load() }, [load])

  const isSelected = (item: T) => selectedItems.some((s) => JSON.stringify(s) === JSON.stringify(item))

  function toggle(item: T) {
    onSelectionChange(
      isSelected(item) ? selectedItems.filter((s) => JSON.stringify(s) !== JSON.stringify(item)) : [...selectedItems, item]
    )
  }

  const filtered = items.filter((item) => {
    if (!search) return true
    const q = search.toLowerCase()
    return displayLabel(item).toLowerCase().includes(q) || (displayDetail?.(item)?.toLowerCase().includes(q) ?? false)
  })

  async function handleAdd() {
    if (newRow.some((v) => !v.trim())) return
    setSaving(true)
    try { await addRefRow(sheetName, newRow); setShowAddForm(false); setNewRow(columns.map(() => '')); await load() }
    catch (err: any) { setError(err.message) }
    finally { setSaving(false) }
  }

  if (!isSheetsConfigured()) return null

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <button type="button" onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition-colors">
        <span>Saved {sheetName} {items.length ? `(${items.length})` : ''}</span>
        <svg className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
          <button type="button" onClick={() => setShowAddForm(!showAddForm)}
            className="w-full px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 active:bg-blue-200 transition-colors">
            {showAddForm ? 'Cancel' : '+ Add New to Sheet'}
          </button>

          {showAddForm && (
            <div className="space-y-2 p-3 bg-gray-50 rounded-xl">
              {columns.map((col, i) => (
                <input key={col.key} type="text" value={newRow[i]}
                  onChange={(e) => setNewRow((prev) => prev.map((v, j) => (j === i ? e.target.value : v)))}
                  placeholder={col.placeholder || col.label}
                  className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all" />
              ))}
              <button type="button" onClick={handleAdd} disabled={saving || newRow.some((v) => !v.trim())}
                className="w-full px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
                {saving ? 'Saving...' : 'Save to Sheet'}
              </button>
            </div>
          )}

          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder || `Search...`}
            className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all" />

          {loading && <p className="text-xs text-gray-400 text-center py-2">Loading...</p>}
          {error && <p className="text-xs text-red-500 text-center py-2">{error}</p>}

          <div className="max-h-48 overflow-y-auto space-y-1 -mx-1">
            {!filtered.length && !loading && <p className="text-xs text-gray-400 text-center py-3 italic">No items found</p>}
            {filtered.map((item, idx) => (
              <label key={idx}
                className={`flex items-start gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                  isSelected(item) ? 'bg-blue-50 ring-1 ring-blue-200' : 'hover:bg-gray-50'
                }`}>
                <input type="checkbox" checked={isSelected(item)} onChange={() => toggle(item)}
                  className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{displayLabel(item)}</p>
                  {displayDetail && <p className="text-xs text-gray-500 truncate">{displayDetail(item)}</p>}
                </div>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
