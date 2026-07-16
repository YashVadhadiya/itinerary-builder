import { useState, useEffect } from 'react'
import type { InclusionsExclusions } from '../../types'
import { useItinerary } from '../../context/ItineraryContext'
import ReferencePanel from '../common/ReferencePanel'

interface Props {
  initialData: InclusionsExclusions
  onBack: () => void
  onNext: () => void
}

export default function InclusionsExclusionsForm({ initialData, onBack, onNext }: Props) {
  const { dispatch } = useItinerary()
  const [data, setData] = useState<InclusionsExclusions>(initialData)
  const [incSel, setIncSel] = useState<any[]>([])
  const [excSel, setExcSel] = useState<any[]>([])

  useEffect(() => {
    if (incSel.length) {
      const add = incSel.map((i: any) => i.item).filter((i: string) => !data.inclusions.includes(i))
      if (add.length) setData((p) => ({ ...p, inclusions: [...p.inclusions.filter(Boolean), ...add] }))
    }
  }, [incSel])

  useEffect(() => {
    if (excSel.length) {
      const add = excSel.map((i: any) => i.item).filter((i: string) => !data.exclusions.includes(i))
      if (add.length) setData((p) => ({ ...p, exclusions: [...p.exclusions.filter(Boolean), ...add] }))
    }
  }, [excSel])

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); dispatch({ type: 'SET_INCLUSIONS_EXCLUSIONS', payload: data }); onNext() }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-lg font-semibold text-gray-900">Inclusions &amp; Exclusions</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ReferencePanel sheetName="Inclusions" columns={[
          { key: 'category', label: 'Category', placeholder: 'Sightseeing' },
          { key: 'item', label: 'Item', placeholder: 'All sightseeing and transfers' },
        ]} mapper={(r) => r[1] ? { category: r[0]||'', item: r[1] } : null}
          displayLabel={(i: any) => i.item} displayDetail={(i: any) => i.category}
          selectedItems={incSel} onSelectionChange={setIncSel} searchPlaceholder="Search inclusions..." />
        <ReferencePanel sheetName="Exclusions" columns={[
          { key: 'category', label: 'Category', placeholder: 'Flights' },
          { key: 'item', label: 'Item', placeholder: 'Air fare / Train fare' },
        ]} mapper={(r) => r[1] ? { category: r[0]||'', item: r[1] } : null}
          displayLabel={(i: any) => i.item} displayDetail={(i: any) => i.category}
          selectedItems={excSel} onSelectionChange={setExcSel} searchPlaceholder="Search exclusions..." />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Inclusions</h3>
          <button type="button" onClick={() => setData((p) => ({ ...p, inclusions: [...p.inclusions, ''] }))}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors">+ Add</button>
        </div>
        <div className="space-y-2">
          {data.inclusions.map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-gray-400 mt-3 select-none">•</span>
              <textarea rows={2} value={item} onChange={(e) => setData((p) => ({ ...p, inclusions: p.inclusions.map((v, j) => j === i ? e.target.value : v) }))}
                placeholder="Add inclusion..."
                className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all" />
              {data.inclusions.length > 1 && (
                <button type="button" onClick={() => setData((p) => ({ ...p, inclusions: p.inclusions.filter((_, j) => j !== i) }))}
                  className="mt-2 text-red-500 hover:text-red-700 text-xs font-medium shrink-0">Remove</button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Exclusions</h3>
          <button type="button" onClick={() => setData((p) => ({ ...p, exclusions: [...p.exclusions, ''] }))}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors">+ Add</button>
        </div>
        <div className="space-y-2">
          {data.exclusions.map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-gray-400 mt-3 select-none">•</span>
              <textarea rows={2} value={item} onChange={(e) => setData((p) => ({ ...p, exclusions: p.exclusions.map((v, j) => j === i ? e.target.value : v) }))}
                placeholder="Add exclusion..."
                className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all" />
              {data.exclusions.length > 1 && (
                <button type="button" onClick={() => setData((p) => ({ ...p, exclusions: p.exclusions.filter((_, j) => j !== i) }))}
                  className="mt-2 text-red-500 hover:text-red-700 text-xs font-medium shrink-0">Remove</button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onBack}
          className="flex-1 px-6 py-3.5 bg-gray-100 text-gray-700 font-medium text-sm rounded-xl hover:bg-gray-200 active:bg-gray-300 transition-colors">Back</button>
        <button type="submit"
          className="flex-1 px-6 py-3.5 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm shadow-blue-200">Next</button>
      </div>
    </form>
  )
}
