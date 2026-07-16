import { useState, useEffect } from 'react'
import type { HotelOption, HotelStay } from '../../types'
import { useItinerary } from '../../context/ItineraryContext'
import ReferencePanel from '../common/ReferencePanel'

interface Props {
  initialData: HotelOption[]
  onBack: () => void
  onNext: () => void
}

const MEAL_OPTIONS = ['CP', 'MAP', 'APAI', 'Room Only']
let nextOptionId = 1
let nextStayId = 1

function newOption(): HotelOption {
  return { id: `opt_${nextOptionId++}`, title: '', stays: [] }
}

function newStay(): HotelStay {
  return { id: `stay_${nextStayId++}`, nights: '', city: '', hotelName: '', mealPlan: [], accommodation: '' }
}

export default function HotelsForm({ initialData, onBack, onNext }: Props) {
  const { dispatch } = useItinerary()
  const [options, setOptions] = useState<HotelOption[]>(initialData.length ? initialData : [newOption()])
  const [refSelections, setRefSelections] = useState<any[]>([])

  useEffect(() => {
    if (!refSelections.length) return
    setOptions((prev) => {
      if (!prev.length) return prev
      const existing = new Set(prev[0].stays.map((s) => `${s.hotelName}|${s.city}`))
      const add = refSelections.filter((h: any) => !existing.has(`${h.hotelName}|${h.city}`))
        .map((h: any) => ({ id: `stay_${nextStayId++}`, nights: '', city: h.city, hotelName: h.hotelName,
          mealPlan: h.mealPlan ? h.mealPlan.split(',').map((m: string) => m.trim()) : [], accommodation: h.accommodation }))
      return add.length ? prev.map((o, i) => i === 0 ? { ...o, stays: [...o.stays, ...add] } : o) : prev
    })
  }, [refSelections])

  function upd<T>(arr: T[], set: (v: T[]) => void, id: string, field: string, val: any, sub?: string) {
    set(arr.map((item: any) => {
      if (item.id !== id) return item
      if (sub) return { ...item, [sub]: item[sub].map((s: any) => s.id === field ? { ...s, [val.key]: val.val } : s) }
      return { ...item, [field]: val }
    }))
  }

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); dispatch({ type: 'SET_HOTEL_OPTIONS', payload: options }); onNext() }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Hotels</h2>
        <button type="button" onClick={() => setOptions((p) => [...p, newOption()])}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors">+ Add</button>
      </div>

      <ReferencePanel sheetName="Hotels" columns={[
        { key: 'state', label: 'State', placeholder: 'Sikkim' },
        { key: 'hotelName', label: 'Hotel Name', placeholder: 'Click Collection Hotel' },
        { key: 'city', label: 'City', placeholder: 'Gangtok' },
        { key: 'mealPlan', label: 'Meal Plan', placeholder: 'CP' },
        { key: 'accommodation', label: 'Accommodation', placeholder: '2 Standard Room' },
      ]} mapper={(r) => r[1] ? { state: r[0]||'', hotelName: r[1], city: r[2]||'', mealPlan: r[3]||'', accommodation: r[4]||'' } : null}
        displayLabel={(h: any) => `${h.hotelName} — ${h.city}`}
        displayDetail={(h: any) => `${h.state} · ${h.mealPlan} · ${h.accommodation}`}
        selectedItems={refSelections} onSelectionChange={setRefSelections} searchPlaceholder="Search hotels..." />

      {options.map((opt) => (
        <div key={opt.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
          <div className="flex items-center gap-3">
            <input type="text" value={opt.title} onChange={(e) => setOptions((p) => p.map((o) => o.id === opt.id ? { ...o, title: e.target.value } : o))}
              placeholder="Option title (e.g. 3 Star Premium)"
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all" />
            {options.length > 1 && (
              <button type="button" onClick={() => setOptions((p) => p.filter((o) => o.id !== opt.id))}
                className="text-red-500 hover:text-red-700 text-sm font-medium shrink-0">Remove</button>
            )}
          </div>

          {opt.stays.map((stay) => (
            <div key={stay.id} className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Stay</span>
                <button type="button" onClick={() => setOptions((p) => p.map((o) => o.id === opt.id ? { ...o, stays: o.stays.filter((s) => s.id !== stay.id) } : o))}
                  className="text-red-500 hover:text-red-700 text-xs font-medium">Remove</button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Nights</label>
                  <textarea rows={2} value={stay.nights} onChange={(e) => setOptions((p) => p.map((o) => o.id !== opt.id ? o : { ...o, stays: o.stays.map((s) => s.id === stay.id ? { ...s, nights: e.target.value } : s) }))}
                    placeholder="e.g. 1st (23 Aug) 2nd (24 Aug)"
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-medium text-gray-600 mb-1">City</label>
                  <textarea rows={2} value={stay.city} onChange={(e) => setOptions((p) => p.map((o) => o.id !== opt.id ? o : { ...o, stays: o.stays.map((s) => s.id === stay.id ? { ...s, city: e.target.value } : s) }))}
                    placeholder="e.g. Gangtok"
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Hotel Name</label>
                  <input type="text" value={stay.hotelName} onChange={(e) => setOptions((p) => p.map((o) => o.id !== opt.id ? o : { ...o, stays: o.stays.map((s) => s.id === stay.id ? { ...s, hotelName: e.target.value } : s) }))}
                    placeholder="e.g. Click Collection Hotel 3 Star"
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Accommodation</label>
                  <input type="text" value={stay.accommodation} onChange={(e) => setOptions((p) => p.map((o) => o.id !== opt.id ? o : { ...o, stays: o.stays.map((s) => s.id === stay.id ? { ...s, accommodation: e.target.value } : s) }))}
                    placeholder="e.g. 2 Standard Room 4 Pax"
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Meal Plan</label>
                <div className="flex flex-wrap gap-3">
                  {MEAL_OPTIONS.map((meal) => (
                    <label key={meal} className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={stay.mealPlan.includes(meal)}
                        onChange={() => setOptions((p) => p.map((o) => o.id !== opt.id ? o : { ...o, stays: o.stays.map((s) => s.id === stay.id ? { ...s, mealPlan: s.mealPlan.includes(meal) ? s.mealPlan.filter((m) => m !== meal) : [...s.mealPlan, meal] } : s) }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm text-gray-600">{meal}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <button type="button" onClick={() => setOptions((p) => p.map((o) => o.id === opt.id ? { ...o, stays: [...o.stays, newStay()] } : o))}
            className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-colors">
            + Add Stay
          </button>
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
