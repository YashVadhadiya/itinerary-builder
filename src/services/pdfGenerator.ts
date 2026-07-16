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

  function addPageBreak() {
    doc.content.push({ text: '', pageBreak: 'before' })
  }

  const doc: any = {
    pageSize: 'A4',
    pageMargins: [50, 40, 50, 40],
    content: [],
    defaultStyle: { font: 'Roboto' },
    styles: {
      header: { fontSize: 18, bold: true, margin: [0, 0, 0, 6] },
      subheader: { fontSize: 13, bold: true, margin: [0, 0, 0, 4], color: '#1e40af' },
      sectionTitle: { fontSize: 14, bold: true, margin: [0, 0, 0, 6], color: '#1e3a5f' },
      bodyText: { fontSize: 10, lineHeight: 1.4, margin: [0, 0, 0, 4] },
      small: { fontSize: 9, color: '#555' },
    },
  }

  // ═══════════ 1. PACKAGE OVERVIEW ═══════════
  doc.content.push(
    { text: 'ITINERARY', style: 'header', alignment: 'center', margin: [0, 20, 0, 8] },
    { text: 'Package Overview', style: 'sectionTitle', margin: [0, 0, 0, 6] },
    {
      table: {
        headerRows: 0,
        widths: ['auto', '*'],
        body: [
          [{ text: 'Destination', style: 'small', bold: true, fillColor: '#f3f4f6' }, { text: overview.destination || '-', style: 'small' }],
          [{ text: 'Stay Breakdown', style: 'small', bold: true, fillColor: '#f3f4f6' }, { text: overview.stayBreakdown || '-', style: 'small' }],
          [{ text: 'Start Date', style: 'small', bold: true, fillColor: '#f3f4f6' }, { text: overview.startDate || '-', style: 'small' }],
          [{ text: 'Trip Duration', style: 'small', bold: true, fillColor: '#f3f4f6' }, { text: overview.tripDuration || '-', style: 'small' }],
          [{ text: 'Pax', style: 'small', bold: true, fillColor: '#f3f4f6' }, { text: `${overview.pax} Adults`, style: 'small' }],
        ],
      },
      layout: 'lightHorizontalLines',
      margin: [0, 0, 0, 16],
    },
  )

  // ═══════════ 2. HOTELS + PRICING + TRANSPORT ═══════════
  if (hotels.length > 0) {
    addPageBreak()
    doc.content.push({ text: 'HOTELS', style: 'sectionTitle' })
    for (const opt of hotels) {
      doc.content.push(
        { text: opt.title || 'Hotel Option', style: 'subheader', margin: [0, 8, 0, 4] },
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*', '*', '*', '*'],
            body: [
              [
                { text: 'Nights', style: 'small', bold: true },
                { text: 'City', style: 'small', bold: true },
                { text: 'Hotel Name', style: 'small', bold: true },
                { text: 'Meal Plan', style: 'small', bold: true },
                { text: 'Accommodation', style: 'small', bold: true },
              ],
              ...opt.stays.map((s) => [
                { text: s.nights || '-', style: 'small' },
                { text: s.city || '-', style: 'small' },
                { text: s.hotelName || '-', style: 'small' },
                { text: s.mealPlan.join(', ') || '-', style: 'small' },
                { text: s.accommodation || '-', style: 'small' },
              ]),
            ],
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 8],
        },
      )
    }

    // Pricing
    if (pricing.length > 0) {
      doc.content.push({ text: 'PRICING', style: 'sectionTitle', margin: [0, 12, 0, 6] })
      for (const p of pricing) {
        doc.content.push({
          columns: [
            { text: p.optionTitle, style: 'bodyText', bold: true },
            { text: `₹ ${p.amount}/- ${p.includesGST ? '(incl. GST)' : ''}`, style: 'bodyText', alignment: 'right', bold: true },
          ],
        })
      }
    }

    // Transportation
    if (transport.vehicle || transport.days.length > 0) {
      doc.content.push({ text: 'TRANSPORTATION', style: 'sectionTitle', margin: [0, 12, 0, 4] })
      doc.content.push({ text: `Vehicle: ${transport.vehicle || 'N/A'}`, style: 'bodyText', margin: [0, 0, 0, 6] })
      if (transport.days.length > 0) {
        doc.content.push({
          table: {
            headerRows: 1,
            widths: ['auto', '*'],
            body: [
              [{ text: 'Day', style: 'small', bold: true }, { text: 'Service', style: 'small', bold: true }],
              ...transport.days.map((d) => [
                { text: d.day || '-', style: 'small' },
                { text: d.service || '-', style: 'small' },
              ]),
            ],
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 8],
        })
      }
    }
  }

  // ═══════════ 3. INCLUSIONS / EXCLUSIONS ═══════════
  addPageBreak()
  doc.content.push({ text: 'INCLUSIONS', style: 'sectionTitle' })
  const inclusions = inclusionsExclusions.inclusions.filter(Boolean)
  if (inclusions.length > 0) {
    for (const inc of inclusions) {
      doc.content.push({ text: `•  ${inc}`, style: 'bodyText', margin: [0, 0, 0, 2] })
    }
  } else {
    doc.content.push({ text: '•  No inclusions listed', style: 'bodyText', color: '#999' })
  }

  doc.content.push({ text: 'EXCLUSIONS', style: 'sectionTitle', margin: [0, 14, 0, 6] })
  const exclusions = inclusionsExclusions.exclusions.filter(Boolean)
  if (exclusions.length > 0) {
    for (const exc of exclusions) {
      doc.content.push({ text: `•  ${exc}`, style: 'bodyText', margin: [0, 0, 0, 2] })
    }
  } else {
    doc.content.push({ text: '•  No exclusions listed', style: 'bodyText', color: '#999' })
  }

  // ═══════════ 4. DAY WISE ITINERARY ═══════════
  for (const day of days) {
    addPageBreak()
    doc.content.push(
      { text: `${day.day}`, style: 'subheader' },
      { text: day.title, style: 'sectionTitle', margin: [0, 0, 0, 6] },
    )
    if (day.distance || day.travelTime) {
      const parts: string[] = []
      if (day.distance) parts.push(`Distance: ${day.distance}`)
      if (day.travelTime) parts.push(`Travel Time: ${day.travelTime}`)
      doc.content.push({ text: parts.join('  ·  '), style: 'small', color: '#666', margin: [0, 0, 0, 6] })
    }
    if (day.description) {
      doc.content.push({ text: day.description, style: 'bodyText' })
    }
    const points = day.points.filter(Boolean)
    if (points.length > 0) {
      for (const point of points) {
        doc.content.push({ text: `•  ${point}`, style: 'bodyText', margin: [0, 0, 0, 2] })
      }
    }
  }

  // ═══════════ 5. GALLERY ═══════════
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

  const galleryDataUrls = await Promise.all(gallery.map((img) => imageToDataUrl(img.url)))

  if (gallery.length > 0) {
    addPageBreak()
    doc.content.push({ text: 'PHOTO GALLERY', style: 'sectionTitle' })
    const perPage = 6
    const galleryPages = Math.ceil(gallery.length / perPage)
    for (let p = 0; p < galleryPages; p++) {
      if (p > 0) addPageBreak()
      const pageImages = gallery.slice(p * perPage, (p + 1) * perPage)
      const pageDataUrls = galleryDataUrls.slice(p * perPage, (p + 1) * perPage)
      const gridRows: any[] = []
      for (let i = 0; i < pageImages.length; i += 3) {
        const row: any[] = pageImages.slice(i, i + 3).map((_, idx) => {
          const dataUrl = pageDataUrls[i + idx]
          return dataUrl
            ? { image: dataUrl, width: 150, height: 110, margin: [0, 0, 8, 8] }
            : { text: '', width: 150, height: 110, margin: [0, 0, 8, 8] }
        })
        while (row.length < 3) {
          row.push({ text: '', width: 150, height: 110, margin: [0, 0, 8, 8] })
        }
        gridRows.push(row)
      }
      doc.content.push({
        table: { body: gridRows },
        layout: 'noBorders',
        margin: [0, 8, 0, 0],
      })
    }
  }

  // ═══════════ 6. TERMS & CONDITIONS ═══════════
  if (terms.length > 0) {
    addPageBreak()
    doc.content.push({ text: 'TERMS & CONDITIONS', style: 'sectionTitle' })
    for (const section of terms) {
      doc.content.push(
        { text: section.title, style: 'subheader', margin: [0, 8, 0, 4] },
        { text: section.content, style: 'bodyText' },
      )
    }
  }

  // ═══════════ 7. COMPANY DETAILS ═══════════
  addPageBreak()
  doc.content.push({ text: 'COMPANY DETAILS', style: 'sectionTitle' })
  if (company.companyName) doc.content.push({ text: company.companyName, style: 'subheader', margin: [0, 0, 0, 4] })
  if (company.legalInfo) doc.content.push({ text: company.legalInfo, style: 'bodyText' })
  const badges = company.badges.filter(Boolean)
  if (badges.length > 0) {
    doc.content.push({ text: 'Certifications & Badges', style: 'subheader', margin: [0, 10, 0, 4] })
    for (const badge of badges) {
      doc.content.push({ text: `★  ${badge}`, style: 'bodyText' })
    }
  }

  // ═══════════ 8. CONTACT US ═══════════
  doc.content.push({ text: 'CONTACT US', style: 'sectionTitle', margin: [0, 16, 0, 6] })
  const contactRows: any[] = []
  if (contact.ownerName) contactRows.push([{ text: 'Name', style: 'small', bold: true }, { text: contact.ownerName, style: 'small' }])
  if (contact.mobile) contactRows.push([{ text: 'Mobile', style: 'small', bold: true }, { text: contact.mobile, style: 'small' }])
  if (contact.email) contactRows.push([{ text: 'Email', style: 'small', bold: true }, { text: contact.email, style: 'small' }])
  if (contact.instagram) contactRows.push([{ text: 'Instagram', style: 'small', bold: true }, { text: contact.instagram, style: 'small' }])
  if (contact.officeAddress) contactRows.push([{ text: 'Address', style: 'small', bold: true }, { text: contact.officeAddress, style: 'small' }])
  if (contactRows.length > 0) {
    doc.content.push({
      table: { headerRows: 0, widths: ['auto', '*'], body: contactRows },
      layout: 'noBorders',
      margin: [0, 0, 0, 8],
    })
  }

  // ═══════════ FOOTER ═══════════
  doc.footer = (currentPage: number, pageCount: number) => ({
    text: `Page ${currentPage} of ${pageCount}`,
    alignment: 'center',
    style: 'small',
    margin: [0, 10, 0, 0],
  })

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
