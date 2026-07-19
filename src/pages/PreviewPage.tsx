import { useState, useMemo, useRef, useEffect, Fragment } from 'react'
import { useItinerary } from '../context/ItineraryContext'
import { generatePdf } from '../services/pdfGenerator'
import { saveItineraryToSheets, isSheetsConfigured } from '../services/googleSheets'

const PAGE_W = 210
const PAGE_H = 297
const PAGE_PAD = 12
const HEADER_H = 14
const FOOTER_H = 11
const CONTENT_H = PAGE_H - PAGE_PAD * 2 - HEADER_H - FOOTER_H
const PAGE_SAFE_ZONE = 5

export default function PreviewPage() {
  const { state } = useItinerary()
  const { hotelOptions, transportation: t, pricing, itineraryDays, terms, gallery } = state
  const { packageOverview: o, inclusionsExclusions: ie, companyDetails: cd, contactInfo: ci } = state
  const [sheetStatus, setSheetStatus] = useState<{ ok?: boolean; msg: string } | null>(null)
  const [pageGroups, setPageGroups] = useState<number[][]>([])
  const measureRef = useRef<HTMLDivElement>(null)

  async function handleDownload() {
    try {
      await generatePdf()
    } catch (err: any) {
      console.error('PDF download failed:', err)
      alert('Failed to download PDF. Check browser console (F12) for details.\n\n' + (err?.message || ''))
    }
  }

  async function handleSaveToSheets() {
    setSheetStatus(null)
    try {
      const id = await saveItineraryToSheets({ packageOverview: o, hotelOptions, transportation: t, pricing, inclusionsExclusions: ie, itineraryDays, terms, companyDetails: cd, contactInfo: ci })
      setSheetStatus({ ok: true, msg: `Saved! ID: ${id.slice(0, 8)}\u2026` })
    } catch (err: any) {
      setSheetStatus({ ok: false, msg: err?.message || 'Failed to save' })
    }
  }

  const sections = useMemo(() => {
    const list: { id: string; el: React.ReactNode }[] = []
    const push = (id: string, node: React.ReactNode) => { list.push({ id, el: node }) }

    push('overview', (
      <>
        <DocTitle overview={o} />
        <PackageOverviewSection overview={o} />
      </>
    ))

    if (hotelOptions.length > 0) {
      push('hotels', <HotelsSection options={hotelOptions} />)
    }

    if (pricing.length > 0) {
      push('pricing', <PricingSection entries={pricing} />)
    }

    if (t.vehicle || t.days.length > 0) {
      push('transport', <TransportationSection transport={t} />)
    }

    push('inclusions', <InclusionsSection data={ie} />)

    for (const day of itineraryDays) {
      push(`day-${day.id}`, <DaySection day={day} />)
    }

    if (gallery.length > 0) {
      const pages = Math.ceil(gallery.length / 6)
      for (let p = 0; p < pages; p++) {
        push(`gallery-${p}`, (
          <>
            <SectionTitle text="Gallery" />
            <GallerySection images={gallery.slice(p * 6, (p + 1) * 6)} />
          </>
        ))
      }
    }

    if (terms.length > 0) {
      const first = (
        <>
          <SectionTitle text="Terms & Conditions" />
          <TermsSection terms={[terms[0]]} startNum={1} />
        </>
      )
      push('terms-header', first)
      for (let i = 1; i < terms.length; i++) {
        push(`term-${terms[i].id}`, <TermsSection terms={[terms[i]]} startNum={i + 1} />)
      }
    }

    push('company', (
      <>
        <SectionTitle text="Company & Contact" />
        <CompanySection company={cd} contact={ci} />
      </>
    ))

    return list
  }, [o, hotelOptions, t, pricing, ie, itineraryDays, gallery, terms, cd, ci])

  useEffect(() => {
    if (!measureRef.current || sections.length === 0) return
    const children = Array.from(measureRef.current.children) as HTMLElement[]
    const heights = children.map((el) => el.offsetHeight)

    const pageHeightPx = (CONTENT_H - PAGE_SAFE_ZONE) * (96 / 25.4)
    const gapPx = 12
    const groups: number[][] = []
    let cur: number[] = []
    let curH = 0

    for (let i = 0; i < heights.length; i++) {
      const h = heights[i] + gapPx
      if (curH + h > pageHeightPx && cur.length > 0) {
        groups.push(cur)
        cur = [i]
        curH = h
      } else {
        cur.push(i)
        curH += h
      }
    }
    if (cur.length > 0) groups.push(cur)

    setPageGroups(groups)
  }, [sections])

  return (
    <div>
      <div className="print:hidden max-w-[210mm] mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Preview</h1>
            <p className="text-sm text-gray-500">{pageGroups.length} page{pageGroups.length > 1 ? 's' : ''}</p>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {isSheetsConfigured() && (
              <button type="button" onClick={handleSaveToSheets} disabled={sheetStatus?.ok}
                className="flex-1 sm:flex-none px-5 py-3 bg-emerald-600 text-white font-medium text-sm rounded-xl hover:bg-emerald-700 active:bg-emerald-800 transition-colors disabled:opacity-60 cursor-pointer">
                {sheetStatus?.ok ? 'Saved \u2713' : 'Save to Sheets'}
              </button>
            )}
            <button type="button" onClick={handleDownload}
              className="flex-1 sm:flex-none px-5 py-3 bg-blue-600 text-white font-medium text-sm rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm shadow-blue-200 cursor-pointer">
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
      </div>

      <div aria-hidden="true" ref={measureRef}
        style={{ position: 'absolute', left: '-9999px', width: `${PAGE_W - PAGE_PAD * 2}mm` }}>
        {sections.map((s) => <div key={s.id}>{s.el}</div>)}
      </div>

      <div id="print-content" className="max-w-[210mm] mx-auto">
        {pageGroups.length === 0 && (
          <div className="text-center py-20 text-gray-400 text-sm">Calculating page layout...</div>
        )}
        {pageGroups.map((group, pgIdx) => (
          <PageWrap key={pgIdx} pageNum={pgIdx + 1} totalPages={pageGroups.length} companyName={cd.companyName}>
            {group.map((si) => <Fragment key={sections[si].id}>{sections[si].el}</Fragment>)}
          </PageWrap>
        ))}
      </div>

      <div className="print:hidden flex flex-col sm:flex-row gap-3 justify-center mt-8 mb-12">
        {isSheetsConfigured() && (
          <button type="button" onClick={handleSaveToSheets} disabled={sheetStatus?.ok}
            className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 text-white font-semibold text-sm rounded-xl hover:bg-emerald-700 active:bg-emerald-800 transition-colors shadow-sm disabled:opacity-60 cursor-pointer">
            {sheetStatus?.ok ? 'Saved \u2713' : 'Save to Google Sheets'}
          </button>
        )}
        <button type="button" onClick={handleDownload}
          className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm shadow-blue-200 cursor-pointer">
          Download PDF
        </button>
      </div>
    </div>
  )
}

/* ─── Page Layout ─── */

function PageWrap({ pageNum, totalPages, companyName, children }: {
  pageNum: number; totalPages: number; companyName: string; children: React.ReactNode
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center mb-2 print:hidden">
        <div className="flex-1 border-t border-gray-200" />
        <span className="px-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Page {pageNum}</span>
        <div className="flex-1 border-t border-gray-200" />
      </div>
      <div
        data-page-id={pageNum}
        className="bg-white shadow-sm border border-gray-200 mx-auto"
        style={{
          width: `${PAGE_W}mm`,
          height: `${PAGE_H}mm`,
          overflow: 'hidden',
          padding: `${PAGE_PAD}mm`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div className="shrink-0" style={{ height: `${HEADER_H}mm` }}>
          <div className="h-[2.5px] bg-blue-700 w-full" />
          <div className="flex items-center" style={{ height: `${HEADER_H - 2.5}mm` }}>
            <span className="flex-1" />
            <span className="text-[11px] font-bold text-gray-800 uppercase tracking-[2px]">Itinerary</span>
            <span className="flex-1 text-[10px] text-gray-400 text-right">Page {pageNum} of {totalPages}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 text-[15px] leading-relaxed text-gray-800 space-y-3 overflow-hidden">
          {children}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-gray-300" style={{ height: `${FOOTER_H}mm` }}>
          <div className="flex items-center justify-center text-[9px] text-gray-400" style={{ height: `${FOOTER_H - 1}mm` }}>
            {companyName || 'Travel Itinerary'} &mdash; Confidential Document
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Title / Cover ─── */

function DocTitle({ overview: o }: { overview: { destination: string; stayBreakdown: string; startDate: string; tripDuration: string; pax: number } }) {
  return (
    <div className="text-center pb-3 mb-3" style={{ borderBottom: '2px solid #1d4ed8' }}>
      <div className="text-[24px] font-bold text-gray-900 uppercase tracking-[3px] leading-tight">
        {o.destination}
      </div>
      <div className="mt-1 text-[13px] text-gray-500 uppercase tracking-[4px] font-medium">
        Travel Itinerary
      </div>
      <div className="mt-2 inline-block bg-blue-50 border border-blue-200 rounded-sm px-3 py-1">
        <span className="text-[13px] font-semibold text-blue-800">{o.tripDuration}</span>
      </div>
    </div>
  )
}

/* ─── Section Title ─── */

function SectionTitle({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-blue-700 rounded-sm px-3 py-1">
        <span className="text-[13px] font-bold text-white uppercase tracking-[1px]">{text}</span>
      </div>
      <div className="flex-1 h-px bg-gray-300" />
    </div>
  )
}

/* ─── Field Row ─── */

function FieldRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex items-baseline gap-2 text-[15px] px-2 py-1 ${highlight ? 'bg-amber-50 rounded' : ''}`}>
      <span className="text-gray-500 shrink-0 w-24 font-medium">{label}</span>
      <span className="font-semibold text-gray-900">{value || '\u2014'}</span>
    </div>
  )
}

/* ─── Package Overview ─── */

function PackageOverviewSection({ overview: o }: { overview: { destination: string; stayBreakdown: string; startDate: string; tripDuration: string; pax: number } }) {
  return (
    <div className="border border-gray-200 rounded-sm overflow-hidden">
      <div className="bg-gray-50 px-3 py-1.5 border-b border-gray-200">
        <span className="text-[13px] font-bold text-gray-700 uppercase tracking-[1px]">Package Overview</span>
      </div>
      <div className="p-2">
        <FieldRow label="Destination" value={o.destination} />
        <FieldRow label="Stay" value={o.stayBreakdown} highlight />
        <FieldRow label="Start Date" value={o.startDate} />
        <FieldRow label="Duration" value={o.tripDuration} />
        <FieldRow label="Pax" value={`${o.pax} Adults`} />
      </div>
    </div>
  )
}

/* ─── Hotels ─── */

function SubTitle({ text }: { text: string }) {
  return (
    <div className="inline-block bg-blue-50 border border-blue-100 rounded-sm px-2.5 py-0.5 mb-1">
      <span className="text-[12px] font-bold text-blue-800">{text}</span>
    </div>
  )
}

function HotelsSection({ options }: { options: { id: string; title: string; stays: { id: string; nights: string; city: string; hotelName: string; mealPlan: string[]; accommodation: string }[] }[] }) {
  return (
    <div className="space-y-3">
      <SectionTitle text="Hotels" />
      {options.map((opt) => (
        <div key={opt.id}>
          <SubTitle text={opt.title} />
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr className="bg-blue-700 text-white">
                <th className="text-left font-bold px-2 py-1.5">Nights</th>
                <th className="text-left font-bold px-2 py-1.5">City</th>
                <th className="text-left font-bold px-2 py-1.5">Hotel Name</th>
                <th className="text-center font-bold px-2 py-1.5">Meal Plan</th>
                <th className="text-left font-bold px-2 py-1.5">Accommodation</th>
              </tr>
            </thead>
            <tbody>
              {opt.stays.map((stay, idx) => {
                const isCityStart = idx === 0 || stay.city !== opt.stays[idx - 1].city
                const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                return (
                  <tr key={stay.id} className={`${rowBg} border-b border-gray-100`}>
                    <td className="px-2 py-1.5 align-top text-gray-600">{stay.nights}</td>
                    <td className="px-2 py-1.5 align-top">
                      {isCityStart ? <span className="font-semibold text-gray-900">{stay.city}</span> : ''}
                    </td>
                    <td className="px-2 py-1.5 align-top">
                      <span className="font-semibold text-gray-900">{stay.hotelName}</span>
                    </td>
                    <td className="px-2 py-1.5 align-top text-center">
                      <span className="inline-block bg-gray-100 rounded-sm px-1.5 py-0.5 text-[10px] font-medium text-gray-700">
                        {stay.mealPlan[0] || ''}
                      </span>
                      {stay.mealPlan.length > 1 && (
                        <span className="text-gray-400 text-[10px] block">
                          ({stay.mealPlan.slice(1).join(', ')})
                        </span>
                      )}
                    </td>
                    <td className="px-2 py-1.5 align-top">
                      <span className="font-semibold text-gray-900">{stay.accommodation}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className="text-[9px] text-gray-400 text-right mt-0.5">Based on 4 Pax sharing</div>
        </div>
      ))}
    </div>
  )
}

/* ─── Pricing ─── */

function PricingSection({ entries }: { entries: { optionId: string; optionTitle: string; amount: string; includesGST: boolean }[] }) {
  return (
    <div className="space-y-3">
      <SectionTitle text="Pricing" />
      {entries.map((p) => (
        <div key={p.optionId}>
          <SubTitle text={p.optionTitle} />
          <div className="border border-gray-200 rounded-sm overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-[12px] text-gray-500 font-medium">Total Amount</span>
              <div className="flex items-center gap-2">
                <span className="text-[19px] font-bold text-gray-900">
                  {'\u20B9'} {p.amount}/-
                </span>
                {p.includesGST && (
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-sm px-1.5 py-0.5 font-medium">
                    GST Incl.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── Transportation ─── */

function TransportationSection({ transport: t }: { transport: { vehicle: string; days: { id: string; day: string; service: string }[] } }) {
  return (
    <div className="space-y-2">
      <SectionTitle text="Transportation" />
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[13px] text-gray-500 font-medium">Vehicle:</span>
        <span className="inline-block bg-blue-50 border border-blue-100 rounded-sm px-2.5 py-0.5 text-[13px] font-semibold text-blue-800">
          {t.vehicle}
        </span>
      </div>
      {t.days.length > 0 && (
        <div className="space-y-0">
          {t.days.map((d, idx) => (
            <div key={d.id} className="flex gap-2.5">
              <div className="flex flex-col items-center shrink-0" style={{ width: 18 }}>
                <div className="w-[16px] h-[16px] rounded-full bg-blue-100 border-2 border-blue-700 shrink-0" />
                {idx < t.days.length - 1 && <div className="w-[1.5px] flex-1 bg-gray-200" />}
              </div>
              <div className="flex-1 pb-2">
                <div className="text-[13px] font-semibold text-blue-800">{d.day}</div>
                <div className="text-[14px] text-gray-700 leading-snug">{d.service}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Inclusions & Exclusions ─── */

function InclusionsSection({ data: ie }: { data: { inclusions: string[]; exclusions: string[] } }) {
  const incs = ie.inclusions.filter(Boolean)
  const excs = ie.exclusions.filter(Boolean)
  if (incs.length === 0 && excs.length === 0) return null

  return (
    <div className="space-y-2">
      <SectionTitle text="Inclusions & Exclusions" />
      <div className="grid grid-cols-2 gap-2.5">
        {incs.length > 0 && (
          <div className="border border-emerald-200 rounded-sm overflow-hidden">
            <div className="bg-emerald-600 px-2 py-1">
              <span className="text-[13px] font-bold text-white">Inclusions</span>
            </div>
            <ul className="p-2 space-y-0.5">
              {incs.map((item, i) => (
                <li key={i} className="flex gap-1.5 text-[13px] text-gray-700 leading-snug">
                  <span className="text-emerald-600 shrink-0 mt-px font-bold">{'\u2713'}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {excs.length > 0 && (
          <div className="border border-red-200 rounded-sm overflow-hidden">
            <div className="bg-red-500 px-2 py-1">
              <span className="text-[13px] font-bold text-white">Exclusions</span>
            </div>
            <ul className="p-2 space-y-0.5">
              {excs.map((item, i) => (
                <li key={i} className="flex gap-1.5 text-[13px] text-gray-700 leading-snug">
                  <span className="text-red-500 shrink-0 mt-px font-bold">{'\u2717'}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Day-wise Itinerary ─── */

function DaySection({ day }: { day: { id: string; day: string; title: string; distance: string; travelTime: string; description: string; points: string[] } }) {
  const dayNum = parseInt(day.day.match(/\d+/)?.[0] || '0', 10)
  return (
    <div className="flex gap-3 pb-2 mb-2 border-b border-dashed border-gray-200 last:border-b-0 last:mb-0 last:pb-0">
      <div className="flex flex-col items-center shrink-0" style={{ width: 26 }}>
        <div className="w-[24px] h-[24px] rounded-full bg-blue-700 flex items-center justify-center">
          <span className="text-[13px] font-bold text-white">{dayNum || '\u2022'}</span>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-[15px] font-bold text-gray-900 leading-snug">{day.title}</h4>
        {(day.distance || day.travelTime) && (
          <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
            {day.distance && (
              <span className="text-[10px] text-gray-500 bg-gray-50 border border-gray-200 rounded-sm px-1.5 py-0.5">
                {'\u25CF'} {day.distance}
              </span>
            )}
            {day.travelTime && (
              <span className="text-[10px] text-gray-500 bg-gray-50 border border-gray-200 rounded-sm px-1.5 py-0.5">
                {'\u25CF'} {day.travelTime}
              </span>
            )}
          </div>
        )}
        {day.description && (
          <p className="text-[14px] text-gray-700 mt-1 leading-relaxed">{day.description}</p>
        )}
        {day.points.filter(Boolean).length > 0 && (
          <ul className="mt-1 space-y-0.5">
            {day.points.filter(Boolean).map((point, i) => (
              <li key={i} className="flex gap-1.5 text-[12px] text-gray-700 leading-snug">
                <span className="text-blue-500 shrink-0 mt-px">{'\u25B8'}</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

/* ─── Gallery ─── */

function GallerySection({ images }: { images: { id: string; url: string }[] }) {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {images.map((img) => (
        <div key={img.id} className="aspect-[4/3] bg-gray-100 border border-gray-200 rounded-sm overflow-hidden">
          <img src={img.url} alt="" className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
        </div>
      ))}
    </div>
  )
}

/* ─── Terms & Conditions ─── */

function TermsSection({ terms, startNum = 1 }: {
  terms: { id: string; title: string; content: string }[];
  startNum?: number
}) {
  return (
    <div className="space-y-2">
      {terms.map((section, idx) => (
        <div key={section.id} className={idx < terms.length - 1 ? 'pb-2 border-b border-gray-100' : ''}>
          <h4 className="text-[14px] font-bold text-gray-800 mb-0.5">
            <span className="text-blue-700">{startNum + idx}.</span> {section.title}
          </h4>
          <p className="text-[13px] text-gray-600 whitespace-pre-line leading-relaxed">{section.content}</p>
        </div>
      ))}
    </div>
  )
}

/* ─── Company & Contact ─── */

function CompanySection({ company: cd, contact: ci }: {
  company: { companyName: string; legalInfo: string; badges: string[] };
  contact: { ownerName: string; mobile: string; email: string; instagram: string; officeAddress: string }
}) {
  return (
    <div>
      <div className="text-center pb-2 mb-2" style={{ borderBottom: '1px solid #d1d5db' }}>
        {cd.companyName && (
          <p className="text-[15px] font-bold text-gray-900 uppercase tracking-[1px]">{cd.companyName}</p>
        )}
        {cd.legalInfo && (
          <p className="text-[10px] text-gray-500 mt-0.5">{cd.legalInfo}</p>
        )}
      </div>

      {cd.badges.filter(Boolean).length > 0 && (
        <div className="flex flex-wrap gap-1 justify-center mb-2">
          {cd.badges.filter(Boolean).map((badge, i) => (
            <span key={i} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-50 text-amber-800 text-[10px] rounded-sm border border-amber-200">
              {'\u2605'} {badge}
            </span>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[13px]">
        {ci.ownerName && (
          <div className="flex gap-1.5">
            <span className="text-gray-400 shrink-0">Name:</span>
            <span className="text-gray-800 font-medium">{ci.ownerName}</span>
          </div>
        )}
        {ci.mobile && (
          <div className="flex gap-1.5">
            <span className="text-gray-400 shrink-0">Mobile:</span>
            <span className="text-gray-800 font-medium">{ci.mobile}</span>
          </div>
        )}
        {ci.email && (
          <div className="flex gap-1.5">
            <span className="text-gray-400 shrink-0">Email:</span>
            <span className="text-gray-800 font-medium">{ci.email}</span>
          </div>
        )}
        {ci.instagram && (
          <div className="flex gap-1.5">
            <span className="text-gray-400 shrink-0">Instagram:</span>
            <span className="text-gray-800 font-medium">{ci.instagram}</span>
          </div>
        )}
        {ci.officeAddress && (
          <div className="flex gap-1.5 col-span-2">
            <span className="text-gray-400 shrink-0">Address:</span>
            <span className="text-gray-800 font-medium">{ci.officeAddress}</span>
          </div>
        )}
      </div>
    </div>
  )
}
