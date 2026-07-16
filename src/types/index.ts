export interface PackageOverview {
  destination: string
  stayBreakdown: string
  startDate: string
  tripDuration: string
  pax: number
}

export interface HotelStay {
  id: string
  nights: string
  city: string
  hotelName: string
  mealPlan: string[]
  accommodation: string
}

export interface HotelOption {
  id: string
  title: string
  stays: HotelStay[]
}

export interface TransportDay {
  id: string
  day: string
  service: string
}

export interface Transportation {
  vehicle: string
  days: TransportDay[]
}

export interface PricingEntry {
  optionId: string
  optionTitle: string
  amount: string
  includesGST: boolean
}

export interface InclusionsExclusions {
  inclusions: string[]
  exclusions: string[]
}

export interface ItineraryDay {
  id: string
  day: string
  title: string
  distance: string
  travelTime: string
  description: string
  points: string[]
}

export interface TermsSection {
  id: string
  title: string
  content: string
}

export interface GalleryImage {
  id: string
  url: string
  file?: File
}

export interface CompanyDetails {
  companyName: string
  legalInfo: string
  badges: string[]
}

export interface ContactInfo {
  ownerName: string
  mobile: string
  email: string
  instagram: string
  officeAddress: string
}
