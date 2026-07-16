import { useState } from 'react'
import { useItinerary } from '../context/ItineraryContext'
import { generatePdf } from '../services/pdfGenerator'
import { getPageStructure } from '../utils/pageLayout'
import { saveItineraryToSheets, isSheetsConfigured } from '../services/googleSheets'

export default function PreviewPage() {
  const { state } = useItinerary()
  const { hotelOptions, transportation: t, pricing, itineraryDays, terms, gallery } = state
  const { packageOverview: o, inclusionsExclusions: ie, companyDetails: cd, contactInfo: ci } = state
  const [sheetStatus, setSheetStatus] = useState<{ ok?: boolean; msg: string } | null>(null)

  const pages = getPageStructure(hotelOptions, t, pricing, itineraryDays, terms, gallery)

  async function handleDownload() {
    await generatePdf(o, hotelOptions, t, pricing, ie, itineraryDays, terms, gallery, cd, ci)
  }

  async function handleSaveToSheets() {
    setSheetStatus(null)
    try {
      const id = await saveItineraryToSheets({ packageOverview: o, hotelOptions, transportation: t, pricing, inclusionsExclusions: ie, itineraryDays, terms, companyDetails: cd, contactInfo: ci })
      setSheetStatus({ ok: true, msg: `Saved! ID: ${id.slice(0, 8)}…` })
    } catch (err: any) {
      setSheetStatus({ ok: false, msg: err?.message || 'Failed to save' })
    }
  }

  return (
    <div className="max-w-[210mm] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Preview</h1>
          <p className="text-sm text-gray-500">{pages.length} page{pages.length > 1 ? 's' : ''}</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {isSheetsConfigured() && (
            <button type="button" onClick={handleSaveToSheets} disabled={sheetStatus?.ok}
              className="flex-1 sm:flex-none px-5 py-3 bg-emerald-600 text-white font-medium text-sm rounded-xl hover:bg-emerald-700 active:bg-emerald-800 transition-colors disabled:opacity-60">
              {sheetStatus?.ok ? 'Saved ✓' : 'Save to Sheets'}
            </button>
          )}
          <button type="button" onClick={handleDownload}
            className="flex-1 sm:flex-none px-5 py-3 bg-blue-600 text-white font-medium text-sm rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm shadow-blue-200">
            Download PDF
          </button>
        </div>
      </div>

      {sheetStatus && (
        <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-medium border ${
          sheetStatus.ok ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          {sheetStatus.msg}
        </div>
      )}

      <PageWrap pageNum={1}>
        <section>
          <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide text-center mb-4">Itinerary</h2>
          <h3 className="text-base font-bold text-blue-900 mb-3">Package Overview</h3>
          <div className="divide-y divide-gray-100 text-sm">
            {[['Destination', o.destination], ['Stay', o.stayBreakdown], ['Start Date', o.startDate], ['Duration', o.tripDuration], ['Pax', `${o.pax} Adults`]]
              .map(([label, value]) => (
                <div key={label as string} className="flex py-2.5">
                  <span className="w-1/3 text-gray-500 font-medium shrink-0">{label as string}</span>
                  <span className="text-gray-900">{value || '-'}</span>
                </div>
              ))}
          </div>
        </section>
      </PageWrap>

      {hotelOptions.length > 0 && (
        <PageWrap pageNum={pages.find((p) => p.type === 'Hotels')?.pageNumber}>
          <section>
            <h3 className="text-base font-bold text-blue-900 mb-3">Hotels</h3>
            {hotelOptions.map((opt) => (
              <div key={opt.id} className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2 text-sm">{opt.title}</h4>
                <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden text-sm">
                  {opt.stays.map((s) => (
                    <div key={s.id} className="px-3 py-2.5 space-y-1">
                      <p className="font-medium text-gray-800">{s.hotelName}</p>
                      <p className="text-xs text-gray-500">{s.nights} · {s.city} · {s.mealPlan.join(', ')} · {s.accommodation}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {pricing.length > 0 && (
            <section className="mt-5">
              <h3 className="text-base font-bold text-blue-900 mb-3">Pricing</h3>
              <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden text-sm">
                {pricing.map((p) => (
                  <div key={p.optionId} className="flex justify-between px-3 py-2.5">
                    <span className="font-medium text-gray-800">{p.optionTitle}</span>
                    <span className="font-semibold text-gray-900">₹ {p.amount}/- {p.includesGST && <span className="text-xs text-gray-500 font-normal">(incl. GST)</span>}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(t.vehicle || t.days.length > 0) && (
            <section className="mt-5">
              <h3 className="text-base font-bold text-blue-900 mb-3">Transportation</h3>
              <div className="text-sm space-y-2">
                {t.vehicle && <p className="text-gray-700"><span className="font-medium">Vehicle:</span> {t.vehicle}</p>}
                {t.days.length > 0 && (
                  <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
                    {t.days.map((d) => (
                      <div key={d.id} className="px-3 py-2.5">
                        <p className="font-medium text-gray-800 text-xs">{d.day}</p>
                        <p className="text-gray-600 text-xs mt-0.5">{d.service}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}
        </PageWrap>
      )}

      <PageWrap pageNum={pages.find((p) => p.type === 'Inclusions & Exclusions')?.pageNumber}>
        <section>
          <h3 className="text-base font-bold text-blue-900 mb-3">Inclusions</h3>
          <ul className="space-y-1.5 text-sm text-gray-700 mb-5 list-disc list-inside">
            {ie.inclusions.filter(Boolean).map((item, i) => <li key={i}>{item}</li>)}
          </ul>
          <h3 className="text-base font-bold text-blue-900 mb-3">Exclusions</h3>
          <ul className="space-y-1.5 text-sm text-gray-700 list-disc list-inside">
            {ie.exclusions.filter(Boolean).map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </section>
      </PageWrap>

      {itineraryDays.map((day) => {
        const pageInfo = pages.find((p) => p.id === `day-${day.id}`)
        return (
          <PageWrap key={day.id} pageNum={pageInfo?.pageNumber}>
            <section>
              <h4 className="text-base font-bold text-blue-800 mb-1">{day.day}</h4>
              <h5 className="font-medium text-gray-700 text-sm mb-1">{day.title}</h5>
              {(day.distance || day.travelTime) && (
                <p className="text-xs text-gray-500 mb-2">{[day.distance && `Distance: ${day.distance}`, day.travelTime && `Travel Time: ${day.travelTime}`].filter(Boolean).join(' · ')}</p>
              )}
              {day.description && <p className="text-sm text-gray-700 mb-2">{day.description}</p>}
              {day.points.filter(Boolean).length > 0 && (
                <ul className="space-y-1 text-sm text-gray-700 list-disc list-inside">
                  {day.points.filter(Boolean).map((point, i) => <li key={i}>{point}</li>)}
                </ul>
              )}
            </section>
          </PageWrap>
        )
      })}

      {gallery.length > 0 && Array.from({ length: Math.ceil(gallery.length / 6) }).map((_, pageIdx) => {
        const pageInfo = pages.find((p) => p.id === `gallery-${pageIdx}`)
        return (
          <PageWrap key={`gallery-${pageIdx}`} pageNum={pageInfo?.pageNumber}>
            <section>
              <h3 className="text-base font-bold text-blue-900 mb-3">Gallery</h3>
              <div className="grid grid-cols-3 gap-2">
                {gallery.slice(pageIdx * 6, (pageIdx + 1) * 6).map((img) => (
                  <div key={img.id} className="aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                    <img src={img.url} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  </div>
                ))}
              </div>
            </section>
          </PageWrap>
        )
      })}

      {terms.length > 0 && (
        <PageWrap pageNum={pages.find((p) => p.type === 'Terms & Conditions')?.pageNumber}>
          <section>
            <h3 className="text-base font-bold text-blue-900 mb-3">Terms</h3>
            {terms.map((section) => (
              <div key={section.id} className="mb-4">
                <h4 className="font-semibold text-gray-800 text-sm mb-1">{section.title}</h4>
                <p className="text-sm text-gray-700 whitespace-pre-line">{section.content}</p>
              </div>
            ))}
          </section>
        </PageWrap>
      )}

      <PageWrap pageNum={pages.find((p) => p.type === 'Company Details')?.pageNumber}>
        <section>
          <h3 className="text-base font-bold text-blue-900 mb-3">Company</h3>
          {cd.companyName && <p className="font-semibold text-gray-800 text-sm">{cd.companyName}</p>}
          {cd.legalInfo && <p className="text-sm text-gray-700 mt-1">{cd.legalInfo}</p>}
          {cd.badges.filter(Boolean).length > 0 && (
            <div className="mt-3 space-y-1">
              <p className="text-sm font-medium text-gray-700">Certifications:</p>
              {cd.badges.filter(Boolean).map((badge, i) => <p key={i} className="text-sm text-amber-700">★ {badge}</p>)}
            </div>
          )}
        </section>
        <section className="mt-6">
          <h3 className="text-base font-bold text-blue-900 mb-3">Contact</h3>
          <div className="text-sm text-gray-700 space-y-1.5">
            {ci.ownerName && <p><span className="font-medium">Name:</span> {ci.ownerName}</p>}
            {ci.mobile && <p><span className="font-medium">Mobile:</span> {ci.mobile}</p>}
            {ci.email && <p><span className="font-medium">Email:</span> {ci.email}</p>}
            {ci.instagram && <p><span className="font-medium">Instagram:</span> {ci.instagram}</p>}
            {ci.officeAddress && <p><span className="font-medium">Address:</span> {ci.officeAddress}</p>}
          </div>
        </section>
      </PageWrap>

      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8 mb-12">
        {isSheetsConfigured() && (
          <button type="button" onClick={handleSaveToSheets} disabled={sheetStatus?.ok}
            className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 text-white font-semibold text-sm rounded-xl hover:bg-emerald-700 active:bg-emerald-800 transition-colors shadow-sm disabled:opacity-60">
            {sheetStatus?.ok ? 'Saved ✓' : 'Save to Google Sheets'}
          </button>
        )}
        <button type="button" onClick={handleDownload}
          className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm shadow-blue-200">
          Download PDF
        </button>
      </div>
    </div>
  )
}

function PageWrap({ pageNum, children }: { pageNum?: number; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex-1 border-t border-gray-200" />
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Page {pageNum}</span>
        <div className="flex-1 border-t border-gray-200" />
      </div>
      <div className="bg-white shadow-sm border border-gray-200 p-5 sm:p-8 rounded-2xl sm:rounded-none sm:shadow-lg mx-auto" style={{ width: '100%', maxWidth: '210mm' }}>
        {children}
        <div className="mt-6 pt-4 text-center text-xs text-gray-400 border-t border-gray-100">Page {pageNum}</div>
      </div>
    </div>
  )
}
