import type {
  PackageOverview, HotelOption, Transportation,
  PricingEntry, InclusionsExclusions, ItineraryDay,
  TermsSection, GalleryImage, CompanyDetails, ContactInfo,
} from '../types'

let pdfMake: any = null
let pdfInit: Promise<void> | null = null

async function ensurePdfMake() {
  if (pdfInit) return pdfInit
  pdfInit = (async () => {
    const mod = await import('./pdfMakeInit')
    pdfMake = mod.default || mod
  })()
  return pdfInit
}

function labelRow(label: string, value: string) {
  return {
    columns: [
      { text: label, style: 'label', width: '30%' },
      { text: value || '-', style: 'value', width: '*' },
    ],
    margin: [0, 0, 0, 6],
  }
}

export async function generatePdf(
  overview: PackageOverview,
  hotels: HotelOption[],
  transport: Transportation,
  pricing: PricingEntry[],
  inclusionsExclusions: InclusionsExclusions,
  days: ItineraryDay[],
  terms: TermsSection[],
  gallery: GalleryImage[],
  company: CompanyDetails,
  contact: ContactInfo,
) {
  await ensurePdfMake()

  const content: any[] = []

  function sec(text: string) {
    return { text, style: 'sectionTitle', margin: [0, 18, 0, 8] }
  }
  function sub(text: string) {
    return { text, style: 'subLabel', margin: [0, 0, 0, 4] }
  }
  function pt(text: string) {
    return { text: `•  ${text}`, style: 'bodyText', margin: [0, 0, 0, 2] }
  }

  // ═══════════ HEADER ═══════════
  content.push(
    { text: 'ITINERARY', style: 'docTitle', alignment: 'center', margin: [0, 0, 0, 18] },
  )

  // ═══════════ 1. PACKAGE OVERVIEW ═══════════
  content.push(
    { text: 'Package Overview', style: 'sectionTitle', margin: [0, 0, 0, 10] },
    labelRow('Destination', overview.destination),
    labelRow('Stay', overview.stayBreakdown),
    labelRow('Start Date', overview.startDate),
    labelRow('Duration', overview.tripDuration),
    labelRow('Pax', `${overview.pax} Adults`),
  )

  // ═══════════ 2. HOTELS ═══════════
  if (hotels.length > 0) {
    content.push(sec('Hotels'))
    for (const opt of hotels) {
      const rows: any[] = [[
        { text: 'Nights', style: 'th' },
        { text: 'City', style: 'th' },
        { text: 'Hotel Name', style: 'th' },
        { text: 'Meal', style: 'th' },
        { text: 'Room', style: 'th' },
      ]]
      for (const stay of opt.stays) {
        rows.push([
          { text: stay.nights, style: 'td' },
          { text: stay.city, style: 'td' },
          { text: stay.hotelName, style: 'td' },
          { text: stay.mealPlan.join(', '), style: 'td' },
          { text: stay.accommodation, style: 'td' },
        ])
      }
      content.push(
        { text: opt.title, style: 'optionTitle', margin: [0, 0, 0, 6] },
        { table: { headerRows: 1, widths: ['auto', 'auto', '*', 'auto', '*'], body: rows }, layout: 'lightHorizontalLines', margin: [0, 0, 0, 10] },
      )
    }

    // ═══════════ 3. PRICING ═══════════
    if (pricing.length > 0) {
      content.push(sec('Pricing'))
      for (const p of pricing) {
        content.push({
          columns: [
            { text: p.optionTitle, style: 'bodyText', bold: true },
            { text: `₹ ${p.amount}/- ${p.includesGST ? '(incl. GST)' : ''}`, style: 'bodyText', bold: true, alignment: 'right' },
          ],
          margin: [0, 0, 0, 4],
        })
      }
    }

    // ═══════════ 4. TRANSPORTATION ═══════════
    if (transport.vehicle || transport.days.length > 0) {
      content.push(sec('Transportation'))
      if (transport.vehicle) {
        content.push({ text: `Vehicle: ${transport.vehicle}`, style: 'bodyText', margin: [0, 0, 0, 6] })
      }
      if (transport.days.length > 0) {
        const tRows: any[] = [
          [{ text: 'Day', style: 'th' }, { text: 'Service', style: 'th' }],
        ]
        for (const d of transport.days) {
          tRows.push([{ text: d.day, style: 'td' }, { text: d.service, style: 'td' }])
        }
        content.push({ table: { headerRows: 1, widths: ['auto', '*'], body: tRows }, layout: 'lightHorizontalLines', margin: [0, 0, 0, 10] })
      }
    }
  }

  // ═══════════ 5. INCLUSIONS / EXCLUSIONS ═══════════
  const filterIncs = inclusionsExclusions.inclusions.filter(Boolean)
  const filterExcs = inclusionsExclusions.exclusions.filter(Boolean)
  if (filterIncs.length > 0 || filterExcs.length > 0) {
    content.push(sec('Inclusions & Exclusions'))
    if (filterIncs.length > 0) {
      content.push(sub('Inclusions'))
      for (const inc of filterIncs) content.push(pt(inc))
    }
    if (filterExcs.length > 0) {
      content.push({ ...sub('Exclusions'), margin: [0, 10, 0, 4] })
      for (const exc of filterExcs) content.push(pt(exc))
    }
  }

  // ═══════════ 6. DAY WISE ITINERARY ═══════════
  if (days.length > 0) {
    content.push(sec('Day Wise Itinerary'))
    for (const day of days) {
      content.push(
        { text: day.day, style: 'dayTitle', margin: [0, 0, 0, 2] },
        { text: day.title, style: 'daySubtitle', margin: [0, 0, 0, 4] },
      )
      if (day.distance || day.travelTime) {
        const parts: string[] = []
        if (day.distance) parts.push(`Distance: ${day.distance}`)
        if (day.travelTime) parts.push(`Travel Time: ${day.travelTime}`)
        content.push({ text: parts.join('  ·  '), style: 'meta', margin: [0, 0, 0, 4] })
      }
      if (day.description) {
        content.push({ text: day.description, style: 'bodyText', margin: [0, 0, 0, 4] })
      }
      const pts = day.points.filter(Boolean)
      if (pts.length > 0) {
        for (const p of pts) content.push(pt(p))
      }
      content.push({ text: '', margin: [0, 0, 0, 6] })
    }
  }

  // ═══════════ 7. GALLERY ═══════════
  async function imageToDataUrl(url: string): Promise<string> {
    if (url.startsWith('data:')) return url
    try {
      const resp = await fetch(url)
      const blob = await resp.blob()
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.readAsDataURL(blob)
      })
    } catch {
      return ''
    }
  }

  if (gallery.length > 0) {
    content.push(sec('Gallery'))
    const galleryDataUrls = await Promise.all(gallery.map((img) => imageToDataUrl(img.url)))
    const gridRows: any[] = []
    for (let i = 0; i < galleryDataUrls.length; i += 3) {
      const row: any[] = galleryDataUrls.slice(i, i + 3).map((url) =>
        url ? { image: url, width: 160, height: 120, margin: [0, 0, 6, 6] } : { text: '', width: 160, height: 120 }
      )
      while (row.length < 3) row.push({ text: '', width: 160, height: 120 })
      gridRows.push(row)
    }
    if (gridRows.length > 0) {
      content.push({ table: { body: gridRows }, layout: 'noBorders', margin: [0, 0, 0, 10] })
    }
  }

  // ═══════════ 8. TERMS & CONDITIONS ═══════════
  if (terms.length > 0) {
    content.push(sec('Terms & Conditions'))
    for (const section of terms) {
      content.push(
        sub(section.title),
        { text: section.content, style: 'bodyText', margin: [0, 0, 0, 10] },
      )
    }
  }

  // ═══════════ 9. COMPANY + CONTACT ═══════════
  content.push(sec('Company Details'))
  if (company.companyName) content.push({ text: company.companyName, style: 'optionTitle', margin: [0, 0, 0, 4] })
  if (company.legalInfo) content.push({ text: company.legalInfo, style: 'bodyText', margin: [0, 0, 0, 6] })
  const badges = company.badges.filter(Boolean)
  if (badges.length > 0) {
    content.push(sub('Badges'))
    for (const badge of badges) content.push(pt(badge))
  }

  content.push(sec('Contact'))
  if (contact.ownerName) content.push(labelRow('Name', contact.ownerName))
  if (contact.mobile) content.push(labelRow('Mobile', contact.mobile))
  if (contact.email) content.push(labelRow('Email', contact.email))
  if (contact.instagram) content.push(labelRow('Instagram', contact.instagram))
  if (contact.officeAddress) content.push(labelRow('Address', contact.officeAddress))

  // ═══════════ BUILD DOC ═══════════
  const doc: any = {
    pageSize: 'A4',
    pageMargins: [50, 50, 50, 50],
    content,
    defaultStyle: { font: 'Roboto', fontSize: 10, color: '#374151' },
    styles: {
      docTitle: { fontSize: 16, bold: true, color: '#1f2937' },
      sectionTitle: { fontSize: 12, bold: true, color: '#1e40af' },
      optionTitle: { fontSize: 10, bold: true, color: '#1f2937' },
      dayTitle: { fontSize: 11, bold: true, color: '#1e40af' },
      daySubtitle: { fontSize: 10, bold: true, color: '#374151' },
      subLabel: { fontSize: 10, bold: true, color: '#4b5563' },
      bodyText: { fontSize: 9.5, lineHeight: 1.45, color: '#374151' },
      meta: { fontSize: 9, color: '#6b7280' },
      label: { fontSize: 9.5, bold: true, color: '#6b7280' },
      value: { fontSize: 9.5, color: '#1f2937' },
      th: { fontSize: 9, bold: true, color: '#4b5563', fillColor: '#f9fafb' },
      td: { fontSize: 9, color: '#374151' },
    },
    footer: (currentPage: number, pageCount: number) => ({
      text: `Page ${currentPage} of ${pageCount}`,
      alignment: 'center',
      fontSize: 8,
      color: '#9ca3af',
      margin: [0, 10, 0, 0],
    }),
  }

  // ═══════════ GENERATE ═══════════
  const destination = overview.destination || 'itinerary'
  const filename = `Itinerary_${destination.replace(/\s+/g, '_')}.pdf`

  try {
    const pdfDoc = pdfMake.createPdf(doc)
    pdfDoc.download(filename)
  } catch (err) {
    console.error('PDF download error:', err)
    try {
      const pdfDoc = pdfMake.createPdf(doc)
      pdfDoc.getBlob((blob: Blob) => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        setTimeout(() => URL.revokeObjectURL(url), 10000)
      })
    } catch (err2) {
      console.error('PDF fallback error:', err2)
      alert('Failed to generate PDF. Check the browser console (F12) for details.')
    }
  }
}

export async function downloadSamplePdf() {
  await ensurePdfMake()

  const sampleData = await import('../utils/sampleData')
  const { sampleOverview, sampleHotelOptions, sampleTransportation, samplePricing, sampleInclusionsExclusions, sampleItineraryDays, sampleTerms, sampleCompanyDetails, sampleContactInfo, sampleGallery } = sampleData

  return generatePdf(
    sampleOverview,
    sampleHotelOptions,
    sampleTransportation,
    samplePricing,
    sampleInclusionsExclusions,
    sampleItineraryDays,
    sampleTerms,
    sampleGallery || [],
    sampleCompanyDetails,
    sampleContactInfo,
  )
}
