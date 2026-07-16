import { useState } from 'react'
import type { PackageOverview } from '../../types'
import { useItinerary } from '../../context/ItineraryContext'

interface Props {
  initialData: PackageOverview
  onNext: () => void
}

export default function PackageOverviewForm({ initialData, onNext }: Props) {
  const { dispatch } = useItinerary()
  const [form, setForm] = useState<PackageOverview>(initialData)

  function handleChange(field: keyof PackageOverview, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    dispatch({ type: 'SET_PACKAGE_OVERVIEW', payload: form })
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-5">
        <h2 className="text-lg font-semibold text-gray-900">Package Overview</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Destination</label>
          <input type="text" value={form.destination} onChange={(e) => handleChange('destination', e.target.value)}
            placeholder="e.g. Sikkim-Darjeeling"
            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Stay Breakdown</label>
          <input type="text" value={form.stayBreakdown} onChange={(e) => handleChange('stayBreakdown', e.target.value)}
            placeholder="e.g. Gangtok 3N / Pelling 1N / Darjeeling 2N"
            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Start Date</label>
            <input type="text" value={form.startDate} onChange={(e) => handleChange('startDate', e.target.value)}
              placeholder="e.g. 23 Aug, 2026"
              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Trip Duration</label>
            <input type="text" value={form.tripDuration} onChange={(e) => handleChange('tripDuration', e.target.value)}
              placeholder="e.g. 6N / 7D"
              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Pax (Adults)</label>
          <input type="number" min={1} value={form.pax} onChange={(e) => handleChange('pax', Number(e.target.value))}
            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all" />
        </div>
      </div>

      <div className="flex justify-end pt-1">
        <button type="submit" className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm shadow-blue-200">
          Next Step
        </button>
      </div>
    </form>
  )
}
