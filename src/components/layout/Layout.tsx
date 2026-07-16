import { Link, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useItinerary } from '../../context/ItineraryContext'
import {
  sampleOverview, sampleHotelOptions, sampleTransportation,
  samplePricing, sampleInclusionsExclusions, sampleItineraryDays,
  sampleTerms, sampleCompanyDetails, sampleContactInfo,
} from '../../utils/sampleData'

const STEPS = [
  { path: '/create', label: 'Overview' },
  { path: '/create/hotels', label: 'Hotels' },
  { path: '/create/transport', label: 'Transport' },
  { path: '/create/pricing', label: 'Pricing' },
  { path: '/create/inclusions-exclusions', label: 'Inc/Exc' },
  { path: '/create/itinerary-days', label: 'Days' },
  { path: '/create/terms', label: 'Terms' },
  { path: '/create/gallery', label: 'Gallery' },
  { path: '/create/company', label: 'Company' },
  { path: '/create/contact', label: 'Contact' },
]

export default function Layout({ children }: { children: ReactNode }) {
  const { dispatch } = useItinerary()
  const location = useLocation()

  const currentStep = STEPS.findIndex((s) => s.path === location.pathname)
  const isPreview = location.pathname === '/create/preview'
  const showSteps = currentStep >= 0 && !isPreview

  function loadSampleData() {
    dispatch({ type: 'SET_PACKAGE_OVERVIEW', payload: sampleOverview })
    dispatch({ type: 'SET_HOTEL_OPTIONS', payload: sampleHotelOptions })
    dispatch({ type: 'SET_TRANSPORTATION', payload: sampleTransportation })
    dispatch({ type: 'SET_PRICING', payload: samplePricing })
    dispatch({ type: 'SET_INCLUSIONS_EXCLUSIONS', payload: sampleInclusionsExclusions })
    dispatch({ type: 'SET_ITINERARY_DAYS', payload: sampleItineraryDays })
    dispatch({ type: 'SET_TERMS', payload: sampleTerms })
    dispatch({ type: 'SET_COMPANY_DETAILS', payload: sampleCompanyDetails })
    dispatch({ type: 'SET_CONTACT_INFO', payload: sampleContactInfo })
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-safe">
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/80 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="text-base font-bold text-gray-900 tracking-tight">
            ✦ Itinerary
          </Link>

          <button
            type="button"
            onClick={loadSampleData}
            className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100 active:bg-blue-200 transition-colors"
          >
            Sample
          </button>
        </div>

        {showSteps && (
          <div className="border-t border-gray-100 bg-white px-4 overflow-x-auto scrollbar-hide">
            <div className="flex gap-1 py-2.5 min-w-max max-w-3xl mx-auto">
              {STEPS.map((step, idx) => {
                const isActive = idx === currentStep
                const isDone = idx < currentStep
                return (
                  <div key={step.path} className="flex items-center gap-1">
                    {idx > 0 && (
                      <div className={`w-4 h-px ${isDone ? 'bg-blue-500' : 'bg-gray-200'}`} />
                    )}
                    <div
                      className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold transition-colors ${
                        isActive ? 'bg-blue-600 text-white shadow-sm' :
                        isDone ? 'bg-blue-100 text-blue-600' :
                        'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {isDone ? '✓' : idx + 1}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </header>

      <main className="pb-20">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>
    </div>
  )
}
