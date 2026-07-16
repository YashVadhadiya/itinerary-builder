import { useState, useEffect } from 'react'
import type { CompanyDetails } from '../../types'
import { useItinerary } from '../../context/ItineraryContext'
import ReferencePanel from '../common/ReferencePanel'

interface Props {
  initialData: CompanyDetails
  onBack: () => void
  onNext: () => void
}

export default function CompanyDetailsForm({ initialData, onBack, onNext }: Props) {
  const { dispatch } = useItinerary()
  const [data, setData] = useState<CompanyDetails>(initialData)
  const [refSelections, setRefSelections] = useState<any[]>([])

  useEffect(() => {
    if (!refSelections.length) return
    const last = refSelections[refSelections.length - 1]
    if (last) setData({ companyName: last.companyName||data.companyName, legalInfo: last.legalInfo||data.legalInfo, badges: last.badges ? last.badges.split(',').map((b: string) => b.trim()) : data.badges })
  }, [refSelections])

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); dispatch({ type: 'SET_COMPANY_DETAILS', payload: data }); onNext() }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-5">
        <h2 className="text-lg font-semibold text-gray-900">Company Details</h2>

        <ReferencePanel sheetName="Company Details" columns={[
          { key: 'companyName', label: 'Company Name', placeholder: 'Himalayan Travels' },
          { key: 'legalInfo', label: 'Legal Info', placeholder: 'GSTIN: 19ABCDE1234F1Z5' },
          { key: 'badges', label: 'Badges (comma separated)', placeholder: 'ISO Certified, IATA Member' },
        ]} mapper={(r) => r[0] ? { companyName: r[0], legalInfo: r[1]||'', badges: r[2]||'' } : null}
          displayLabel={(c: any) => c.companyName} displayDetail={(c: any) => c.legalInfo}
          selectedItems={refSelections} onSelectionChange={setRefSelections} searchPlaceholder="Search companies..." />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name</label>
          <input type="text" value={data.companyName} onChange={(e) => setData((p) => ({ ...p, companyName: e.target.value }))}
            placeholder="e.g. Himalayan Travels Pvt. Ltd."
            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Legal Information</label>
          <textarea rows={4} value={data.legalInfo} onChange={(e) => setData((p) => ({ ...p, legalInfo: e.target.value }))}
            placeholder="GSTIN, registration numbers, licenses..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all" />
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Badges / Certifications</label>
            <button type="button" onClick={() => setData((p) => ({ ...p, badges: [...p.badges, ''] }))}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium">+ Add</button>
          </div>
          {data.badges.map((badge, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-amber-400 mt-2.5 select-none text-lg">★</span>
              <input type="text" value={badge} onChange={(e) => setData((p) => ({ ...p, badges: p.badges.map((b, j) => j === i ? e.target.value : b) }))}
                placeholder="e.g. ISO Certified, IATA Member..."
                className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all" />
              {data.badges.length > 1 && (
                <button type="button" onClick={() => setData((p) => ({ ...p, badges: p.badges.filter((_, j) => j !== i) }))}
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
