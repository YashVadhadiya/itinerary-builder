import { useState } from 'react'
import type { PricingEntry } from '../../types'
import { useItinerary } from '../../context/ItineraryContext'

interface Props {
  initialData: PricingEntry[]
  hotelOptions: { id: string; title: string }[]
  onBack: () => void
  onNext: () => void
}

export default function PricingForm({ initialData, hotelOptions, onBack, onNext }: Props) {
  const { dispatch } = useItinerary()
  const [entries, setEntries] = useState<PricingEntry[]>(() =>
    initialData.length ? initialData : hotelOptions.map((opt) => ({
      optionId: opt.id, optionTitle: opt.title || `Option ${hotelOptions.indexOf(opt) + 1}`, amount: '', includesGST: true,
    }))
  )

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); dispatch({ type: 'SET_PRICING', payload: entries }); onNext() }

  if (!entries.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-sm">No hotel options found. Add hotels first.</p>
        <button type="button" onClick={onBack}
          className="mt-4 px-6 py-3 bg-gray-100 text-gray-700 font-medium text-sm rounded-xl hover:bg-gray-200 transition-colors">Back</button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-lg font-semibold text-gray-900">Pricing</h2>

      {entries.map((entry) => (
        <div key={entry.optionId} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
          <h3 className="font-semibold text-gray-900">{entry.optionTitle}</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Total Price (INR)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
              <input type="text" value={entry.amount}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9,]/g, '')
                  setEntries((prev) => prev.map((e) => e.optionId === entry.optionId ? { ...e, amount: val } : e))
                }}
                placeholder="92,500"
                className="w-full pl-10 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">/-</span>
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={entry.includesGST}
              onChange={(e) => setEntries((prev) => prev.map((en) => en.optionId === entry.optionId ? { ...en, includesGST: e.target.checked } : en))}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span className="text-sm text-gray-700">Includes GST</span>
          </label>
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
