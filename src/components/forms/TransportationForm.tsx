import { useState, useEffect } from 'react'
import type { Transportation, TransportDay } from '../../types'
import { useItinerary } from '../../context/ItineraryContext'
import ReferencePanel from '../common/ReferencePanel'

interface Props {
  initialData: Transportation
  onBack: () => void
  onNext: () => void
}

const VEHICLE_OPTIONS = ['Sedan', 'MVP', 'Tempo Traveller']
let nextDayId = 1

function newDay(): TransportDay {
  return { id: `day_${nextDayId++}`, day: '', service: '' }
}

export default function TransportationForm({ initialData, onBack, onNext }: Props) {
  const { dispatch } = useItinerary()
  const [transport, setTransport] = useState<Transportation>(
    initialData.vehicle || initialData.days.length ? initialData : { vehicle: '', days: [newDay()] }
  )
  const [refSelections, setRefSelections] = useState<any[]>([])

  useEffect(() => {
    if (!refSelections.length) return
    setTransport((prev) => {
      const existing = new Set(prev.days.map((d) => `${d.day}|${d.service}`))
      const add = refSelections.filter((t: any) => !existing.has(`${t.day}|${t.service}`))
        .map((t: any) => ({ id: `day_${nextDayId++}`, day: t.day || '', service: t.service || '' }))
      return add.length ? { ...prev, days: [...prev.days, ...add] } : prev
    })
  }, [refSelections])

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); dispatch({ type: 'SET_TRANSPORTATION', payload: transport }); onNext() }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-5">
        <h2 className="text-lg font-semibold text-gray-900">Transportation</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Vehicle Type</label>
          <div className="flex flex-wrap gap-3">
            {VEHICLE_OPTIONS.map((v) => (
              <button key={v} type="button" onClick={() => setTransport((p) => ({ ...p, vehicle: v }))}
                className={`px-5 py-3 border-2 rounded-xl text-sm font-medium transition-all ${
                  transport.vehicle === v
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 active:bg-gray-50'
                }`}>
                {v}
              </button>
            ))}
          </div>
        </div>

        {transport.vehicle && (
          <>
            <ReferencePanel sheetName="Transportation" columns={[
              { key: 'vehicle', label: 'Vehicle', placeholder: 'MVP' },
              { key: 'day', label: 'Day', placeholder: '1st Day (Sun, 23 Aug)' },
              { key: 'service', label: 'Service', placeholder: 'Bagdogra to Gangtok' },
            ]} mapper={(r) => (r[1]||r[2]) ? { vehicle: r[0]||'', day: r[1]||'', service: r[2]||'' } : null}
              displayLabel={(t: any) => t.day || t.service} displayDetail={(t: any) => t.service}
              selectedItems={refSelections} onSelectionChange={setRefSelections} searchPlaceholder="Search services..." />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">Days</h3>
                <button type="button" onClick={() => setTransport((p) => ({ ...p, days: [...p.days, newDay()] }))}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors">+ Add</button>
              </div>
              {transport.days.map((day) => (
                <div key={day.id} className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Day</span>
                    <button type="button" onClick={() => setTransport((p) => ({ ...p, days: p.days.filter((d) => d.id !== day.id) }))}
                      className="text-red-500 hover:text-red-700 text-xs font-medium">Remove</button>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <input type="text" value={day.day} onChange={(e) => setTransport((p) => ({ ...p, days: p.days.map((d) => d.id === day.id ? { ...d, day: e.target.value } : d) }))}
                      placeholder="e.g. 1st Day (Sun, 23 Aug)"
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all" />
                    <textarea rows={2} value={day.service} onChange={(e) => setTransport((p) => ({ ...p, days: p.days.map((d) => d.id === day.id ? { ...d, service: e.target.value } : d) }))}
                      placeholder="e.g. Bagdogra Airport to Gangtok - Arrival and Transfer"
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
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
