import { useState, useEffect } from 'react'
import type { ItineraryDay } from '../../types'
import { useItinerary } from '../../context/ItineraryContext'
import ReferencePanel from '../common/ReferencePanel'

interface Props {
  initialData: ItineraryDay[]
  onBack: () => void
  onNext: () => void
}

let nextDayId = 1

function newDay(): ItineraryDay {
  return { id: `it_day_${nextDayId++}`, day: '', title: '', distance: '', travelTime: '', description: '', points: [''] }
}

export default function DayWiseItineraryForm({ initialData, onBack, onNext }: Props) {
  const { dispatch } = useItinerary()
  const [days, setDays] = useState<ItineraryDay[]>(initialData.length ? initialData : [newDay()])
  const [refSelections, setRefSelections] = useState<any[]>([])

  useEffect(() => {
    if (!refSelections.length) return
    setDays((prev) => {
      const existing = new Set(prev.map((d) => d.day))
      const add = refSelections.filter((r: any) => !existing.has(r.day))
        .map((r: any) => ({ id: `it_day_${nextDayId++}`, day: r.day||'', title: r.title||'', distance: r.distance||'', travelTime: r.travelTime||'', description: r.description||'', points: r.points ? r.points.split('\n').filter(Boolean) : [''] }))
      return add.length ? [...prev, ...add] : prev
    })
  }, [refSelections])

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); dispatch({ type: 'SET_ITINERARY_DAYS', payload: days }); onNext() }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Itinerary Days</h2>
        <button type="button" onClick={() => setDays((p) => [...p, newDay()])}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors">+ Add</button>
      </div>

      <ReferencePanel sheetName="Itinerary Days" columns={[
        { key: 'state', label: 'State', placeholder: 'Sikkim' },
        { key: 'day', label: 'Day', placeholder: '1st Day (Sun 23rd Aug)' },
        { key: 'title', label: 'Title', placeholder: 'Bagdogra to Gangtok' },
        { key: 'distance', label: 'Distance', placeholder: '125 Km' },
        { key: 'travelTime', label: 'Travel Time', placeholder: '5 hrs' },
        { key: 'description', label: 'Description' },
        { key: 'points', label: 'Points (one per line)' },
      ]} mapper={(r) => r[1] ? { state: r[0]||'', day: r[1], title: r[2]||'', distance: r[3]||'', travelTime: r[4]||'', description: r[5]||'', points: r[6]||'' } : null}
        displayLabel={(r: any) => `${r.day} — ${r.title}`} displayDetail={(r: any) => `${r.state} · ${r.distance} ${r.travelTime}`}
        selectedItems={refSelections} onSelectionChange={setRefSelections} searchPlaceholder="Search itinerary days..." />

      {days.map((day) => (
        <div key={day.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Day</span>
            {days.length > 1 && (
              <button type="button" onClick={() => setDays((p) => p.filter((d) => d.id !== day.id))}
                className="text-red-500 hover:text-red-700 text-xs font-medium">Remove</button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-medium text-gray-600 mb-1">Day</label>
              <input type="text" value={day.day} onChange={(e) => setDays((p) => p.map((d) => d.id === day.id ? { ...d, day: e.target.value } : d))}
                placeholder="e.g. 1st Day (Sun 23rd Aug)"
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
              <input type="text" value={day.title} onChange={(e) => setDays((p) => p.map((d) => d.id === day.id ? { ...d, title: e.target.value } : d))}
                placeholder="e.g. Bagdogra to Gangtok"
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Distance</label>
              <input type="text" value={day.distance} onChange={(e) => setDays((p) => p.map((d) => d.id === day.id ? { ...d, distance: e.target.value } : d))}
                placeholder="125 Km"
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Travel Time</label>
              <input type="text" value={day.travelTime} onChange={(e) => setDays((p) => p.map((d) => d.id === day.id ? { ...d, travelTime: e.target.value } : d))}
                placeholder="5 hrs"
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
            <textarea rows={3} value={day.description} onChange={(e) => setDays((p) => p.map((d) => d.id === day.id ? { ...d, description: e.target.value } : d))}
              placeholder="Describe the day's activities..."
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-600">Points</label>
              <button type="button" onClick={() => setDays((p) => p.map((d) => d.id === day.id ? { ...d, points: [...d.points, ''] } : d))}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium">+ Add Point</button>
            </div>
            {day.points.map((point, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-gray-400 mt-2.5 select-none">•</span>
                <input type="text" value={point} onChange={(e) => setDays((p) => p.map((d) => d.id !== day.id ? d : { ...d, points: d.points.map((pt, j) => j === i ? e.target.value : pt) }))}
                  placeholder="Add a point..."
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all" />
                {day.points.length > 1 && (
                  <button type="button" onClick={() => setDays((p) => p.map((d) => d.id !== day.id ? d : { ...d, points: d.points.filter((_, j) => j !== i) }))}
                    className="mt-1 text-red-500 hover:text-red-700 text-xs font-medium shrink-0">Remove</button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onBack}
          className="flex-1 px-6 py-3.5 bg-gray-100 text-gray-700 font-medium text-sm rounded-xl hover:bg-gray-200 active:bg-gray-300 transition-colors">Back</button>
        <button type="submit"
          className="flex-1 px-6 py-3.5 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm shadow-blue-200">Save</button>
      </div>
    </form>
  )
}
