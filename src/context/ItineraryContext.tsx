import { createContext, useContext, useReducer, type ReactNode } from 'react'
import type { PackageOverview, HotelOption, Transportation, PricingEntry, InclusionsExclusions, ItineraryDay, TermsSection, GalleryImage, CompanyDetails, ContactInfo } from '../types'

interface ItineraryState {
  packageOverview: PackageOverview
  hotelOptions: HotelOption[]
  transportation: Transportation
  pricing: PricingEntry[]
  inclusionsExclusions: InclusionsExclusions
  itineraryDays: ItineraryDay[]
  terms: TermsSection[]
  gallery: GalleryImage[]
  companyDetails: CompanyDetails
  contactInfo: ContactInfo
}

type Action =
  | { type: 'SET_PACKAGE_OVERVIEW'; payload: PackageOverview }
  | { type: 'SET_HOTEL_OPTIONS'; payload: HotelOption[] }
  | { type: 'SET_TRANSPORTATION'; payload: Transportation }
  | { type: 'SET_PRICING'; payload: PricingEntry[] }
  | { type: 'SET_INCLUSIONS_EXCLUSIONS'; payload: InclusionsExclusions }
  | { type: 'SET_ITINERARY_DAYS'; payload: ItineraryDay[] }
  | { type: 'SET_TERMS'; payload: TermsSection[] }
  | { type: 'SET_GALLERY'; payload: GalleryImage[] }
  | { type: 'SET_COMPANY_DETAILS'; payload: CompanyDetails }
  | { type: 'SET_CONTACT_INFO'; payload: ContactInfo }

const initialState: ItineraryState = {
  packageOverview: {
    destination: '',
    stayBreakdown: '',
    startDate: '',
    tripDuration: '',
    pax: 1,
  },
  hotelOptions: [],
  transportation: { vehicle: '', days: [] },
  pricing: [],
  inclusionsExclusions: { inclusions: [''], exclusions: [''] },
  itineraryDays: [],
  terms: [],
  gallery: [],
  companyDetails: { companyName: '', legalInfo: '', badges: [''] },
  contactInfo: { ownerName: '', mobile: '', email: '', instagram: '', officeAddress: '' },
}

function reducer(state: ItineraryState, action: Action): ItineraryState {
  switch (action.type) {
    case 'SET_PACKAGE_OVERVIEW':
      return { ...state, packageOverview: action.payload }
    case 'SET_HOTEL_OPTIONS':
      return { ...state, hotelOptions: action.payload }
    case 'SET_TRANSPORTATION':
      return { ...state, transportation: action.payload }
    case 'SET_PRICING':
      return { ...state, pricing: action.payload }
    case 'SET_INCLUSIONS_EXCLUSIONS':
      return { ...state, inclusionsExclusions: action.payload }
    case 'SET_ITINERARY_DAYS':
      return { ...state, itineraryDays: action.payload }
    case 'SET_TERMS':
      return { ...state, terms: action.payload }
    case 'SET_GALLERY':
      return { ...state, gallery: action.payload }
    case 'SET_COMPANY_DETAILS':
      return { ...state, companyDetails: action.payload }
    case 'SET_CONTACT_INFO':
      return { ...state, contactInfo: action.payload }
    default:
      return state
  }
}

interface ItineraryContextType {
  state: ItineraryState
  dispatch: React.Dispatch<Action>
}

const ItineraryContext = createContext<ItineraryContextType | null>(null)

export function ItineraryProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <ItineraryContext.Provider value={{ state, dispatch }}>
      {children}
    </ItineraryContext.Provider>
  )
}

export function useItinerary() {
  const ctx = useContext(ItineraryContext)
  if (!ctx) throw new Error('useItinerary must be used within ItineraryProvider')
  return ctx
}
