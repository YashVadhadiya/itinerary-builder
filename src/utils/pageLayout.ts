import type { HotelOption, Transportation, PricingEntry, ItineraryDay, TermsSection, GalleryImage } from '../types'

export interface PageSection {
  id: string
  type: string
  pageNumber: number
}

export function getPageStructure(
  hotels: HotelOption[],
  transport: Transportation,
  pricing: PricingEntry[],
  days: ItineraryDay[],
  terms: TermsSection[],
  gallery: GalleryImage[],
): PageSection[] {
  const pages: PageSection[] = []
  let pageNum = 1

  pages.push({ id: 'overview', type: 'Package Overview', pageNumber: pageNum })

  if (hotels.length > 0) {
    pageNum++
    pages.push({ id: 'hotels', type: 'Hotels', pageNumber: pageNum })
  }

  if (pricing.length > 0) {
    pages.push({ id: 'pricing', type: 'Pricing', pageNumber: pageNum })
  }

  if (transport.vehicle || transport.days.length > 0) {
    pages.push({ id: 'transport', type: 'Transportation', pageNumber: pageNum })
  }

  pageNum++
  pages.push({ id: 'inclusions', type: 'Inclusions & Exclusions', pageNumber: pageNum })

  for (const day of days) {
    pageNum++
    pages.push({ id: `day-${day.id}`, type: `Day: ${day.day}`, pageNumber: pageNum })
  }

  if (gallery.length > 0) {
    const galleryPages = Math.ceil(gallery.length / 6)
    for (let p = 0; p < galleryPages; p++) {
      pageNum++
      pages.push({ id: `gallery-${p}`, type: `Photo Gallery (Page ${p + 1})`, pageNumber: pageNum })
    }
  }

  if (terms.length > 0) {
    pageNum++
    pages.push({ id: 'terms', type: 'Terms & Conditions', pageNumber: pageNum })
  }

  pageNum++
  pages.push({ id: 'company', type: 'Company Details', pageNumber: pageNum })

  pages.push({ id: 'contact', type: 'Contact Us', pageNumber: pageNum })

  return pages
}
