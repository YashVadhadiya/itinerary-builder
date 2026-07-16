import { useState, useEffect } from 'react'
import type { TermsSection } from '../../types'
import { useItinerary } from '../../context/ItineraryContext'
import ReferencePanel from '../common/ReferencePanel'

interface Props {
  initialData: TermsSection[]
  onBack: () => void
  onNext: () => void
}

let nextId = 1

function newSection(): TermsSection {
  return { id: `terms_${nextId++}`, title: '', content: '' }
}

export default function TermsForm({ initialData, onBack, onNext }: Props) {
  const { dispatch } = useItinerary()
  const [sections, setSections] = useState<TermsSection[]>(initialData.length ? initialData : [newSection()])
  const [refSelections, setRefSelections] = useState<any[]>([])

  useEffect(() => {
    if (!refSelections.length) return
    setSections((prev) => {
      const existing = new Set(prev.map((s) => s.title))
      const add = refSelections.filter((r: any) => !existing.has(r.title))
        .map((r: any) => ({ id: `terms_${nextId++}`, title: r.title||'', content: r.content||'' }))
      return add.length ? [...prev, ...add] : prev
    })
  }, [refSelections])

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); dispatch({ type: 'SET_TERMS', payload: sections }); onNext() }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Terms &amp; Conditions</h2>
        <button type="button" onClick={() => setSections((p) => [...p, newSection()])}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors">+ Add</button>
      </div>

      <ReferencePanel sheetName="Terms" columns={[
        { key: 'state', label: 'State', placeholder: 'Sikkim' },
        { key: 'title', label: 'Title', placeholder: 'Cancellation Policy' },
        { key: 'content', label: 'Content', placeholder: 'Write terms...' },
      ]} mapper={(r) => r[1] ? { state: r[0]||'', title: r[1], content: r[2]||'' } : null}
        displayLabel={(t: any) => t.title} displayDetail={(t: any) => t.state ? `${t.state}` : ''}
        selectedItems={refSelections} onSelectionChange={setRefSelections} searchPlaceholder="Search terms..." />

      {sections.map((section) => (
        <div key={section.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <input type="text" value={section.title} onChange={(e) => setSections((p) => p.map((s) => s.id === section.id ? { ...s, title: e.target.value } : s))}
              placeholder="Section title (e.g. Transportation Guidelines)"
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all" />
            {sections.length > 1 && (
              <button type="button" onClick={() => setSections((p) => p.filter((s) => s.id !== section.id))}
                className="text-red-500 hover:text-red-700 text-sm font-medium shrink-0">Remove</button>
            )}
          </div>
          <textarea rows={5} value={section.content} onChange={(e) => setSections((p) => p.map((s) => s.id === section.id ? { ...s, content: e.target.value } : s))}
            placeholder="Write the terms and conditions for this section..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all" />
        </div>
      ))}

      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onBack}
          className="flex-1 px-6 py-3.5 bg-gray-100 text-gray-700 font-medium text-sm rounded-xl hover:bg-gray-200 active:bg-gray-300 transition-colors">Back</button>
        <button type="submit"
          className="flex-1 px-6 py-3.5 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm shadow-blue-200">Next</button>
      </div>
    </form>
  )
}
