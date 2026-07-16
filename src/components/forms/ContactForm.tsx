import { useState, useEffect } from 'react'
import type { ContactInfo } from '../../types'
import { useItinerary } from '../../context/ItineraryContext'
import ReferencePanel from '../common/ReferencePanel'
import { sampleContactInfo } from '../../utils/sampleData'

interface Props {
  initialData: ContactInfo
  onBack: () => void
  onNext: () => void
}

export default function ContactForm({ initialData, onBack, onNext }: Props) {
  const { dispatch } = useItinerary()
  const [data, setData] = useState<ContactInfo>(initialData)
  const [refSelections, setRefSelections] = useState<any[]>([])

  useEffect(() => {
    if (!refSelections.length) return
    const last = refSelections[refSelections.length - 1]
    if (last) setData({ ownerName: last.ownerName||data.ownerName, mobile: last.mobile||data.mobile, email: last.email||data.email, instagram: last.instagram||data.instagram, officeAddress: last.address||data.officeAddress })
  }, [refSelections])

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); dispatch({ type: 'SET_CONTACT_INFO', payload: data }); onNext() }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-5">
        <h2 className="text-lg font-semibold text-gray-900">Contact Info</h2>

        <ReferencePanel sheetName="Contact Info" columns={[
          { key: 'ownerName', label: 'Owner Name', placeholder: 'Rajesh Sharma' },
          { key: 'mobile', label: 'Mobile', placeholder: '+91 98765 43210' },
          { key: 'email', label: 'Email', placeholder: 'info@travels.com' },
          { key: 'instagram', label: 'Instagram', placeholder: '@travels' },
          { key: 'address', label: 'Address', placeholder: 'MG Marg, Gangtok' },
        ]} mapper={(r) => r[0] ? { ownerName: r[0], mobile: r[1]||'', email: r[2]||'', instagram: r[3]||'', address: r[4]||'' } : null}
          displayLabel={(c: any) => c.ownerName} displayDetail={(c: any) => `${c.mobile} · ${c.email}`}
          selectedItems={refSelections} onSelectionChange={setRefSelections} searchPlaceholder="Search contacts..."
          fallbackItems={[{ ...sampleContactInfo, address: sampleContactInfo.officeAddress }]} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Owner Name</label>
            <input type="text" value={data.ownerName} onChange={(e) => setData((p) => ({ ...p, ownerName: e.target.value }))}
              placeholder="e.g. Rajesh Sharma"
              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Mobile Number</label>
            <input type="text" value={data.mobile} onChange={(e) => setData((p) => ({ ...p, mobile: e.target.value }))}
              placeholder="e.g. +91 98765 43210"
              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input type="email" value={data.email} onChange={(e) => setData((p) => ({ ...p, email: e.target.value }))}
              placeholder="e.g. info@himalayantravels.com"
              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Instagram</label>
            <input type="text" value={data.instagram} onChange={(e) => setData((p) => ({ ...p, instagram: e.target.value }))}
              placeholder="e.g. @himalayan_travels"
              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Office Address</label>
          <textarea rows={3} value={data.officeAddress} onChange={(e) => setData((p) => ({ ...p, officeAddress: e.target.value }))}
            placeholder="Full office address with city, state, pincode..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all" />
        </div>
      </div>

      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onBack}
          className="flex-1 px-6 py-3.5 bg-gray-100 text-gray-700 font-medium text-sm rounded-xl hover:bg-gray-200 active:bg-gray-300 transition-colors">Back</button>
        <button type="submit"
          className="flex-1 px-6 py-3.5 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm shadow-blue-200">Preview</button>
      </div>
    </form>
  )
}
